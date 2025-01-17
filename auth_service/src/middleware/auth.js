import passport from "passport";
import UnauthorizedError from "../common/error/UnauthorizedError.js";
import { findSessionByConditions } from "../repository/sessionRepository.js";

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || !user || info) {
    return reject(new UnauthorizedError("Invalid token"));
  }

  const token = req.headers.authorization.split(" ")[1];
  const session = await findSessionByConditions({
    user_id: user.id,
    token,
    deleted_at: null,
  });
  if (!session) {
    return reject(new UnauthorizedError("Token not found"));
  }

  req.user = user;
  req.session = session;

  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
