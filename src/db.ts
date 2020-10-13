import * as assert from "assert";
import * as Mongo from "mongodb";

let db: Mongo.Db;

export function get() {
  assert.ok(db, "Database has not been initialized. Please call setupDb first.");
  return db;
}

export async function setup() {
  db && console.warn("Running initialization again.");
  const { MONGO_URL, MONGO_INITDB_DATABASE } = process.env;
  const client = await Mongo.MongoClient.connect(MONGO_URL as string, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  db = client.db(MONGO_INITDB_DATABASE);
  return db;
}
