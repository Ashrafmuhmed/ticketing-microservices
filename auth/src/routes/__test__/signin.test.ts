import { faker } from "@faker-js/faker";
import { signinRequest, signupRequest } from "../../utils/tests-utils";

it("fails when a email doesnt exist is supplied", async () => {
  const res = await signinRequest(
    faker.internet.email(),
    faker.internet.password(),
  );
  expect(res.statusCode).toBe(400);
});

it("fails when an incorrect password is supplied", async () => {
  const signedupEmail = faker.internet.email();
  const signedupPassword = faker.internet.password();
  const signupRes = await signupRequest(signedupEmail, signedupPassword);
  expect(signupRes.statusCode).toBe(201);

  const signinRes = await signinRequest(
    signedupEmail,
    faker.internet.password(),
  );
  expect(signinRes.statusCode).toBe(400);
});

it("respond with a cookie when the given valid credentials", async () => {
  const signedupEmail = faker.internet.email();
  const signedupPassword = faker.internet.password();
  const signupRes = await signupRequest(signedupEmail, signedupPassword);
  expect(signupRes.statusCode).toBe(201);

  const signinRes = await signinRequest(signedupEmail, signedupPassword);
  expect(signinRes.statusCode).toBe(200);
  expect(signinRes.get("Set-Cookie")).toBeDefined();
});
