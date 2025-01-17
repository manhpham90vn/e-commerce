import { StatusCodes } from "http-status-codes";

export default class ConflictError extends Error {
  status = StatusCodes.CONFLICT;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
