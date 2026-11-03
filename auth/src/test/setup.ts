import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET= 'asdfasd'
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections)
    for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
