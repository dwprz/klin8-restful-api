import prismaService from "../apps/database/db.js";
import { orderValidation } from "../validations/order.validation.js";
import validation from "../validations/validation.js";

const createOrder = async (createOrderRequest) => {
  createOrderRequest = validation(
    createOrderRequest,
    orderValidation.createOrderRequest
  );

  const order = await prismaService.order.create({
    data: createOrderRequest,
  });

  return order;
};

const getAllOrders = async (page) => {
  page = validation(page, orderValidation.page);

  const take = 20;
  const skip = (page - 1) * take;

  const orders = await prismaService.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: take,
    skip: skip,
  });

  return orders;
};

const getOrdersByCustomer = async (getOrdersByCustomerRequest) => {
  let { customerName, page } = validation(
    getOrdersByCustomerRequest,
    orderValidation.getOrdersByCustomerRequest
  );

  const take = 20;
  const skip = (page - 1) * take;

  customerName = customerName.split(" ").join(" & ");

  const orders = await prismaService.$queryRaw`
  SELECT * FROM orders
  WHERE to_tsvector("customerName") @@ to_tsquery(${customerName})
  LIMIT ${take} OFFSET ${skip};
  `;

  return orders;
};

const getOrdersByStatus = async (getOrdersByStatusRequest) => {
  const { status, page } = validation(
    getOrdersByStatusRequest,
    orderValidation.getOrdersByStatusRequest
  );

  const take = 20;
  const skip = (page - 1) * take;

  const orders = await prismaService.order.findMany({
    where: {
      status: status,
    },
    take: take,
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const getOrdersByCurrentUser = async (getOrdersByCurrentUserRequest) => {
  const { userId, page } = validation(
    getOrdersByCurrentUserRequest,
    orderValidation.getOrdersByCurrentUserRequest
  );

  const take = 20;
  const skip = (page - 1) * take;

  const orders = await prismaService.order.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    take: take,
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateStatus = async (updateStatusRequest) => {
  const { orderId, status } = validation(
    updateStatusRequest,
    orderValidation.updateStatusRequest
  );

  const order = await prismaService.order.update({
    where: {
      orderId: orderId,
    },
    data: {
      status: status,
    },
  });

  return order;
};

const deleteOrder = async (orderId) => {
  orderId = validation(orderId, orderValidation.orderId);

  await prismaService.order.update({
    where: {
      orderId: orderId,
    },
    data: {
      isDeleted: true,
    },
  });
};

const deleteOrderPermanently = async (orderId) => {
  orderId = validation(orderId, orderValidation.orderId);

  await prismaService.order.delete({
    where: {
      orderId: orderId,
    },
  });
};

export const orderService = {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrdersByStatus,
  getOrdersByCurrentUser,
  updateStatus,
  deleteOrder,
  deleteOrderPermanently,
};
