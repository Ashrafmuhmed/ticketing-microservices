import { UserModel } from "../models/user.model";
import { BadRequestError } from "@ashraf.tickets/common";
export const UserRepository = {
  async createUser(user: { email: string; password: string }) {
    try {
      const doc = await UserModel.create(user);
      return doc;
    } catch (err) {
      if ((err as { code: number }).code === 11000) {
        throw new BadRequestError("this email is used before");
      } else {
        throw new BadRequestError("Internal server error, try again later");
      }
    }
  },
};
