import express, { Request, Response } from "express";
import { AuthValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validate-request";
import { UserModel } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../utils/passwrod";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signin",
  AuthValidation.signinValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("invalid credentials");
    }
    const passwrodMatch = await Password.compare(
      existingUser.password,
      password,
    );
    if (!passwrodMatch) {
      throw new BadRequestError("invalid credentials");
    }

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET!,
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send({ user: existingUser });
  },
);

export { router as signinRouter };
