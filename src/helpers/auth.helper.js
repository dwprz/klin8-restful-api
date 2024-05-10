import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { ResponseError } from "./error.helper.js";
import bcrypt from "bcrypt";
import "dotenv/config";

const generateOtp = () => {
  // membuat otp 6 digit
  const otp = Math.round(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return otp;
};

const createAccessToken = (user) => {
  const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

  if (!secretKey) {
    throw new ResponseError(
      422,
      "jwt secret key for access token is not provided"
    );
  }

  const acessToken = jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    secretKey,
    { expiresIn: "30m" }
  );

  return acessToken;
};

const createRefreshToken = (role) => {
  const secretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

  if (!secretKey) {
    throw new ResponseError(
      422,
      "jwt secret key for refresh token is not provided"
    );
  }

  const refreshToken = jwt.sign(
    {
      uuid: uuidV4(),
      role: role,
    },
    secretKey,
    { expiresIn: "30d" }
  );

  return refreshToken;
};

const comparePassword = async (password, encryptPassword) => {
  const isValidPassword = await bcrypt.compare(password, encryptPassword);

  if (!isValidPassword) {
    throw new ResponseError(401, "password is incorrect");
  }
};

const createQRCodeToken = (orderId) => {
  const secretKey = process.env.JWT_QRCODE_TOKEN_SECRET_KEY;
  if (!secretKey) {
    ResponseError(422, "qrcode token secret key is not provided");
  }

  const qrcodeToken = jwt.sign(
    {
      orderId: orderId,
    },
    secretKey,
    { expiresIn: "30d" }
  );

  return qrcodeToken;
};

const verifyOtp = (requestOtp, existingOtp) => {
  const compareOtp = requestOtp === existingOtp;

  if (!compareOtp) {
    throw new ResponseError(400, "otp is invalid");
  }
};

export const authHelper = {
  generateOtp,
  createAccessToken,
  createRefreshToken,
  comparePassword,
  createQRCodeToken,
  verifyOtp,
};
