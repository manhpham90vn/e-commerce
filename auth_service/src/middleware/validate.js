import Joi from "joi";
import ValidationError from "../common/error/ValidationError.js";
import pick from "../utils/pick.js";

const validate = (schema) => (req, res, next) => {
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

export default validate;
