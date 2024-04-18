import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers";
import jwt from "jsonwebtoken";
import { SystemConstants } from "../constants";
import { getConfig } from "../../../config";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError(SystemConstants.NotAuthorized.Token, 400));
  }

  const userDetail = jwt.verify(token, getConfig("jwtSecret"));
  req.body.user = userDetail;

  next();
};

export const authorizedRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // const currentRole = req.user.role;
    const currentRole = "";

    if (!roles.includes(currentRole)) {
      return next(new AppError(SystemConstants.NotAuthorized.Role, 401));
    }

    next();
  };
