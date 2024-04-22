import { ResponseError } from "../error/response.error.js";

const validation = (data, schema) => {
  const res = schema.safeParse(data);

  if (res.success) {
    return res;
  } else {
    throw new ResponseError(400, res.error.message || "bad request");
  }
};

export default validation;
