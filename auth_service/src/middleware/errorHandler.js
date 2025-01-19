import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

const errorHandler = (err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === "production") {
    delete errorResponse.stack;
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    errorResponse.status = 401;
  }

  res.status(errorResponse.status).json(errorResponse);
};

export default errorHandler;
