const MongoClient = require("mongodb").MongoClient;
let cachedDb = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    console.log("Using existing DB connection");
    return Promise.resolve(cachedDb);
  }

  return MongoClient.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  })
    .then((client) => {
      let db = client.db("ShopGifs"); // free version
      console.log("New DB Connection");
      cachedDb = db;
      return cachedDb;
    })
    .catch((error) => {
      console.log("Mongo connect Error");
      console.log(error);
    });
};
