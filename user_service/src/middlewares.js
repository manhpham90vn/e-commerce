import Joi from "joi";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === "production") {
    delete errorResponse.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};

export const validate = (schema) => (req, res, next) => {
  const object = req.body;
  const { value, error } = Joi.compile(schema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);
  if (error) {
    const errorMessages = error.details.map((details) =>
      details.message.replace(/\"/g, "")
    );
    return next({
      message: errorMessages,
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    });
  }
  Object.assign(req, value);
  return next();
};
