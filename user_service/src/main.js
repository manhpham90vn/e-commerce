import cors from "cors";
import "dotenv/config";
import express from "express";
import passport from "passport";
import { errorHandler } from "./middlewares.js";
import { corsOptions, jwtStrategy } from "./utils.js";
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
