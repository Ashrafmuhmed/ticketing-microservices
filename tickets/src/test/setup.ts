import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../app";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasd";
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


export const signin = (
  id: string = new mongoose.Types.ObjectId().toHexString(),
) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id,
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
