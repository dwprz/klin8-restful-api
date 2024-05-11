import prismaService from "../apps/database.js";
import { authHelper } from "../helpers/auth.helper.js";
import { pagingHelper } from "../helpers/paging.helper.js";
import { orderUtil } from "../utils/order.util.js";
import { orderValidation } from "../validations/order.validation.js";
import validation from "../validations/validation.js";

const createOrder = async (createOrderRequest) => {
  createOrderRequest = validation(
    createOrderRequest,
    orderValidation.createOrderRequest
  );

  try {
    await prismaService.$queryRaw`
    BEGIN TRANSACTION;
    `;

    const order = await prismaService.order.create({
      data: createOrderRequest,
    });

    const statuses = await orderUtil.createStatusesOrders(order);

    await prismaService.$queryRaw`
    COMMIT TRANSACTION;
    `;

    return { ...order, statuses };
  } catch (error) {
    await prismaService.$queryRaw`
    ROLLBACK TRANSACTION;
    `;
  }
};

const getAllOrders = async (page) => {
  page = validation(page, orderValidation.page);

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  let orders = await prismaService.$queryRaw`
  SELECT * FROM orders  
  ORDER BY "createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = await orderUtil.getStatusesOrders(orders);

  const [{ totalOrders }] = await prismaService.$queryRaw`
  SELECT CAST(COUNT("orderId") as INTEGER) as "totalOrders" FROM orders;
  `;

  const result = pagingHelper.formatePagedData(orders, totalOrders, page, take);
  return result;
};

const getOrdersCount = async () => {
  const totalCompletedOrders = await orderUtil.getOrdersCountByStatus(
    "COMPLETED"
  );

  const totalCanceledOrders = await orderUtil.getOrdersCountByStatus(
    "CANCELED"
  );

  const totalUncompletedOrders = await orderUtil.getUncompletedOrdersCount();

  return {
    totalCompletedOrders,
    totalCanceledOrders,
    totalUncompletedOrders,
  };
};

const getOrdersByCustomer = async (getOrdersByCustomerRequest) => {
  let { customerName, page } = validation(
    getOrdersByCustomerRequest,
    orderValidation.getOrdersByCustomerRequest
  );

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  customerName = customerName.split(" ").join(" & ");

  let orders = await prismaService.$queryRaw`
  SELECT 
      *
  FROM 
      orders
  WHERE 
      to_tsvector("customerName") @@ to_tsquery(${customerName})
  ORDER BY
      "createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = await orderUtil.getStatusesOrders(orders);

  const [{ totalOrders }] = await prismaService.$queryRaw`
  SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
  FROM 
      orders
  WHERE
      to_tsvector("customerName") @@ to_tsquery(${customerName});
  `;

  const result = pagingHelper.formatePagedData(orders, totalOrders, page, take);
  return result;
};

const getOrdersByStatus = async (getOrdersByStatusRequest) => {
  const { status, page } = validation(
    getOrdersByStatusRequest,
    orderValidation.getOrdersByStatusRequest
  );

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  if (status === "UNCOMPLETED") {
    const result = await orderUtil.getUncompletedOrders(page);
    return result;
  }

  let orders = await prismaService.$queryRaw`
  SELECT 
      *
  FROM 
      orders 
  WHERE 
      "orderId" IN (
          SELECT
              "orderId"
          FROM
              statuses
          WHERE
              "statusName"::text = ${status}
              AND
              "isCurrentStatus" = TRUE
      )
  ORDER BY
      "createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = await orderUtil.getStatusesOrders(orders);
  const totalOrders = await orderUtil.getOrdersCountByStatus(status);

  const result = pagingHelper.formatePagedData(orders, totalOrders, page, take);
  return result;
};

const getOrdersByCurrentUser = async (getOrdersByCurrentUserRequest) => {
  const { userId, page } = validation(
    getOrdersByCurrentUserRequest,
    orderValidation.getOrdersByCurrentUserRequest
  );

  const { take, skip } = pagingHelper.createTakeAndSkip(page);

  let orders = await prismaService.$queryRaw`
  SELECT 
      *
  FROM 
      orders
  WHERE 
      "userId" = ${userId} AND "isDeleted" = FALSE
  ORDER BY
      "createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
  `;

  orders = await orderUtil.getStatusesOrders(orders);

  const [{ totalOrders }] = await prismaService.$queryRaw`
  SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
  FROM 
      orders
  WHERE
      "userId" = ${userId} AND "isDeleted" = FALSE;
  `;

  const result = pagingHelper.formatePagedData(orders, totalOrders, page, take);
  return result;
};

const getOrderById = async (orderId) => {
  orderId = validation(orderId, orderValidation.orderId);

  const order = await prismaService.$queryRaw`
  SELECT * FROM orders 
  WHERE "orderId" = ${orderId}
  `;

  const [result] = await orderUtil.getStatusesOrders(order);
  return result;
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

  const [order] = await prismaService.$queryRaw`
  SELECT * FROM orders
  WHERE "orderId" = ${orderId};
  `;

  const statuses = await prismaService.$queryRaw`
  SELECT * FROM statuses
  WHERE "orderId" = ${orderId};
  `;

  return { ...order, statuses };
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
  getOrdersCount,
  getOrdersByCustomer,
  getOrdersByStatus,
  getOrdersByCurrentUser,
  getOrderById,
  updateStatus,
  deleteOrder,
  deleteOrderPermanently,
};
