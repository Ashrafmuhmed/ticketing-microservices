import express, { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import { AuthValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router();

router.post(
  "/api/users/signup",
  AuthValidation.signupValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserRepository.createUser({ email, password });
    const userJwt = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET!,
    );
    req.session = { jwt: userJwt };

    res.status(201).send({ user });
  },
);

export { router as signupRouter };
