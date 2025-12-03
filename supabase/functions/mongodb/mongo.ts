/// <reference lib="deno.ns" />

import { Db, MongoClient } from "mongodb"
import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { storeUsers } from "../queries/database/users.ts"

// deno run --allow-all --env-file supabase/functions/mongodb/mongo.ts

export async function getDb(): Promise<Db> {
  const client = new MongoClient(Deno.env.get("DATABASE_URL")!)
  await client.connect()
  return client.db("myFirstDatabase")
}

async function MongoGetTgPics() {
  const db = await getDb()
  const user = db.collection("User")
  const cursor = user.find({})
  const userStrings: string[] = []
  console.log("Fetching Telegram user pics from MongoDB...")
  while (await cursor.hasNext()) {
    const user = await cursor.next()
    if (user) {
      userStrings.push(
        `${user.telegramId},${user.name},${user.userName},${user.photoUrl},${user.tokenBalance},${user.pointsBalance},${user.lastLoginDay}`
      )
    }
  }
  Deno.writeTextFile(
    "supabase/functions/mongodb/tgUsers.csv",
    userStrings.join("\n")
  )
  console.log("Telegram user pics written to tgUsers.csv")
  Deno.exit()
}

async function MongoTest() {
  const db = await getDb()
  const tonPurchase = db.collection("TonPurchase")
  const first = await tonPurchase.findOne({})
  console.log("MongoDB Connection Test, first document:", first)
  const result = await tonPurchase
    .aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$tonPaid",
          },
        },
      },
    ])
    .toArray()
  const tonSpent = (result[0]?.total || 0) / 1e9
  console.log("MongoDB Aggregation Result:", tonSpent)

  // create users with the right schema

  // Add users to klaviyo with the right settings

  Deno.exit()
}

async function UploadPhotos() {
  const file = Deno.readTextFileSync(
    "supabase/functions/mongodb/photo_data.csv"
  )
  const lines = file.split("\r\n").map((line) => {
    const data = line.split(",")
    return {
      telegram_id: Number(data[0]),
      photo_url: data[1],
    }
  })
  console.log("Uploading photo URLs to Supabase for", lines.length, "users")

  const supabase = secureConnectToSupabase()
  for (let i = 1; i < lines.length; i += 1000) {
    await storeUsers(supabase, lines.slice(i, i + 1000))
    console.log("Uploaded photos for users", i, "to", i + 1000)
  }
  Deno.exit()
}
