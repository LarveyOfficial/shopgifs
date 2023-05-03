import { connectToDatabase } from "./lib/database";
import { getServerSession } from "next-auth/next";

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (session) {
    const db = await connectToDatabase();
    if (req.method === "GET") {
      if (req.body.action == "admin") {
      } else {
        const collection = await db.collection("authorizedUsers");
        const data = await collection.find().toArray();
        res.status(200).json(data);
      }
    } else if (req.method === "POST") {
      if (req.body.action == "delete") {
        const userEmail = req.body.email;
        const requestor = session.user.email;
        const collection = db.collection("authorizedUsers");

        const authQuery = { email: requestor };

        const authResult = await collection.findOne(authQuery);

        if (!authResult.admin) {
          res.stauts(401).json({
            status: "You are not allowed to preform this action",
            code: 401,
          });
        } else {
          const query = { email: userEmail };

          const result = await collection.deleteOne(query);
          if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
            res
              .status(200)
              .json({ status: "API called sucessfully", code: 200 });
          } else {
            res.status(500).json({
              status: "No documents with given query found",
              code: 500,
            });
          }
        }
      } else if (req.body.action == "create") {
        const userEmail = req.body.email;
        const userName = req.body.name;
        const isAdmin = req.body.admin == "true" ? true : false;
        const requestor = session.user.email;
        const collection = db.collection("authorizedUsers");

        const authQuery = { email: requestor };

        const authResult = await collection.findOne(authQuery);

        if (!authResult.admin) {
          res.stauts(401).json({
            status: "You are not allowed to preform this action",
            code: 401,
          });
        } else {
          const query = { email: userEmail };

          const findUser = await collection.findOne(query);
          if (findUser) {
            res
              .status(422)
              .json({ status: "This user already exists", code: 422 });
          } else {
            const newUser = {
              email: userEmail,
              admin: isAdmin,
              name: userName,
            };

            const addUser = await collection.insertOne(newUser);
            console.log("Successfully added new User");
            res
              .status(200)
              .json({ addUser, status: "API called sucessfully", code: 200 });
          }
        }
      } else {
        res.status(404).json({ status: "404 Route not found" });
      }
    } else {
      res.status(404).json({ status: "404 Route not found" });
    }
  } else {
    res.status(401);
  }
  res.end();
};
