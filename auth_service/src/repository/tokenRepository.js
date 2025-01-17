import jwt from "jsonwebtoken";
import moment from "moment";
import { tokenTypes } from "../configs/constants.js";

const generateToken = (userId) => {
  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessTokenPayload = {
    user_id: userId,
    iat: moment().unix(),
    exp: accessTokenExpires.unix(),
    type: tokenTypes.ACCESS_TOKEN,
  };
  const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET);

  const refreshTokenExpires = moment().add(
    process.env.JWT_REFRESH_EXPIRATION_MINUTES,
    "minutes"
  );
  const refreshTokenPayload = {
    user_id: userId,
    iat: moment().unix(),
    exp: refreshTokenExpires.unix(),
    type: tokenTypes.REFRESH_TOKEN,
  };
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET);

  return { accessToken, refreshToken };
};

export { generateToken };
