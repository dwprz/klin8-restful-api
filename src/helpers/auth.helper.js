import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { ResponseError } from "./response-error.helper.js";
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
  const jwtAccessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

  if (!jwtAccessTokenSecretKey) {
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
    jwtAccessTokenSecretKey,
    { expiresIn: "30m" }
  );

  return acessToken;
};

const createRefreshToken = (role) => {
  const jwtRefreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

  if (!jwtRefreshTokenSecretKey) {
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
    jwtRefreshTokenSecretKey,
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

export const authHelper = {
  generateOtp,
  createAccessToken,
  createRefreshToken,
  comparePassword,
};
