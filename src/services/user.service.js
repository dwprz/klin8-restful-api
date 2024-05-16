import prismaService from "../apps/database.js";
import { authHelper } from "../helpers/auth.helper.js";
import { fileHelper } from "../helpers/file.helper.js";
import { pagingHelper } from "../helpers/paging.helper.js";
import { userHelper } from "../helpers/user.helper.js";
import { userUtil } from "../utils/user.util.js";
import { userValidation } from "../validations/user.validation.js";
import validation from "../validations/validation.js";
import bcrypt from "bcrypt";
import { authService } from "./auth.service.js";
import { ResponseError } from "../helpers/error.helper.js";

const getUserByEmail = async (email) => {
  const { password, refreshToken, ...user } = await userUtil.findUserByEmail(
    email
  );

  return user;
};

const getUsersByRole = async (getAllByRoleRequest) => {
  const { page, role } = validation(
    getAllByRoleRequest,
    userValidation.getAllByRoleRequest
  );

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  let users = await prismaService.user.findMany({
    where: {
      role: role,
    },
    take: take,
    skip: skip,
  });

  users = userHelper.transfromUsers(users);
  const totalUsers = await userUtil.getUsersCountByFields(getAllByRoleRequest);

  const result = pagingHelper.formatePagedData(users, totalUsers, page, take);
  return result;
};

const getUsersByFullName = async (getByFullNameRequest) => {
  const { fullName, role, page } = validation(
    getByFullNameRequest,
    userValidation.getByFullNameRequest
  );

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  let users = await prismaService.user.findMany({
    where: {
      fullName: fullName,
      role: role,
    },
    take: take,
    skip: skip,
  });

  users = userHelper.transfromUsers(users);
  const totalUsers = await userUtil.getUsersCountByFields(getByFullNameRequest);

  const result = pagingHelper.formatePagedData(users, totalUsers, page, take);
  return result;
};

const updateUser = async (updateUserRequest) => {
  updateUserRequest = validation(
    updateUserRequest,
    userValidation.updateUserRequest
  );

  const findUser = await userUtil.findUserByEmail(updateUserRequest.email);

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
  const { email, newEmail, otp } = validation(
    updateEmailRequest,
    userValidation.updateEmailRequest
  );

  const findUser = await userUtil.findUserByEmail(email);

  await authService.verifyOtp({ email: newEmail, otp: otp });

  try {
    const { password, refreshToken, ...user } = await prismaService.user.update(
      {
        where: {
          email: email,
        },
        data: {
          email: newEmail,
        },
      }
    );

    const newAccessToken = authHelper.createAccessToken({
      ...findUser,
      email: newEmail,
    });

    return { user, newAccessToken };
  } catch (error) {
    if (error.code === "P2002") {
      throw new ResponseError(409, "email already exist");
    }
    throw new ResponseError(400, "failed to update email");
  }
};

const updatePassword = async (updatePasswordRequest) => {
  updatePasswordRequest = validation(
    updatePasswordRequest,
    userValidation.updatePasswordRequest
  );

  const findUser = await userUtil.findUserByEmail(updatePasswordRequest.email);

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

  const findUser = await userUtil.findUserByEmail(email);

  if (findUser.photoProfile) {
    fileHelper.deleteFile(findUser.photoProfile);
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
  getUserByEmail,
  getUsersByRole,
  getUsersByFullName,
  updateUser,
  updateEmail,
  updatePassword,
  updatePhotoProfile,
};
