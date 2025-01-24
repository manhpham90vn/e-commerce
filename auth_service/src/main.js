import compression from "compression";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import corsOptions from "./configs/corsOptions.js";
import jwtStrategy from "./configs/jwt.js";
import errorHandler from "./middleware/errorHandler.js";
import v1Router from "./v1/route.js";

const app = express();

// Security
app.use(helmet());

// Body parser
app.use(express.json());

// Compress responses
app.use(compression());

// CORS
app.use(cors(corsOptions));

// Passport middleware
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Routes
app.use("/api/auth_service/v1", v1Router);

// Error handler middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT} with env ${process.env.NODE_ENV}`
  );
});
