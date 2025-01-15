import prisma from "../database.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import { tokenTypes } from "../constants.js";
import { catchAsync } from "../utils.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "User already exists",
    });
  }

  const user = await prisma.user.create({
    data: {
      email,
      password_hash: await bcrypt.hash(password, 10),
    },
  });

  delete user.password_hash;

  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessTokenPayload = {
    id: user.id,
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
    id: user.id,
    iat: moment().unix(),
    exp: refreshTokenExpires.unix(),
    type: tokenTypes.REFRESH_TOKEN,
  };
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET);

  await prisma.session.create({
    data: {
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: req.headers["x-forwarded-for"] || req.ip || "unknown ip",
      user_agent: req.headers["user-agent"] || "unknown user-agent",
    },
  });

  return res.status(StatusCodes.CREATED).json({
    data: user,
    token: {
      accessToken,
      refreshToken,
    },
  });
});
