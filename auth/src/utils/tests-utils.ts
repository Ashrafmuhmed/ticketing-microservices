import request from "supertest";
import { app } from "../app";

export const signinRequest = async (email?: string, password?: string) => {
  return await request(app).post("/api/users/signin").send({ email, password });
};

export const signupRequest = async (email?: string, password?: string) => {
  return await request(app).post("/api/users/signup").send({ email, password });
};
