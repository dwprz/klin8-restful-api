import prismaService from "../apps/database.js";
import { ResponseError } from "../helpers/error.helper.js";
import { authValidation } from "../validations/auth.validation.js";
import validation from "../validations/validation.js";
import { authHelper } from "../helpers/auth.helper.js";
import bcrypt from "bcrypt";
import { templateHelper } from "../helpers/template.helper.js";
import { transporterHelper } from "../helpers/transporter.helper.js";
import { authUtil } from "../utils/auth.util.js";
import { userUtil } from "../utils/user.util.js";

const sendOtp = async (email) => {
  email = validation(email, authValidation.email);

  const otp = authHelper.generateOtp();
  const gmailMaster = process.env.GMAIL_MASTER;

  if (!gmailMaster) {
    throw new ResponseError(422, "gmail user is not provided");
  }

  const template = templateHelper.renderTemplate("/src/template/otp.html", {
    otp,
  });

  await transporterHelper.sendMail(gmailMaster, email, template);

  await prismaService.$queryRaw`
  INSERT INTO 
      otp (email, otp) VALUES (${email}, ${otp})
  ON CONFLICT 
      (email)
  DO UPDATE SET 
      otp = ${otp};
  `;
};

const verifyOtp = async (verifyOtpRequest) => {
  verifyOtpRequest = validation(
    verifyOtpRequest,
    authValidation.verifyOtpRequest
  );

  const findOtp = await authUtil.findOtpByEmail(verifyOtpRequest.email);

  authHelper.verifyOtp(verifyOtpRequest.otp, findOtp.otp);

  await prismaService.otp.delete({
    where: {
      email: verifyOtpRequest.email,
    },
  });
};

const register = async (registerRequest) => {
  registerRequest = validation(registerRequest, authValidation.registerRequest);

  const findUser = await prismaService.user.findUnique({
    where: {
      email: registerRequest.email,
    },
  });

  if (findUser) {
    throw new ResponseError(409, "user already exist");
  }

  const encryptPassword = await bcrypt.hash(registerRequest.password, 10);

  const { refreshToken, password, ...user } = await prismaService.user.create({
    data: {
      ...registerRequest,
      role: "USER",
      password: encryptPassword,
    },
  });

  return user;
};

const login = async (loginRequest) => {
  loginRequest = validation(loginRequest, authValidation.authenticateRequest);

  const findUser = await userUtil.findUserByEmail(loginRequest.email);

  await authHelper.comparePassword(loginRequest.password, findUser.password);

  const newAccessToken = authHelper.createAccessToken(findUser);
  const newRefreshToken = authHelper.createRefreshToken(findUser.role);

  const { password, refreshToken, ...user } = await prismaService.user.update({
    where: {
      email: loginRequest.email,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  return { user, tokens: { newAccessToken, newRefreshToken } };
};

const loginWithGoogle = async (loginGoogleRequest) => {
  loginGoogleRequest = validation(
    loginGoogleRequest,
    authValidation.loginGoogleRequest
  );

  const result = await prismaService.user.upsert({
    where: {
      email: loginGoogleRequest.email,
    },
    update: {
      ...loginGoogleRequest,
      role: "USER",
    },
    create: {
      ...loginGoogleRequest,
      role: "USER",
    },
  });

  const newAccessToken = authHelper.createAccessToken(result);
  const newRefreshToken = authHelper.createRefreshToken(result.role);

  const { password, refreshToken, ...user } = await prismaService.user.update({
    where: {
      email: loginGoogleRequest.email,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  return { user, tokens: { newAccessToken, newRefreshToken } };
};

const generateNewAccessToken = async (refreshToken) => {
  const findUser = await prismaService.user.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!findUser) {
    throw new ResponseError(401, "no user matches the refresh token.");
  }

  const accessToken = authHelper.createAccessToken(findUser);
  const { password, refreshToken: rt, ...user } = findUser;

  return { accessToken, user };
};

const setNullRefreshToken = async (userId) => {
  await prismaService.user.update({
    where: {
      userId: userId,
    },
    data: {
      refreshToken: null,
    },
  });
};

const authenticateUser = async (authRequest) => {
  authRequest = validation(authRequest, authValidation.authenticateRequest);

  const findUser = await userUtil.findUserByEmail(authRequest.email);
  await authHelper.comparePassword(authRequest.password, findUser.password);
};

export const authService = {
  sendOtp,
  verifyOtp,
  register,
  login,
  loginWithGoogle,
  generateNewAccessToken,
  setNullRefreshToken,
  authenticateUser,
};
