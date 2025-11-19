import { MongoClient } from "mongodb";

// deno run --allow-all --env-file supabase/functions/mongodb/mongo.ts

export async function MongoTest() {
  console.log("DB URL:", Deno.env.get("DATABASE_URL"));
  const client = new MongoClient(Deno.env.get("DATABASE_URL")!);
  await client.connect();

  const db = client.db("myFirstDatabase");
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
