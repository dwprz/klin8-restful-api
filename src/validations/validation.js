import { ResponseError } from "../helpers/error.helper.js";

const validation = (data, schema) => {
  const res = schema.safeParse(data);

  if (res.success) {
    return res.data;
  } else {
    console.log(res.error.message);
    throw new ResponseError(400, "bad request");
  }
};

export default validation;
