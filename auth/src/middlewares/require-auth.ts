import { NextFunction, Request, Response } from "express";
import { currentUser } from "./current-user";
import { NotAuthenticatedError } from "../errors/not-authenticated-error";

export const requireAuth = ( req :Request , res:Response , next: NextFunction ) => {
    if(!req.currentUser){
        throw new NotAuthenticatedError();
    }
    next();
}