import ConflictError from "../common/error/ConflictError.js";
import UnauthorizedError from "../common/error/UnauthorizedError.js";
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

const register = async (email, password, ip, userAgent) => {
  const existingUser = await findUserByConditions({ email });
  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const password_hash = await hashPassword(password);
  const user = await createUser(email, password_hash);
  delete user.password_hash;

  const { accessToken, refreshToken } = generateToken(user.id);

  await createSession(user.id, accessToken, refreshToken, ip, userAgent);

  return { user, accessToken, refreshToken };
};

const login = async (email, password, ip, userAgent) => {
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

  await createSession(user.id, accessToken, refreshToken, ip, userAgent);

  return { user, accessToken, refreshToken };
};

const refresh = async (token, ip, userAgent) => {
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

  await createSession(user.id, accessToken, refreshToken, ip, userAgent);

  return { accessToken, refreshToken };
};

const logout = async (session) => {
  await updateSession(session.id, { deleted_at: new Date() });
};

const verify = async (token) => {
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

  return { user };
};

export { login, logout, refresh, register, verify };
