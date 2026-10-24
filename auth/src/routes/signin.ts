import express, { Request, Response } from "express";
import { AuthValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  AuthValidation.signinValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(200).send("wait in progress");
  },
);

export { router as signinRouter };
