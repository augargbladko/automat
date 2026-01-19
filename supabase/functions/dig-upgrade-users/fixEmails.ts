import { getDb } from "../mongodb/mongo.ts"
import { denoConnectToSupabase } from "../queries/database/supaFunc.ts"
import { EmailCol } from "../types/database.ts"
import { Tables } from "../types/index.ts"
import { generatePromoCode } from "../users/data/wordlist.ts"
import { MongoUser } from "../utils/types.ts"

// deno run --allow-all --env-file supabase/functions/dig-upgrade-users/fixEmails.ts

interface EmailFixRecord {
  telegram_id: number
  email: string
  confirmed_email: boolean
  new_email: string
  new_telegram_id: number
  new_first_name: string
  status_text: string
}

async function updateSupabaseProfile(
  supabase: ReturnType<typeof denoConnectToSupabase>,
  record: EmailFixRecord
): Promise<"success" | "notlive" | "failed"> {
  const { data, error } = await supabase
    .from("user_data")
    .update({
      email: record.new_email,
      first_name: record.new_first_name,
      telegram_id: record.new_telegram_id,
    })
    .eq("telegram_id", record.telegram_id)
    .select()
    .single()
  if (error || !data) {
    console.error("Error updating supabase profile:", record, error)
    return "failed"
  } else {
    return data.user_status === "live" ? "success" : "notlive"
  }
}

async function getKlaviyoProfileId(email: string): Promise<string> {
  const url = `https://a.klaviyo.com/api/profiles?filter=equals%28email%2C%27${encodeURIComponent(email)}%27%29&include=&page[size]=1`
  const options = {
    method: "GET",
    headers: {
      accept: "application/vnd.api+json",
      revision: "2026-01-15",
      Authorization: `Klaviyo-API-Key ${Deno.env.get("KLAYVIO_API_KEY")}`,
    },
  }

  const res = await fetch(url, options)
  const data = await res.json()
  return data.data[0]?.id || ""
}

async function updateKlaviyoProfile(
  profileId: string,
  record: EmailFixRecord
): Promise<boolean> {
  const url = `https://a.klaviyo.com/api/profiles/${profileId}`
  const options = {
    method: "PATCH",
    headers: {
      accept: "application/vnd.api+json",
      revision: "2026-01-15",
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${Deno.env.get("KLAYVIO_API_KEY")}`,
    },
    body: `{"data":{"type":"profile","attributes":{"properties":{"telegram_id":"${record.new_telegram_id}"},"email":"${record.new_email}","external_id":"${record.new_telegram_id}"},"id":"${profileId}"}}`,
  }
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      console.error("Klaviyo update failed:", await res.text())
      return false
    }
    return true
  } catch (error) {
    console.error("Klaviyo update error:", error)
    return false
  }
}

async function updateMongoProfile(record: EmailFixRecord): Promise<boolean> {
  try {
    const db = await getDb()
    const update = {
      $set: {
        telegramId: record.new_telegram_id.toString(),
        name: record.new_first_name,
        promoCode: generatePromoCode(record.new_telegram_id.toString()),
      },
    }
    if (record.confirmed_email) {
      Object.assign(update.$set, { confirmedEmail: record.new_email })
    } else {
      Object.assign(update.$set, { requestedEmail: record.new_email })
    }
    const user = await db
      .collection<MongoUser>("User")
      .updateOne({ telegramId: record.telegram_id.toString() }, update, {
        upsert: false,
      })
    return true
  } catch (error) {
    console.error("MongoDB update error:", error)
    return false
  }
}

export async function fixEmails() {
  const supabase = denoConnectToSupabase()

  const { data, error } = await supabase
    .from(Tables.fix_email)
    .select("*")
    .eq(EmailCol.status_text, "none")
    .limit(25)

  if (!data || data.length === 0 || error) {
    return
  }
  console.log("Fixing emails for", data.length, "users")
  const records: EmailFixRecord[] = data as EmailFixRecord[]
  for (const record of records) {
    const supabaseStatus = await updateSupabaseProfile(supabase, record)
    // update supabase profile
    if (supabaseStatus === "notlive") {
      console.log("User", record.telegram_id, "is not yet live")
      // not yet live, so no need to update other systems
      await supabase
        .from(Tables.fix_email)
        .update({ status_text: "fixed" })
        .eq("telegram_id", record.telegram_id)
      continue
    } else if (supabaseStatus !== "success") {
      console.error("Failed to update supabase profile for", record)
      await supabase
        .from(Tables.fix_email)
        .update({ status_text: "supabase_failed" })
        .eq("telegram_id", record.telegram_id)
      continue
    }

    // get the klaviyo user id
    const profileId: string = record.email
      ? await getKlaviyoProfileId(record.email)
      : ""
    console.log(
      `id:${record.telegram_id}>${record.new_telegram_id} email:${record.email}>${record.new_email} name:${record.new_first_name} profileId:${profileId || "not found"}`
    )

    // update Klaviyo profile
    // if there's no klaviyo profile, continue to mongo
    if (profileId && !(await updateKlaviyoProfile(profileId, record))) {
      console.error("Failed to update klaviyo profile for", record)
      await supabase
        .from(Tables.fix_email)
        .update({ status_text: "klaviyo_failed" })
        .eq("telegram_id", record.telegram_id)
      continue
    } else {
      console.log(
        "Updated klaviyo profile for",
        record.email,
        ">",
        record.new_email
      )
    }

    // update mongodb profile
    if (!(await updateMongoProfile(record))) {
      console.error("Failed to update mongo profile for", record)
      await supabase
        .from(Tables.fix_email)
        .update({ status_text: "mongo_failed" })
        .eq("telegram_id", record.telegram_id)
      continue
    } else {
      console.log(
        "Updated mongo profile for",
        record.telegram_id,
        ">",
        record.new_telegram_id
      )
    }

    // update supabase record to fixed
    await supabase
      .from(Tables.fix_email)
      .update({ status_text: "fixed" })
      .eq("telegram_id", record.telegram_id)
  }
}

async function Test() {
  await fixEmails()
  Deno.exit()
}
