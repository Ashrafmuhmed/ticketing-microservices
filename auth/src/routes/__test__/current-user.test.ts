import request from "supertest";
import { app } from "../../app";
import { signupRequest } from "../../utils/tests-utils";

it("responds with details about the current user", async () => {
  const signupRes = await signupRequest("test@test.com", "password");
  const cookie = signupRes.get("Set-Cookie")!;

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send();

  expect(res.statusCode).toBe(200);
  expect(res.body.currentUser.email).toBe("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const res = await request(app).get("/api/users/currentuser").send();

  expect(res.statusCode).toBe(200);
  expect(res.body.currentUser).toBeNull();
});

it("responds with null if the JWT is tampered with", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", [`session=asddsasasad`])
    .send();

  expect(res.statusCode).toBe(200);
  expect(res.body.currentUser).toBeNull();
});
