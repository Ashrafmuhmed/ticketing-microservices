import request from "supertest";
import { signin } from "../../test/setup";
import { app } from "../../app";

// titles are unique in the model, so each ticket needs its own title
const createTicket = (title: string) =>
  request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price: 20 })
    .expect(201);

describe("GET /api/tickets", () => {
  it("returns an empty list when there are no tickets", async () => {
    const res = await request(app).get("/api/tickets").send().expect(200);
    expect(res.body).toEqual([]);
  });

  it("can fetch a list of tickets", async () => {
    await createTicket("concert");
    await createTicket("movie");
    await createTicket("match");

    const res = await request(app).get("/api/tickets").send().expect(200);
    expect(res.body).toHaveLength(3);
  });
});
