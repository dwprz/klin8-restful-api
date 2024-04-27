import { ResponseError } from "../helpers/response-error.helper.js";

const validation = (data, schema) => {
  const res = schema.safeParse(data);

  if (res.success) {
    return res.data;
  } else {
    throw new ResponseError(400, res.error.message || "bad request");
  }
};

export default validation;
