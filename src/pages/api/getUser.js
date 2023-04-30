import { connectToDatabase } from "./lib/database";
import { getServerSession } from "next-auth/next";

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (session) {
    const db = await connectToDatabase();
    if (req.method === "GET") {
      const collection = await db.collection("authorizedUsers");
      const query = { email: req.headers.email };
      const data = await collection.findOne(query);
      if (!data) {
        res.status(404).json({ res: 404 });
      }
      res.status(200).json(data);
    }
  } else {
    res.status(401);
  }
  res.end();
};
