import express from "express";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentuserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

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

app.listen(3000, () => {
  console.log("Auth service is listening on 3000");
});
