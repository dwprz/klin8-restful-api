import prismaService from "../apps/database.js";
import { ResponseError } from "../helpers/error.helper.js";

const findUserByEmail = async (email) => {
  const findUser = await prismaService.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, "user not found");
  }

  return findUser;
};

const getUsersCountByFields = async ({ page, ...where }) => {
  const totalUsers = await prismaService.user.count({
    where: where,
  });

  return totalUsers;
};

export const userUtil = {
  findUserByEmail,
  getUsersCountByFields,
};
