import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode: number = 400;
  constructor(private msg: string) {
    super(msg);
  }
  formatError(): { message: string; field?: string }[] {
    return [{ message: this.msg }];
  }
}
