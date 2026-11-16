import { Request, Response, Router } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ashraf.tickets/common";
import { createTicketValidator, updateTicketValidator } from "../validators";
import { TicketRepository } from "../repository/ticket.repository";
import { NotAuthorizedError } from "../errors/not-authorized-error";

const router = Router();

router.post(
  "",
  requireAuth,
  createTicketValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await TicketRepository.createTicket({
      title,
      price,
      userId: req.currentUser!.id,
    });
    res.status(201).send(ticket);
  },
);

router.get("", async (_req: Request, res: Response) => {
  const tickets = await TicketRepository.findAllTickets();
  res.send(tickets);
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const ticket = await TicketRepository.findTicketById(req.params.id);
  if (!ticket) {
    throw new NotFoundError("ticket not found");
  }
  res.send(ticket);
});

router.put(
  "/:id",
  requireAuth,
  updateTicketValidator,
  validateRequest,
  async (req: Request<{ id: string }>, res: Response) => {
    const ticket = await TicketRepository.findTicketById(req.params.id);
    if (!ticket) {
      throw new NotFoundError("ticket not found");
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const { title, price } = req.body;
    const updated = await TicketRepository.updateTicket(req.params.id, {
      title,
      price,
    });
    res.send(updated);
  },
);

export { router as ticketsRouter };
