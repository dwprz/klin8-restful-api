import prismaService from "../../src/apps/database/db";

const createOrder = async (user) => {
  try {
    const order = await prismaService.order.create({
      data: {
        userId: user.userId,
        customerName: user.fullName,
        itemName: "Sepatu Bola Warna Hitam",
        serviceName: "CLEAN",
        quantity: 1,
        totalPrice: 15000,
        status: "PENDING_PICK_UP",
        serviceMode: "PICK_UP_ONLY",
        paymentMethod: "E_WALLET",
        whatsapp: user.whatsapp,
        address: user.address,
      },
    });

    return order;
  } catch (error) {
    console.log(error.message);
  }
};

const removeOrder = async () => {
  try {
    await prismaService.order.deleteMany({
      where: {
        customerName: "User Test123",
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const orderTestUtil = {
  createOrder,
  removeOrder,
};
