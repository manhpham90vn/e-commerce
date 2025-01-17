const errorHandler = (err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === "production") {
    delete errorResponse.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};

export default errorHandler;
