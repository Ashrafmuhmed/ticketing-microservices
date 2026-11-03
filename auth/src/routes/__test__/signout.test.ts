import request from "supertest";
import { app } from "../../app";
import { signupRequest } from "../../utils/tests-utils";

it("clears the cookie after signing out", async () => {
  await signupRequest("test@test.com", "password");

  const res = await request(app).post("/api/users/signout").send({});

  expect(res.statusCode).toBe(200);
  expect(res.get("Set-Cookie")?.[0]).toMatch(
    /^session=;.*expires=Thu, 01 Jan 1970 00:00:00 GMT/,
  );
});

it("responds with 200 even when not signed in", async () => {
  const res = await request(app).post("/api/users/signout").send({});

  expect(res.statusCode).toBe(200);
});
