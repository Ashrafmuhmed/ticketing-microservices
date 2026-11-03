import request from "supertest";
import { app } from "../../app";
import { faker } from "@faker-js/faker";

it("returns a 201 on successful signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" });

  expect(res.statusCode).toBe(201);
  expect(res.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 with an invalid email", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({ email: "testestcom", password: "password" });
  expect(res.statusCode).toBe(400);
});

it("returns a 400 with an invalid password", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({ email: "testestcom", password: "]" });
  expect(res.statusCode).toBe(400);
});

it("returns a 400 with an invalid email and password", async () => {
  const res = await request(app).post("/api/users/signup").send({});
  const containEmailAndPassword =
    res.body.errors.some(
      (e: { message: string; field?: string }) => e.field === "email",
    ) &&
    res.body.errors.some(
      (e: { message: string; field?: string }) => e.field === "password",
    ) &&
    res.statusCode === 400;

  expect(containEmailAndPassword).toBe(true);
});

it("disallows duplicate emails", async () => {
  const registerEmail = faker.internet.email();
  await request(app)
    .post("/api/users/signup")
    .send({ email: registerEmail, password: faker.internet.password() });

  const secondRes = await request(app)
    .post("/api/users/signup")
    .send({ email: registerEmail, password: faker.internet.password() });
  // console.log(secondRes.headers, secondRes.header, secondRes.get("Set-Cookie"));
  expect(secondRes.statusCode).toBe(400);
  expect(secondRes.body.errors[0].message).toBe("this email is used before");
});
