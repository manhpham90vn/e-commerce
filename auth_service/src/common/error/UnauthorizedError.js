import { StatusCodes } from "http-status-codes";

export default class UnauthorizedError extends Error {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
