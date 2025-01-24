import successResponse from "../common/successResponse.js";
import {
  login as loginService,
  logout as logoutService,
  refresh as refreshService,
  register as registerService,
  verify as verifyService,
} from "../services/auth.js";
import catchAsync from "../utils/catchAsync.js";

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const data = await registerService(email, password);

  return successResponse(res, data);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const data = await loginService(email, password);

  return successResponse(res, data);
});

const refresh = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const data = await refreshService(token);

  return successResponse(res, data);
});

const logOut = catchAsync(async (req, res, next) => {
  const { session } = req;

  await logoutService(session);
  return successResponse(res, null, "Logout success");
});

const verify = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const data = await verifyService(token);

  return successResponse(res, data);
});

const me = catchAsync(async (req, res, next) => {
  return successResponse(res, { user: req.user, session: req.session });
});

export { login, logOut, me, refresh, register, verify };
