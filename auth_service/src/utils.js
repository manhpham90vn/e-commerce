import { ExtractJwt, Strategy } from "passport-jwt";
import { ForbiddenError, tokenTypes, UnauthorizedError } from "./constants.js";
import prisma from "./database.js";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS_TOKEN) {
      return done(null, false);
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.user_id, deleted_at: null },
    });
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.CORS_WHITELIST.split(",").includes(origin)) {
      callback(null, true);
    } else {
      throw new ForbiddenError("Not allowed by CORS");
    }
  },
  credentials: true,
};

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
