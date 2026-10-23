import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode: number = 500;
  constructor(private reason: string) {
    super();
  }
  formatError(): { message: string; field?: string }[] {
    return [{ message: this.reason }];
  }
}
