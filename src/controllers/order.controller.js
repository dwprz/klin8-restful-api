import { orderService } from "../services/order.service.js";

const createOrder = async (req, res, next) => {
  try {
    const { userId, role } = req.userData;

    role === "ADMIN" ? (req.body.userId = null) : (req.body.userId = userId);

    const result = await orderService.createOrder(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const page = Number(req.query["page"]);

    const { data, paging } = await orderService.getAllOrders(page);
    res.status(200).json({ data, paging });
  } catch (error) {
    next(error);
  }
};

const getOrdersCount = async (req, res, next) => {
  try {
    const result = await orderService.getOrdersCount();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getOrdersByCustomer = async (req, res, next) => {
  try {
    const customerName = decodeURIComponent(req.params["customerName"]);
    const page = Number(req.query["page"]);

    const { data, paging } = await orderService.getOrdersByCustomer({
      customerName,
      page,
    });

    res.status(200).json({ data, paging });
  } catch (error) {
    next(error);
  }
};

const getOrdersByStatus = async (req, res, next) => {
  try {
    const status = req.params["orderStatus"];
    const page = Number(req.query["page"]);

    const { data, paging } = await orderService.getOrdersByStatus({
      status,
      page,
    });

    res.status(200).json({ data, paging });
  } catch (error) {
    next(error);
  }
};

const getOrdersByCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    const page = Number(req.query["page"]);

    const { data, paging } = await orderService.getOrdersByCurrentUser({
      userId,
      page,
    });

    res.status(200).json({ data, paging });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const orderId = Number(req.params["orderId"]);
    const result = await orderService.getOrderById(orderId);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const orderId = Number(req.params["orderId"]);

    const result = await orderService.updateStatus({ ...req.body, orderId });
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const orderId = Number(req.params["orderId"]);

    await orderService.deleteOrder(orderId);
    res.status(200).json({ message: "deleted order successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteOrderPermanently = async (req, res, next) => {
  try {
    const orderId = Number(req.params["orderId"]);

    await orderService.deleteOrderPermanently(orderId);
    res.status(200).json({ message: "deleted order permanently successfully" });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
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
