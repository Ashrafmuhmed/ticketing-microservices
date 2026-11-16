import { CustomError } from "@ashraf.tickets/common";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super("Not authorized");
  }
  formatError(): { message: string; field?: string }[] {
    return [{ message: "Not authorized" }];
  }
}
