import express from "express";
import { authController } from "../controllers/auth.controller.js";
import verifyTokenMiddleware from "../middlewares/verify-token.middleware.js";

const authRouter = express.Router();

// admin & user
authRouter.post("/api/users/login", authController.login);
authRouter.post("/api/users/refresh-token", authController.refreshToken);
authRouter.patch("/api/users/logout", verifyTokenMiddleware, authController.logout);

// users
authRouter.post("/api/users/send-otp", authController.sendOtp);
authRouter.post("/api/users/verify-otp", authController.verifyOtp);
authRouter.post("/api/users/register", authController.register);
authRouter.post("/api/users/login-google", authController.loginGoogle);

export default authRouter;
