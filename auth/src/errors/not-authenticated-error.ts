import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super();
  }
  formatError(): { message: string; field?: string }[] {
    return [{ message: "Not authenticated" }];
  }
}
