import prismaService from "../../src/apps/database.js";

const createOtp = async (email, otp) => {
  try {
    await prismaService.otp.create({
      data: {
        email: email,
        otp: otp,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const removeOtp = async (email) => {
  try {
    await prismaService.otp.delete({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const authTestUtil = {
  createOtp,
  removeOtp,
};
