import { body } from "express-validator";

const ticketBodyValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title cant be empty")
    .isLength({ min: 3, max: 20 })
    .withMessage("title length should be from 3 to 20 chars"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than zero"),
];

export const createTicketValidator = ticketBodyValidator;
export const updateTicketValidator = ticketBodyValidator;
