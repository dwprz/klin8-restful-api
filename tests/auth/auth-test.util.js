import prismaService from "../../src/apps/database.js";

const createOtp = async () => {
  try {
    const { otp } = await prismaService.otp.create({
      data: {
        email: "klin8shoes@gmail.com",
        otp: "123456",
      },
    });

    return otp;
  } catch (error) {
    console.log(error.message);
  }
};

const removeOtp = async () => {
  try {
    await prismaService.otp.delete({
      where: {
        email: "klin8shoes@gmail.com",
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
