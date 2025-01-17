import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ConflictError from "../common/error/ConflictError.js";
import UnauthorizedError from "../common/error/UnauthorizedError.js";
import successResponse from "../common/successResponse.js";
import { tokenTypes } from "../configs/constants.js";
import {
  createSession,
  findSessionByConditions,
  updateSession,
} from "../repository/sessionRepository.js";
import { generateToken } from "../repository/tokenRepository.js";
import {
  createUser,
  findUserByConditions,
} from "../repository/userRepository.js";
import catchAsync from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await findUserByConditions({ email });
  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser(email, password_hash);
  delete user.password_hash;

  const { accessToken, refreshToken } = generateToken(user.id);

  await createSession(
    user.id,
    accessToken,
    refreshToken,
    req.headers["x-forwarded-for"] || req.ip || "unknown ip",
    req.headers["user-agent"] || "unknown user-agent"
  );

  return successResponse(res, { user, accessToken, refreshToken });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByConditions({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  delete user.password_hash;
  const { accessToken, refreshToken } = generateToken(user.id);

  await createSession(
    user.id,
    accessToken,
    refreshToken,
    req.headers["x-forwarded-for"] || req.ip || "unknown ip",
    req.headers["user-agent"] || "unknown user-agent"
  );

  return successResponse(res, { user, accessToken, refreshToken });
});

export const refresh = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.type !== tokenTypes.REFRESH_TOKEN) {
    throw new UnauthorizedError("Invalid token type");
  }

  const user = await findUserByConditions({
    id: decoded.user_id,
    deleted_at: null,
  });
  if (!user) {
    throw new UnauthorizedError("Invalid user");
  }

  const session = await findSessionByConditions({
    user_id: user.id,
    refresh_token: token,
    deleted_at: null,
  });
  if (!session) {
    throw new UnauthorizedError("Invalid session");
  }

  await updateSession(session.id, { deleted_at: new Date() });

  const { accessToken, refreshToken } = generateToken(user.id);

  await createSession(
    user.id,
    accessToken,
    refreshToken,
    req.headers["x-forwarded-for"] || req.ip || "unknown ip",
    req.headers["user-agent"] || "unknown user-agent"
  );

  return successResponse(res, { accessToken, refreshToken });
});
