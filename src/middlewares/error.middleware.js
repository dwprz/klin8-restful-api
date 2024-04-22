const errorMiddleware = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "sorry, internal server error";

  console.log(`status: ${errorStatus}, message: ${errorMessage}`);

  res.status(errorStatus).message(errorMessage);
};
