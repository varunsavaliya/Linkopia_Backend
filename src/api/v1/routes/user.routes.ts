import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
} from "../controllers";
import express from "express";
import { isLoggedIn } from "../middlewares";
import { EndPoints } from "../constants";

export const userRouter = express.Router();

userRouter.post(`/${EndPoints.User.Post.Register}`, register);
userRouter.post(`/${EndPoints.User.Post.Login}`, login);
userRouter.get(`/${EndPoints.User.Get.Logout}`, logout);
userRouter.get(`/${EndPoints.User.Get.Profile}`, isLoggedIn, getProfile);
userRouter.post(`/${EndPoints.User.Post.ForgotPassword}`, forgotPassword);
userRouter.post(`/${EndPoints.User.Post.ResetPassword}`, resetPassword);
userRouter.post(
  `/${EndPoints.User.Post.ChangePassword}`,
  isLoggedIn,
  changePassword
);
userRouter.post(
  `/${EndPoints.User.Post.UpdateProfile}`,
  isLoggedIn,
  updateProfile
);
