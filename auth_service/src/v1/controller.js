import ConflictError from "../common/error/ConflictError.js";
import UnauthorizedError from "../common/error/UnauthorizedError.js";
import successResponse from "../common/successResponse.js";
import { tokenTypes } from "../configs/constants.js";
import { comparePassword, hashPassword } from "../repository/hashRepository.js";
import {
  createSession,
  findSessionByConditions,
  updateSession,
} from "../repository/sessionRepository.js";
import { generateToken, verifyToken } from "../repository/tokenRepository.js";
import {
  createUser,
  findUserByConditions,
} from "../repository/userRepository.js";
import catchAsync from "../utils/catchAsync.js";

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await findUserByConditions({ email });
  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const password_hash = await hashPassword(password);
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

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByConditions({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordMatch = await comparePassword(password, user.password_hash);
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

const refresh = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const decoded = verifyToken(token);

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

const logOut = catchAsync(async (req, res, next) => {
  const { session } = req;

  await updateSession(session.id, { deleted_at: new Date() });
  return successResponse(res, null, "Logout success");
});

const verify = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = verifyToken(token);

  if (decoded.type !== tokenTypes.ACCESS_TOKEN) {
    throw new UnauthorizedError("Invalid token type");
  }

  const user = await findUserByConditions({
    id: decoded.user_id,
    deleted_at: null,
  });
  if (!user) {
    throw new UnauthorizedError("Invalid user");
  }
  delete user.password_hash;

  const session = await findSessionByConditions({
    user_id: user.id,
    token: token,
    deleted_at: null,
  });
  if (!session) {
    throw new UnauthorizedError("Invalid session");
  }
  return successResponse(res, user);
});

const me = catchAsync(async (req, res, next) => {
  return successResponse(res, { user: req.user, session: req.session });
});

export { login, logOut, me, refresh, register, verify };
