import express from "express";
import successResponse from "../common/successResponse.js";
import prisma from "../configs/database.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  login as loginController,
  logOut as logOutController,
  me as meController,
  refresh as refreshController,
  register as registerController,
  verify as verifyTokenController,
} from "./controller.js";
import { login, refresh, register } from "./validation.js";

const v1Router = express.Router();

v1Router.get("/health", async (req, res) => {
  await prisma.$executeRaw`SELECT 1;`;
  return successResponse(res, null, "OK");
});

v1Router.post("/register", validate(register), registerController);

v1Router.post("/login", validate(login), loginController);

v1Router.post("/refresh", validate(refresh), refreshController);

v1Router.get("/logout", auth(), logOutController);

v1Router.get("/verify-token", verifyTokenController);

v1Router.get("/me", auth(), meController);

export default v1Router;
