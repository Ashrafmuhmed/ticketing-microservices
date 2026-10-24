import express from "express";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentuserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(async (_, __, next) => {
  throw new NotFoundError("this route is not found");
});
app.use(errorHandler);

const start = async () => {
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
