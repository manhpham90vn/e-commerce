import { StatusCodes } from "http-status-codes";

export const tokenTypes = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
};

export class ValidationError extends Error {
  status = StatusCodes.UNPROCESSABLE_ENTITY;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error {
  status = StatusCodes.FORBIDDEN;
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
