import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { UserRepository } from "../repositories/user.repository";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").trim().isEmail().withMessage("email must be provided"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password length must be bet 4 : 20"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    // await UserModel.create({email:'ass@gmail.com',password:})
    const user = await UserRepository.createUser({ email, password });
    res.status(201).send(user);
  },
);

export { router as signupRouter };
