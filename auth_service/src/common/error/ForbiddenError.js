import { StatusCodes } from "http-status-codes";

export default class ForbiddenError extends Error {
  status = StatusCodes.FORBIDDEN;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
