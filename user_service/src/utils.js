import { ExtractJwt, Strategy } from "passport-jwt";
import prisma from "./database.js";
import { tokenTypes } from "./constants.js";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS_TOKEN) {
      throw new Error("Invalid token type");
    }
    const user = await prisma.user.findFirst({ where: { id: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === "dev") {
      return callback(null, true);
    }

    if (process.env.CORS_WHITELIST.split(",").includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
