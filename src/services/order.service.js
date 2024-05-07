import prismaService from "../apps/database/db.js";
import { orderHelper } from "../helpers/order.helper.js";
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

  const statuses = await orderHelper.createStatuses(order);

  return { ...order, statuses };
};

const getAllOrders = async (page) => {
  page = validation(page, orderValidation.page);

  const take = 20;
  const skip = (page - 1) * take;

  let orders = await prismaService.$queryRaw`
  SELECT 
    * 
  FROM 
      orders as o 
  INNER JOIN 
      statuses as s ON s."orderId" = o."orderId"
  ORDER BY
      o."createdAt" DESC 
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = orderHelper.transformOrders(orders);
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

  let orders = await prismaService.$queryRaw`
  SELECT 
      o.*, s.*
  FROM 
      orders as o
  INNER JOIN
      statuses as s ON s."orderId" = o."orderId"
  WHERE 
      to_tsvector("customerName") @@ to_tsquery(${customerName})
  ORDER BY
      o."createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = orderHelper.transformOrders(orders);
  return orders;
};

const getOrdersByStatus = async (getOrdersByStatusRequest) => {
  const { status, page } = validation(
    getOrdersByStatusRequest,
    orderValidation.getOrdersByStatusRequest
  );

  const take = 20;
  const skip = (page - 1) * take;

  let orders = await prismaService.$queryRaw`
  SELECT 
      o.*, s.*
  FROM 
      orders as o
  INNER JOIN
      statuses as s ON s."orderId" = o."orderId"
  WHERE 
      s."statusName"::text = ${status}
  ORDER BY
      o."createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = orderHelper.transformOrders(orders);
  return orders;
};

const getOrdersByCurrentUser = async (getOrdersByCurrentUserRequest) => {
  const { userId, page } = validation(
    getOrdersByCurrentUserRequest,
    orderValidation.getOrdersByCurrentUserRequest
  );

  const take = 20;
  const skip = (page - 1) * take;

  let orders = await prismaService.$queryRaw`
  SELECT 
    o.*, s.*
  FROM 
      orders as o
  INNER JOIN
      statuses as s ON s."orderId" = o."orderId"
  WHERE 
      o."userId" = ${userId} AND o."isDeleted" = FALSE
  ORDER BY
      o."createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = orderHelper.transformOrders(orders);
  return orders;
};

const updateStatus = async (updateStatusRequest) => {
  const { orderId, status } = validation(
    updateStatusRequest,
    orderValidation.updateStatusRequest
  );

  await prismaService.$queryRaw`
  UPDATE statuses
  SET
      "isCurrentStatus" = CASE
          WHEN "statusName"::text = ${status} THEN TRUE
          ELSE FALSE
      END,
      "date" = CASE
          WHEN "statusName"::text = ${status} THEN now()
          ELSE "date"
      END
  WHERE
      "orderId" = ${orderId};
  `;

  const order = await prismaService.$queryRaw`
  SELECT * FROM orders
  WHERE "orderId" = ${orderId};
  `;

  const statuses = await prismaService.$queryRaw`
  SELECT * FROM statuses
  WHERE "orderId" = ${orderId};
  `;

  return { ...order[0], statuses };
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

  await prismaService.status.deleteMany({
    where: {
      orderId: orderId,
    },
  });

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
