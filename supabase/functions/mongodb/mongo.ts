import { Db, MongoClient } from "mongodb"
import { updateUser } from "../users/user.ts"

// deno run --allow-all --env-file supabase/functions/mongodb/mongo.ts

export async function getDb(): Promise<Db> {
  const client = await new MongoClient(Deno.env.get("DATABASE_URL")!).connect()
  return client.db("myFirstDatabase")
}

/*async function MongoGetTgPics() {
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
}*/

/*async function MongoTest() {
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
}*/

/*async function UploadPhotos() {
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

  const supabase = denoConnectToSupabase()
  for (let i = 1; i < lines.length; i += 1000) {
    await storeUsers(supabase, lines.slice(i, i + 1000))
    console.log("Uploaded photos for users", i, "to", i + 1000)
  }
  Deno.exit()
}*/

// deno run --allow-all --env-file supabase/functions/mongodb/mongo.ts

const USERS_TO_UPLEVEL = [
  { telegram_id: 88034375, level: 6 },
  { telegram_id: 41593278, level: 6 },
  { telegram_id: 24203935, level: 6 },
  { telegram_id: 89072796, level: 6 },
  { telegram_id: 99955557, level: 6 },
  { telegram_id: 46392314, level: 6 },
  { telegram_id: 99609724, level: 6 },
  { telegram_id: 32337532, level: 5 },
  { telegram_id: 17146785, level: 5 },
  { telegram_id: 19344680, level: 5 },
  { telegram_id: 42042960, level: 5 },
  { telegram_id: 43801603, level: 5 },
  { telegram_id: 30411443, level: 5 },
  { telegram_id: 91694216, level: 4 },
  { telegram_id: 18288606, level: 4 },
  { telegram_id: 46972837, level: 4 },
  { telegram_id: 39408870, level: 3 },
  { telegram_id: 67010526, level: 3 },
  { telegram_id: 39433538, level: 3 },
  { telegram_id: 67966057, level: 3 },
  { telegram_id: 29467315, level: 3 },
  { telegram_id: 31450402, level: 3 },
  { telegram_id: 76327973, level: 3 },
  { telegram_id: 66691412, level: 3 },
  { telegram_id: 70058888, level: 3 },
  { telegram_id: 73052715, level: 3 },
  { telegram_id: 44471975, level: 3 },
  { telegram_id: 24092705, level: 3 },
  { telegram_id: 68341688, level: 3 },
  { telegram_id: 62919691, level: 3 },
  { telegram_id: 87788708, level: 3 },
  { telegram_id: 68412119, level: 2 },
  { telegram_id: 64860797, level: 2 },
  { telegram_id: 41577746, level: 2 },
  { telegram_id: 55138056, level: 2 },
  { telegram_id: 26849056, level: 2 },
  { telegram_id: 87715520, level: 2 },
  { telegram_id: 13582125, level: 2 },
  { telegram_id: 99359451, level: 2 },
  { telegram_id: 92332843, level: 2 },
  { telegram_id: 74365738, level: 2 },
  { telegram_id: 36111547, level: 2 },
  { telegram_id: 57153043, level: 2 },
  { telegram_id: 74888884, level: 2 },
  { telegram_id: 94810639, level: 2 },
  { telegram_id: 54749189, level: 2 },
  { telegram_id: 85583902, level: 2 },
  { telegram_id: 81760473, level: 2 },
  { telegram_id: 71602432, level: 2 },
  { telegram_id: 57980856, level: 2 },
  { telegram_id: 64144214, level: 2 },
  { telegram_id: 55567156, level: 2 },
  { telegram_id: 54773505, level: 2 },
  { telegram_id: 58001288, level: 2 },
  { telegram_id: 37661295, level: 2 },
  { telegram_id: 15116208, level: 2 },
  { telegram_id: 57452889, level: 1 },
  { telegram_id: 10360333, level: 1 },
  { telegram_id: 36137251, level: 1 },
  { telegram_id: 53474766, level: 1 },
  { telegram_id: 39627812, level: 1 },
  { telegram_id: 98654248, level: 1 },
  { telegram_id: 42301375, level: 1 },
  { telegram_id: 19079781, level: 1 },
  { telegram_id: 80288744, level: 1 },
  { telegram_id: 57513695, level: 1 },
  { telegram_id: 21305042, level: 1 },
  { telegram_id: 84179931, level: 1 },
  { telegram_id: 59685599, level: 1 },
  { telegram_id: 23025660, level: 1 },
  { telegram_id: 11579515, level: 1 },
  { telegram_id: 90813670, level: 1 },
  { telegram_id: 89973827, level: 1 },
  { telegram_id: 97579592, level: 1 },
  { telegram_id: 54455035, level: 1 },
  { telegram_id: 55648802, level: 1 },
  { telegram_id: 44340999, level: 1 },
  { telegram_id: 49120817, level: 1 },
  { telegram_id: 40864927, level: 1 },
  { telegram_id: 16510140, level: 1 },
  { telegram_id: 25323544, level: 1 },
  { telegram_id: 40918408, level: 1 },
  { telegram_id: 23272572, level: 1 },
  { telegram_id: 77244204, level: 1 },
  { telegram_id: 74570512, level: 1 },
  { telegram_id: 16368559, level: 1 },
]

async function UplevelUsers() {
  await Promise.all(
    USERS_TO_UPLEVEL.map((u) =>
      updateUser({ level: u.level }, { telegram_id: u.telegram_id })
    )
  )
  Deno.exit()
}
