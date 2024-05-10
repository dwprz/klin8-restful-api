import express from "express";
import verifyTokenMiddleware from "../middlewares/verify-token.middleware.js";
import { orderController } from "../controllers/order.controller.js";
import verifyAdminMiddleware from "../middlewares/verify-admin.middleware.js";
import verifyQRCodeTokenMiddleware from "../middlewares/verify-qrcode-token.middleware.js";

const orderRouter = express.Router();

// admin & user
orderRouter.post("/api/orders", verifyTokenMiddleware, orderController.createOrder);

// admin 
orderRouter.get("/api/orders", verifyTokenMiddleware, verifyAdminMiddleware, orderController.getAllOrders);
orderRouter.get("/api/orders/count", verifyTokenMiddleware, verifyAdminMiddleware, orderController.getOrdersCount);
orderRouter.get("/api/orders/customer/:customerName", verifyTokenMiddleware, verifyAdminMiddleware, orderController.getOrdersByCustomer);
orderRouter.get("/api/orders/status/:orderStatus", verifyTokenMiddleware, verifyAdminMiddleware, orderController.getOrdersByStatus);
orderRouter.get("/api/orders/qrcode-token", verifyTokenMiddleware, verifyAdminMiddleware, verifyQRCodeTokenMiddleware, orderController.getOrderById);
orderRouter.patch("/api/orders/:orderId/status", verifyTokenMiddleware, verifyAdminMiddleware, orderController.updateStatus);
orderRouter.delete("/api/orders/:orderId/permanent", verifyTokenMiddleware, verifyAdminMiddleware, orderController.deleteOrderPermanently);

// users
orderRouter.get("/api/orders/current-user", verifyTokenMiddleware, orderController.getOrdersByCurrentUser);
orderRouter.delete("/api/orders/:orderId", verifyTokenMiddleware, orderController.deleteOrder);

export default orderRouter;
