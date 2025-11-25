import { Db, MongoClient } from "mongodb";

// deno run --allow-all --env-file supabase/functions/mongodb/mongo.ts

export async function getDb(): Promise<Db> {
  const client = new MongoClient(Deno.env.get("DATABASE_URL")!);
  await client.connect();
  return client.db("myFirstDatabase");
}

export async function MongoTest() {
  const db = await getDb()
  const tonPurchase = db.collection("TonPurchase");
  const first = await tonPurchase.findOne({});
  console.log("MongoDB Connection Test, first document:", first);
  const result = await tonPurchase.aggregate([{
      $group: {
        _id: null,
        total: {
          $sum: "$tonPaid"
        }
      }
  }]).toArray();
  const tonSpent = (result[0]?.total || 0) / 1e9;
  console.log("MongoDB Aggregation Result:", tonSpent);

  // create users with the right schema


  // Add users to klaviyo with the right settings


  Deno.exit();
}

MongoTest();
