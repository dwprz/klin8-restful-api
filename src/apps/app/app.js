import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "../../routes/auth.router.js";
import userRouter from "../../routes/user.router.js";
import orderRouter from "../../routes/order.router.js";
import errorMiddleware from "../../middlewares/error.middleware.js";

const app = express();
app.use(cors());
app.use(express.static(process.cwd() + "/public"));
app.use(cookieParser());
app.use(json());
app.use(authRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(errorMiddleware);

export default app;
