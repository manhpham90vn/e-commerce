import { ExtractJwt, Strategy } from "passport-jwt";
import { findUserByConditions } from "../repository/userRepository.js";
import { tokenTypes } from "./constants.js";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS_TOKEN) {
      return done(null, false);
    }

    const user = await findUserByConditions({
      id: payload.user_id,
      deleted_at: null,
    });
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export default jwtStrategy;
