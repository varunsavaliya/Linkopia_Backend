import { NextFunction, Request, Response } from "express";
import { getConfig } from "../../../config";
import { AppError } from "../helpers";

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: getConfig("nodeEnv") === "production" ? undefined : err.stack,
  });
};

export default errorMiddleware;
