const { MongoClient } = require("mongodb");
const env = require("./env");

let client;

async function connectDb() {
  if (!client) {
    client = new MongoClient(env.mongoUri);
    await client.connect();
  }
  return client.db(env.mongoDb).collection(env.mongoCollection);
}

async function closeDb() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { connectDb, closeDb };
