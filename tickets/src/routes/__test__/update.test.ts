import request from "supertest";
import mongoose from "mongoose";
import { signin } from "../../test/setup";
import { app } from "../../app";

const createTicket = (cookie: string[] = signin(), title = "concert") =>
  request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price: 20 })
    .expect(201);

// cookie is optional so we can also test the "not signed in" case
const putTicket = (id: string, body: object, cookie?: string[]) => {
  const req = request(app).put(`/api/tickets/${id}`);
  if (cookie) req.set("Cookie", cookie);
  return req.send(body);
};

describe("PUT /api/tickets/:id", () => {
  it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await putTicket(id, { title: "concert", price: 20 }, signin()).expect(404);
  });

  it("returns a 404 if the provided id is not a valid ObjectId", async () => {
    await putTicket("not-an-id", { title: "concert", price: 20 }, signin()).expect(
      404,
    );
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await putTicket(id, { title: "concert", price: 20 }).expect(401);
  });

  it("returns a 401 if the user does not own the ticket", async () => {
    const res = await createTicket();

    await putTicket(res.body.id, { title: "new title", price: 1000 }, signin()).expect(
      401,
    );

    // ticket must be untouched
    const ticket = await request(app).get(`/api/tickets/${res.body.id}`).expect(200);
    expect(ticket.body.title).toEqual("concert");
    expect(ticket.body.price).toEqual(20);
  });

  it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = signin();
    const res = await createTicket(cookie);

    await putTicket(res.body.id, { title: "", price: 20 }, cookie).expect(400);
    await putTicket(res.body.id, { price: 20 }, cookie).expect(400);
    await putTicket(res.body.id, { title: "concert", price: -10 }, cookie).expect(400);
    await putTicket(res.body.id, { title: "concert" }, cookie).expect(400);
  });

  it("returns a 400 if the new title is already used by another ticket", async () => {
    const cookie = signin();
    await createTicket(cookie, "taken");
    const res = await createTicket(cookie, "concert");

    await putTicket(res.body.id, { title: "taken", price: 20 }, cookie).expect(400);
  });

  it("updates the ticket provided valid inputs", async () => {
    const cookie = signin();
    const res = await createTicket(cookie);

    const updated = await putTicket(
      res.body.id,
      { title: "new title", price: 100 },
      cookie,
    ).expect(200);
    expect(updated.body.title).toEqual("new title");
    expect(updated.body.price).toEqual(100);

    const ticket = await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
    expect(ticket.body.title).toEqual("new title");
    expect(ticket.body.price).toEqual(100);
  });
});
