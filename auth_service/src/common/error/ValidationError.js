import { StatusCodes } from "http-status-codes";

export default class ValidationError extends Error {
  status = StatusCodes.UNPROCESSABLE_ENTITY;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
