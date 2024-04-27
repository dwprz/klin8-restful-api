import prismaService from "../apps/database/db.js";
import { authHelper } from "../helpers/auth.helper.js";
import deleteFile from "../helpers/delete-file.helper.js";
import { ResponseError } from "../helpers/response-error.helper.js";
import { userValidation } from "../validations/user.validation.js";
import validation from "../validations/validation.js";
import bcrypt from "bcrypt";

const getUsersByRole = async (getAllByRoleRequest) => {
  const { page, role } = validation(
    getAllByRoleRequest,
    userValidation.getAllByRoleRequest
  );
  const take = 20;
  const skip = (page - 1) * take;

  const users = await prismaService.user.findMany({
    where: {
      role: role,
    },
    take: take,
    skip: skip,
  });

  if (!users.length) {
    return [];
  }

  const processedUsers = users.map((user) => {
    const { password, refreshToken, ...rest } = user;
    return rest;
  });

  return processedUsers;
};

const updateUser = async (updateUserRequest) => {
  updateUserRequest = validation(
    updateUserRequest,
    userValidation.updateUserRequest
  );

  const findUser = await prismaService.user.findUnique({
    where: {
      email: updateUserRequest.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

  await authHelper.comparePassword(
    updateUserRequest.password,
    findUser.password
  );

  const { password: p, ...updateData } = updateUserRequest;

  const { password, refreshToken, ...user } = await prismaService.user.update({
    where: {
      email: updateUserRequest.email,
    },
    data: updateData,
  });

  return user;
};

const updateEmail = async (updateEmailRequest) => {
  updateEmailRequest = validation(
    updateEmailRequest,
    userValidation.updateEmailRequest
  );

  const findUser = await prismaService.user.findUnique({
    where: {
      email: updateEmailRequest.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

  await authHelper.comparePassword(
    updateEmailRequest.password,
    findUser.password
  );

  const { password, refreshToken, ...user } = await prismaService.user.update({
    where: {
      email: updateEmailRequest.email,
    },
    data: {
      email: updateEmailRequest.newEmail,
    },
  });

  const newAccessToken = authHelper.createAccessToken({
    ...findUser,
    email: updateEmailRequest.newEmail,
  });

  return { user, newAccessToken };
};

const updatePassword = async (updatePasswordRequest) => {
  updatePasswordRequest = validation(
    updatePasswordRequest,
    userValidation.updatePasswordRequest
  );

  const findUser = await prismaService.user.findUnique({
    where: {
      email: updatePasswordRequest.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

  await authHelper.comparePassword(
    updatePasswordRequest.password,
    findUser.password
  );

  const newPassword = await bcrypt.hash(updatePasswordRequest.newPassword, 10);

  await prismaService.user.update({
    where: {
      email: updatePasswordRequest.email,
    },
    data: {
      password: newPassword,
    },
  });
};

const updatePhotoProfile = async (updatePhotoProfileRequest) => {
  const { email, photoProfile } = validation(
    updatePhotoProfileRequest,
    userValidation.updatePhotoProfileRequest
  );

  const findUser = await prismaService.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

  if (findUser.photoProfile) {
    deleteFile(findUser.photoProfile);
  }

  const { password, refreshToken, ...user } = await prismaService.user.update({
    where: {
      email: email,
    },
    data: {
      photoProfile: photoProfile,
    },
  });

  return user;
};

export const userService = {
  getUsersByRole,
  updateUser,
  updateEmail,
  updatePassword,
  updatePhotoProfile,
};
