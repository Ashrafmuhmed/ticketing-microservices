import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor(public message: string) {
    super();
  }
  formatError(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
