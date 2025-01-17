import ForbiddenError from "../common/error/ForbiddenError.js";

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.CORS_WHITELIST.split(",").includes(origin)) {
      callback(null, true);
    } else {
      throw new ForbiddenError("Not allowed by CORS");
    }
  },
  credentials: true,
};

export default corsOptions;
