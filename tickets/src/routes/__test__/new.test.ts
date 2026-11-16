import request from "supertest";
import { signin } from "../../test/setup";
import { app } from "../../app";
import { TicketRepository } from "../../repository/ticket.repository";

const postTicket = (body: object = {}, cookie: string[] = signin()) =>
  request(app).post("/api/tickets").set("Cookie", cookie).send(body);

describe("POST /api/tickets", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toEqual(404);
  });

  it("returns 401 if the user is not signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("does not return 401 if the user is signed in", async () => {
    const res = await postTicket();
    expect(res.status).not.toEqual(401);
  });

  it("returns an error if the title is empty", async () => {
    await postTicket({ title: "", price: 10 }).expect(400);
  });

  it("returns an error if the title is missing", async () => {
    await postTicket({ price: 10 }).expect(400);
  });

  it("returns an error if the price is negative", async () => {
    await postTicket({ title: "concert", price: -10 }).expect(400);
  });

  it("returns an error if the price is missing", async () => {
    await postTicket({ title: "concert" }).expect(400);
  });

  it("creates a ticket with valid inputs", async () => {
    await postTicket({ title: "concert", price: 20 }).expect(201);
    const tickets = await TicketRepository.findAllTickets({});
    expect(tickets).toHaveLength(1);
    expect(tickets[0]!.title).toEqual("concert");
    expect(tickets[0]!.price).toEqual(20);
  });
});

describe("GET /api/tickets", () => {
  it("returns a 404 if the ticket is not found", async () => {
    await request(app)
      .get("/api/tickets/laskdjfalksfdlkakj")
      .send()
      .expect(404);
  });

  it("returns the ticket if the ticket is found", async () => {
    const title = "concert";
    const price = 20;
    const cookie = signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title,
        price,
      })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
