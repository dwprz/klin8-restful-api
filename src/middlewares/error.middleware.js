import { ResponseError } from "../helpers/response-error.helper.js";

const errorMiddleware = (err, req, res, next) => {
  let status = 500;
  let message = "internal server error. please try again later";

  if (err instanceof ResponseError) {
    status = err.status;
    message = err.message;
  }

  console.log(`status: ${status}, message: ${err.message} | this log error`); // menggunakan err.message supaya tahu pesan asli errornya

  res.status(status).json({ error: message });
};

export default errorMiddleware;
