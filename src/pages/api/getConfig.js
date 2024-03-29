import { connectToDatabase } from "./lib/database";

export default async (req, res) => {
  const db = await connectToDatabase();
  if (req.method === "GET") {
    const collection = await db.collection("config");
    const data = await collection.find().toArray();
    res.status(200).json(data);
  }
};
