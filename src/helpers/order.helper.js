import prismaService from "../apps/database/db.js";

const createStatuses = async (order) => {
  const { orderId, serviceMode } = order;
  let statuses;

  const pendingPickUp = {
    orderId: orderId,
    statusName: "PENDING_PICK_UP",
    description: "Menunggu barang dijemput",
    icon: "fa-solid fa-truck-pickup",
    isCurrentStatus: false,
    date: null,
  };

  const inProgress = {
    orderId: orderId,
    statusName: "IN_PROGRESS",
    description: "Sedang diproses",
    icon: "fa-solid fa-brush",
    isCurrentStatus: false,
    date: null,
  };

  const beingDelivered = {
    orderId: orderId,
    statusName: "BEING_DELIVERED",
    description: "Sedang dikirim",
    icon: "fa-solid fa-truck",
    isCurrentStatus: true,
    date: null,
  };

  const readyForCollection = {
    orderId: orderId,
    statusName: "READY_FOR_COLLECTION",
    description: "Siap diambil",
    icon: "fa-solid fa-box-archive",
    isCurrentStatus: false,
    date: null,
  };

  const completed = {
    orderId: orderId,
    statusName: "COMPLETED",
    description: "Selesai",
    icon: "fa-solid fa-clipboard-check",
    isCurrentStatus: false,
    date: null,
  };

  const currentDate = new Date().toISOString();

  switch (serviceMode) {
    case "REGULAR":
      statuses = [
        { ...inProgress, isCurrentStatus: true, date: currentDate },
        completed,
      ];
      break;
    case "PICK_UP_ONLY":
      statuses = [
        { ...pendingPickUp, isCurrentStatus: true, date: currentDate },
        inProgress,
        readyForCollection,
        completed,
      ];
      break;
    case "DELIVERY_ONLY":
      statuses = [
        { ...inProgress, isCurrentStatus: true, date: currentDate },
        beingDelivered,
        completed,
      ];
      break;
    case "PICK_UP_AND_DELIVERY":
      statuses = [
        { ...pendingPickUp, isCurrentStatus: true, date: currentDate },
        inProgress,
        beingDelivered,
        completed,
      ];
      break;
    default:
      break;
  }

  await prismaService.status.createMany({
    data: statuses,
  });

  const result = await prismaService.status.findMany({
    where: {
      orderId: orderId,
    },
  });

  return result;
};

const transformOrders = (orders) => {
  if (!orders.length) {
    return [];
  }

  let processedOrders = {};

  orders.forEach((order) => {
    if (!processedOrders[order.orderId]) {
      processedOrders[order.orderId] = {
        orderId: order.orderId,
        customerName: order.customerName,
        userId: order.userId,
        itemName: order.itemName,
        serviceName: order.serviceName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        serviceMode: order.serviceMode,
        paymentMethod: order.paymentMethod,
        whatsapp: order.whatsapp,
        address: order.address,
        isDeleted: order.isDeleted,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        statuses: [],
      };
    }

    const status = {
      statusId: order.statusId,
      statusName: order.statusName,
      description: order.description,
      icon: order.icon,
      isCurrentStatus: order.isCurrentStatus,
      date: order.date,
    };

    processedOrders[order.orderId].statuses.push(status);
  });

  const result = Object.values(processedOrders);
  return result;
};

export const orderHelper = {
  createStatuses,
  transformOrders,
};
