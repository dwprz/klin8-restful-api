import prismaService from "../../src/apps/database/db";
import bcrypt from "bcrypt";

// user
const userEmail = "userTest123@gmail.com";
const userFullName = "User Test123";
const userPassword = "Password Test";
const userWhatsapp = "08123456789";
const userAddress = "Goatan Street, Northen District, Pantura State";

// admin
const adminEmail = "adminTest123@gmail.com";
const adminFullName = "Admin Test123";
const adminPassword = "Password Test";

const createUser = async () => {
  try {
    const { userId } = await prismaService.user.create({
      data: {
        email: userEmail,
        fullName: userFullName,
        role: "USER",
        password: await bcrypt.hash(userPassword, 10),
      },
    });

    return {
      userId: userId,
      email: userEmail,
      fullName: userFullName,
      password: userPassword,
      whatsapp: userWhatsapp,
      address: userAddress,
    };
  } catch (error) {
    console.log(error.message);
  }
};

const removeUser = async () => {
  try {
    await prismaService.user.deleteMany({
      where: {
        OR: [
          {
            fullName: userFullName,
          },
          {
            fullName: "New " + userFullName,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createAdmin = async () => {
  try {
    await prismaService.user.create({
      data: {
        email: adminEmail,
        fullName: adminFullName,
        role: "ADMIN",
        password: await bcrypt.hash(adminPassword, 10),
      },
    });

    return {
      email: adminEmail,
      password: adminPassword,
    };
  } catch (error) {
    console.log(error.message);
  }
};

const removeAdmin = async () => {
  try {
    await prismaService.user.deleteMany({
      where: {
        fullName: adminFullName,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const userTestUtil = {
  createUser,
  removeUser,
  createAdmin,
  removeAdmin,
};
