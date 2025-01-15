import express from "express";
import prisma from "../database.js";
import StatusCodes from "http-status-codes";
import { validate } from "../middlewares.js";
import { register } from "./validation.js";
import { register as registerController } from "./controller.js";

const v1Router = express.Router();

v1Router.get("/health", async (req, res) => {
  await prisma.$executeRaw`SELECT 1;`;
  res.status(StatusCodes.OK).json({ message: "OK" });
});

v1Router.post("/register", validate(register), registerController);

export default v1Router;
