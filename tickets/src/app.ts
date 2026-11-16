import express from "express";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@ashraf.tickets/common";
import { ticketsRouter } from "./routes";
import mongoose from "mongoose";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(currentUser);
app.use("/api/tickets", ticketsRouter);

app.use(async (_, __, next) => {
  throw new NotFoundError("this route is not found");
});
app.use(errorHandler);

export { app };
