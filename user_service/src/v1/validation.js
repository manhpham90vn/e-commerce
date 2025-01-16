import Joi from "joi";

export const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const refresh = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
