import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import { EndPoints } from "./api/v1/constants";
import errorMiddleware from "./api/v1/middlewares/error.middleware";
import { categoryRouter, userRouter } from "./api/v1/routes";
import connectDB from "./config/db-connection";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const logsDir = path.join("logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

connectDB();

// routes
app.use(`${EndPoints.V1}/${EndPoints.User.Path}`, userRouter);
app.use(`${EndPoints.V1}/${EndPoints.Category.Path}`, categoryRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("OPPS!! route not found");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
