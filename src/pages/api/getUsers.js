import { connectToDatabase } from "./lib/database";

export default async (req, res) => {
  const db = await connectToDatabase();
  if (req.method === "GET") {
    const collection = await db.collection("authorizedUsers");
    const data = await collection.distinct("email");
    res.status(200).json(data);
  }
};
