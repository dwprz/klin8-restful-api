const createStatuses = ({ orderId, serviceMode }) => {
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
    isCurrentStatus: false,
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
        readyForCollection,
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

  return statuses;
};

export const orderHelper = {
  createStatuses,
};
