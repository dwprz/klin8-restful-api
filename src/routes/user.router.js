import express from "express";
import verifyTokenMiddleware from "../middlewares/verify-token.middleware.js";
import { userController } from "../controllers/user.controller.js";
import uploadPhotoProfile from "../middlewares/upload-photo-profile.middleware.js";
import processingImageMiddleware from "../middlewares/processing-image.middleware.js";
import verifyAdminMiddleware from "../middlewares/verify-admin.middleware.js";

const userRouter = express.Router();

// admin
userRouter.get("/api/users", verifyTokenMiddleware, verifyAdminMiddleware, userController.getUsersByRole);
userRouter.get("/api/users/full-name/:fullName", verifyTokenMiddleware, verifyAdminMiddleware, userController.getUsersByFullName);

// user & admin
userRouter.get("/api/users/current", verifyTokenMiddleware, userController.getCurrentUser);
userRouter.patch("/api/users/current", verifyTokenMiddleware, userController.updateUser);
userRouter.patch("/api/users/current/password", verifyTokenMiddleware, userController.updatePassword);
userRouter.patch("/api/users/current/email", verifyTokenMiddleware, userController.updateEmail);
userRouter.patch("/api/users/current/photo-profile", verifyTokenMiddleware, uploadPhotoProfile.single('photoProfile'), processingImageMiddleware, userController.updatePhotoProfile);

export default userRouter;
