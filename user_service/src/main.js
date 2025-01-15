import express from "express";
import "dotenv/config";
import passport from "passport";
import { jwtStrategy, corsOptions } from "./utils.js";
import cors from "cors";
import { errorHandler } from "./middlewares.js";
import v1Router from "./v1/route.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
app.use("/v1", v1Router);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
