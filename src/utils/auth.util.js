import prismaService from "../apps/database.js";
import { ResponseError } from "../helpers/error.helper.js";

const findOtpByEmail = async (email) => {
  const findOtp = await prismaService.otp.findUnique({
    where: {
      email: email,
    },
  });

  if (!findOtp) {
    throw new ResponseError(404, "no otp matches the email");
  }

  return findOtp;
};

export const authUtil = {
  findOtpByEmail,
};
