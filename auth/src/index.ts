import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("jwt secret is required");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("db connected");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Auth service is listening on 3000");
  });
};

start();
