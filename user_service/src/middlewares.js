import Joi from "joi";
import passport from "passport";
import { UnauthorizedError, ValidationError } from "./constants.js";
import { pick } from "./utils.js";

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
  const validateSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validateSchema));
  const { value, error } = Joi.compile(validateSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessages = error.details.map((details) =>
      details.message.replace(/\"/g, "")
    );
    throw new ValidationError(errorMessages.join(", "));
  }
  Object.assign(req, value);
  return next();
};

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || !user || info) {
    return reject(new UnauthorizedError("Invalid token"));
  }
  req.user = user;

  resolve();
};

export const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};
