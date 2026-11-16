import { isValidObjectId } from "mongoose";
import { BadRequestError } from "@ashraf.tickets/common";
import { TicketModel } from "../models/ticket";

const handleWriteError = (err: unknown): never => {
  if ((err as { code: number }).code === 11000) {
    throw new BadRequestError("this title is used before");
  }
  throw new BadRequestError("Internal server error, try again later");
};

export const TicketRepository = {
  async createTicket({
    title,
    price,
    userId,
  }: {
    title: string;
    price: number;
    userId: string;
  }) {
    try {
      const doc = await TicketModel.create({ title, price, userId });
      return doc;
    } catch (err) {
      return handleWriteError(err);
    }
  },
  async findAllTickets(filter: Record<string, unknown> = {}) {
    return await TicketModel.find(filter);
  },
  async findTicketById(id: string) {
    // invalid ObjectIds (e.g. "abc") would make mongoose throw a CastError,
    // which our errorHandler turns into a 400 -> return null so the route sends 404
    if (!isValidObjectId(id)) return null;
    return await TicketModel.findById(id);
  },
  async updateTicket(id: string, attrs: { title: string; price: number }) {
    try {
      return await TicketModel.findByIdAndUpdate(id, attrs, {
        returnDocument: "after",
        runValidators: true,
      });
    } catch (err) {
      return handleWriteError(err);
    }
  },
};
