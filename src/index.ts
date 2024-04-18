import { accessLogStream, getConfig } from "./config";
import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { EndPoints } from "./api/v1/constants";
import errorMiddleware from "./api/v1/middlewares/error.middleware";
import { categoryRouter, userRouter } from "./api/v1/routes";
import connectDB from "./config/db-connection";
import cors from "cors";
import { AppError } from "./api/v1/helpers";

const app: Express = express();
const port = getConfig("port");
var corsOptions = {
  origin: getConfig("frontendUrl"),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("combined", { stream: accessLogStream }));

connectDB();

// routes
app.use(`${EndPoints.V1}/${EndPoints.User.Path}`, userRouter);
app.use(`${EndPoints.V1}/${EndPoints.Category.Path}`, categoryRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("OPPS!! route not found", 404));
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
