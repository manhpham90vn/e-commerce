import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import moment from "moment";
import {
  tokenTypes,
  ValidationError,
  UnauthorizedError,
} from "../constants.js";
import prisma from "../database.js";
import { catchAsync } from "../utils.js";

export const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new ValidationError("Email already exists");
  }

  const user = await prisma.user.create({
    data: {
      email,
      password_hash: await bcrypt.hash(password, 10),
    },
  });
  delete user.password_hash;

  const { accessToken, refreshToken } = generateToken(user);

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
    accessToken,
    refreshToken,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new ValidationError("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new ValidationError("Invalid email or password");
  }

  delete user.password_hash;

  const { accessToken, refreshToken } = generateToken(user);

  await prisma.session.create({
    data: {
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: req.headers["x-forwarded-for"] || req.ip || "unknown ip",
      user_agent: req.headers["user-agent"] || "unknown user-agent",
    },
  });

  return res
    .status(StatusCodes.OK)
    .json({ data: user, accessToken, refreshToken });
});

export const refresh = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.type !== tokenTypes.REFRESH_TOKEN) {
    throw new UnauthorizedError("Invalid token type");
  }

  const user = await prisma.user.findFirst({
    where: { id: decoded.user_id, deleted_at: null },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid user");
  }

  const session = await prisma.session.findFirst({
    where: { user_id: user.id, refresh_token: token, deleted_at: null },
  });
  if (!session) {
    throw new UnauthorizedError("Invalid session");
  }

  await prisma.session.update({
    where: { id: session.id },
    data: {
      deleted_at: new Date(),
    },
  });

  const { accessToken, refreshToken } = generateToken(user);

  await prisma.session.create({
    data: {
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: req.headers["x-forwarded-for"] || req.ip || "unknown ip",
      user_agent: req.headers["user-agent"] || "unknown user-agent",
    },
  });

  return res.status(StatusCodes.OK).json({ accessToken, refreshToken });
});

const generateToken = (user) => {
  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessTokenPayload = {
    user_id: user.id,
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
    user_id: user.id,
    iat: moment().unix(),
    exp: refreshTokenExpires.unix(),
    type: tokenTypes.REFRESH_TOKEN,
  };
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET);

  return { accessToken, refreshToken };
};
