import prismaService from "../apps/database/db.js";
import { ResponseError } from "../helpers/response-error.helper.js";
import { authValidation } from "../validations/auth.validation.js";
import validation from "../validations/validation.js";
import { authHelper } from "../helpers/auth.helper.js";
import createTransporter from "../apps/transporter/transporter.js";
import { readFileSync } from "fs";
import mustache from "mustache";
import bcrypt from "bcrypt";

const sendOtp = async (email) => {
  email = validation(email, authValidation.email);

  const otp = authHelper.generateOtp();
  const gmailMaster = process.env.GMAIL_MASTER;

  if (!gmailMaster) {
    throw new ResponseError(422, "gmail user is not provided");
  }

  const template = readFileSync(
    process.cwd() + "/src/template/otp.html",
    "utf-8"
  );

  const renderTemplate = mustache.render(template, { otp });

  const transporter = await createTransporter();

  return transporter
    .sendMail({
      from: {
        name: "klin8",
        address: gmailMaster,
      },
      to: email,
      subject: "Veryfication With OTP",
      html: renderTemplate,
    })
    .then(async () => {
      await prismaService.$queryRaw`
      INSERT INTO 
          otp (email, otp) VALUES (${email}, ${otp})
      ON CONFLICT 
          (email)
      DO UPDATE SET 
          otp = ${otp};
      `;
    })
    .catch((error) => {
      throw new ResponseError(500, "failed to send otp");
    });
};

const verifyOtp = async (verifyOtpRequest) => {
  verifyOtpRequest = validation(
    verifyOtpRequest,
    authValidation.verifyOtpRequest
  );

  const findOtp = await prismaService.otp.findUnique({
    where: {
      email: verifyOtpRequest.email,
    },
  });

  if (!findOtp) {
    throw new ResponseError(404, "no otp matches the email");
  }

  const compareOtp = verifyOtpRequest.otp === findOtp.otp;

  if (!compareOtp) {
    throw new ResponseError(400, "otp is invalid");
  }

  await prismaService.otp.delete({
    where: {
      email: verifyOtpRequest.email,
    },
  });
};

const createUser = async (registerRequest) => {
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

const authenticateUser = async (loginRequest) => {
  loginRequest = validation(loginRequest, authValidation.loginRequest);

  const findUser = await prismaService.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

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

const authenticateWithGoogle = async (loginGoogleRequest) => {
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
  const { password, refreshToken:rt, ...user } = findUser;

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

export const authService = {
  sendOtp,
  verifyOtp,
  createUser,
  authenticateUser,
  authenticateWithGoogle,
  generateNewAccessToken,
  setNullRefreshToken,
};
