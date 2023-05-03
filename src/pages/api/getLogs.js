import { connectToDatabase } from "./lib/database";
import { getServerSession } from "next-auth/next";

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (session) {
    const db = await connectToDatabase();
    if (req.method === "GET") {
      const collection = await db.collection("logs");
      const data = await collection.find().sort({ date: -1 }).toArray();
      res.status(200).json(data);
    }
    if (req.method === "POST") {
      const collection = await db.collection("logs");
      const date = req.body.date;
      const name = req.body.name;
      const type = req.body.type;
      const url = req.body.url;
      const expireDate = req.body.expireDate;

      const betterName = { email: session.user.email };

      const getCoolName = await collection.findOne(betterName);

      if (getCoolName) {
        name = getCoolName.name;
      }

      const newLog = {
        date: date,
        name: name,
        type: type,
        url: url,
        expireDate: expireDate,
      };

      const logAdded = await collection.insertOne(newLog);
      console.log("Successfully added log");

      const logDeleted = await collection.deleteMany({
        expireDate: { $lt: Date.now() + 1 + "" },
      });

      console.log("Deleted old logs: " + logDeleted.deletedCount);

      res
        .status(200)
        .json({ logAdded, status: "API called sucessfully", code: 200 });
    }
  } else {
    res.status(401);
  }
  res.end();
};
