import { connectToDatabase } from "./lib/database";
const isImageURL = require("image-url-validator").default;
import { getServerSession } from "next-auth/next";

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (session) {
    const db = await connectToDatabase();
    if (req.method === "POST") {
      const newSource = req.body.url;
      if ((await isImageURL(newSource)) == false) {
        res.status(403).json({ status: "Invalid file format", code: 403 });
      } else {
        const collection = db.collection("config");

        const filter = { id: "main" };

        const updateDoc = {
          $set: {
            player: {
              source: newSource,
            },
          },
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(
          `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );
        res.status(200).json({ status: "API called sucessfully", code: 200 });
      }
    }
  } else {
    res.status(401);
  }
  res.end();
};
