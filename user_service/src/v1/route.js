import express from "express";
import StatusCodes from "http-status-codes";
import prisma from "../database.js";
import { auth, validate } from "../middlewares.js";
import {
  login as loginController,
  refresh as refreshController,
  register as registerController,
} from "./controller.js";
import { login, refresh, register } from "./validation.js";

const v1Router = express.Router();

v1Router.get("/health", async (req, res) => {
  await prisma.$executeRaw`SELECT 1;`;
  res.status(StatusCodes.OK).json({ message: "OK" });
});

v1Router.post("/register", validate(register), registerController);

v1Router.post("/login", validate(login), loginController);

v1Router.post("/refresh", validate(refresh), refreshController);

v1Router.get("/me", auth(), async (req, res) => {
  delete req.user.password_hash;
  res
    .status(StatusCodes.OK)
    .json({ data: { user: req.user, session: req.session } });
});

export default v1Router;
