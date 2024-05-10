import prismaService from "../../src/apps/database";
import { orderUtil } from "../../src/utils/order.util";

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
        serviceMode: "PICK_UP_ONLY",
        paymentMethod: "E_WALLET",
        whatsapp: user.whatsapp,
        address: user.address,
      },
    });

    const statuses = await orderUtil.createStatusesOrders(order);

    return { ...order, statuses };
  } catch (error) {
    console.log(error.message);
  }
};

const removeOrder = async (orderId) => {
  try {
    await prismaService.status.deleteMany({
      where: {
        orderId: orderId,
      },
    });

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
