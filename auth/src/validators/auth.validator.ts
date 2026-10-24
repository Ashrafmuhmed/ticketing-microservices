import { body } from "express-validator";

export class AuthValidation {
  static signinValidator = [
    body("email").trim().isEmail().withMessage("email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 8 })
      .withMessage("password must be 4 - 8"),
  ];

  static signupValidator = [
    body("email").trim().isEmail().withMessage("email must be provided"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password length must be bet 4 : 20"),
  ];
}
