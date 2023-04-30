import { connectToDatabase } from "./lib/database";
import { getServerSession } from "next-auth/next";

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (session) {
    const db = await connectToDatabase();
    if (req.method === "GET") {
      const collection = await db.collection("authorizedUsers");
      const data = await collection.distinct("email");
      res.status(200).json(data);
    }
  } else {
    res.status(401);
  }
  res.end();
};
