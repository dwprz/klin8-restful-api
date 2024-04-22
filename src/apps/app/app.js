import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "../../routes/auth/auth.router.js";
import userRouter from "../../routes/user/user.router.js";
import orderRouter from "../../routes/order/order.router.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(authRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(errorMiddleware);

export default app;
