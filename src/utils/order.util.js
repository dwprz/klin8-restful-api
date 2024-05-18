import { Prisma } from "@prisma/client";
import prismaService from "../apps/database.js";
import { orderHelper } from "../helpers/order.helper.js";
import { pagingHelper } from "../helpers/paging.helper.js";

const createStatusesOrders = async (order) => {
  const { orderId, serviceMode } = order;

  const statuses = orderHelper.createStatuses({ orderId, serviceMode });

  await prismaService.status.createMany({
    data: statuses,
  });

  const result = await prismaService.status.findMany({
    where: {
      orderId: orderId,
    },
    orderBy: {
      statusId: "asc",
    },
  });

  return result;
};

const getStatusesOrders = async (orders) => {
  if (!orders.length) {
    return [];
  }

  const ordersIds = orders.map((order) => order.orderId);

  const statuses = await prismaService.$queryRaw`
    SELECT * FROM statuses
    WHERE "orderId" IN (${Prisma.join(ordersIds)})
    ORDER BY "statusId" ASC
    `;

  const result = orders.map((order) => {
    const filteredStatuses = statuses.filter(
      (status) => status.orderId === order.orderId
    );

    const { userId, ...restOrder } = order;

    return { ...restOrder, statuses: filteredStatuses };
  });

  return result;
};

const getOrdersCountByStatus = async (status) => {
  const [{ totalOrders }] = await prismaService.$queryRaw`
    SELECT 
        CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
    FROM 
        statuses
    WHERE
        "statusName"::text = ${status} 
        AND 
        "isCurrentStatus" = TRUE;
    `;

  return totalOrders;
};

const getUncompletedOrdersCount = async () => {
  const [{ totalOrders }] = await prismaService.$queryRaw`
    SELECT 
        CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
    FROM 
        statuses
    WHERE
        "statusName"::text != 'COMPLETED' 
        AND 
        "statusName"::text != 'CANCELED' 
        AND 
        "isCurrentStatus" = TRUE;
    `;

  return totalOrders;
};

const getUncompletedOrders = async (page) => {
  const take = 20;
  const skip = (page - 1) * take;

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
                "statusName"::text != 'COMPLETED'
                AND
                "statusName"::text != 'CANCELED'
                AND
                "isCurrentStatus" = TRUE
        )
    ORDER BY
        "createdAt" DESC
    LIMIT ${take} OFFSET ${skip};
    `;

  orders = await orderUtil.getStatusesOrders(orders);
  const totalOrders = await orderUtil.getUncompletedOrdersCount();

  const result = pagingHelper.formatePagedData(orders, totalOrders, page, take);
  return result;
};

export const orderUtil = {
  createStatusesOrders,
  getStatusesOrders,
  getOrdersCountByStatus,
  getUncompletedOrdersCount,
  getUncompletedOrders,
};
