import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../helpers";
import { cookieOptions } from "../../../config";
import { sendEmail } from "../services";
import { Messages, SystemConstants } from "../constants";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError(Messages.AllFieldsRequired, 400));
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError(Messages.User.Error.UserExists, 400));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return next(new AppError(Messages.User.Error.Registration, 400));
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie(SystemConstants.Token, token, cookieOptions);

    res.status(200).json({
      success: true,
      message: Messages.User.Success.Registration,
      data: user,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(Messages.AllFieldsRequired, 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    let isPassCorrect;
    if (user) isPassCorrect = await user.comparePassword(password);
    if (!user || !isPassCorrect) {
      return next(new AppError(Messages.User.Error.Login, 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie(SystemConstants.Token, token, cookieOptions);

    res.status(200).json({
      success: true,
      message: Messages.User.Success.Login,
      data: user,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie(SystemConstants.Token, null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: Messages.User.Success.LogOut,
  });
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id;
  try {
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: Messages.User.Success.UserDetails,
      data: user,
    });
  } catch (error: any) {
    return next(new AppError(Messages.User.Error.UserDetails, 500));
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError(Messages.User.Error.EmailRequired, 400));
  }
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(Messages.User.Error.NotRegistered, 400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = "Reset your password";
    const message = `You can reset your password by clicking on this link -> ${resetPasswordURL}`;

    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `${Messages.User.Success.ResetPassword} ${email}`,
    });
  } catch (error: any) {
    if (user) {
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;

      await user.save();
    }
    return next(new AppError(error.message, 400));
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resetPasswordToken } = req.body;

  const { password } = req.body;

  try {
    const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError(Messages.User.Error.Token, 400));
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: Messages.User.Success.ChangePassword,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.body.user._id;

  if (!oldPassword || !newPassword) {
    return next(new AppError(Messages.AllFieldsRequired, 400));
  }

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new AppError(Messages.User.Error.UserNotExists, 400));
    }

    const isOldPasswordMatched = await user.comparePassword(oldPassword);
    const isNewPasswordMatched = await user.comparePassword(newPassword);

    if (!isOldPasswordMatched) {
      return next(new AppError(Messages.User.Error.OldPassIncorrect, 400));
    }

    if (isNewPasswordMatched) {
      return next(new AppError(Messages.User.Error.SamePass, 400));
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: Messages.User.Success.ChangePassword,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const userId = req.body.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError(Messages.User.Error.UserNotExists, 400));
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: Messages.User.Update.UserDetails,
    });
  } catch (error: any) {
    return new AppError(error.message, 500);
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
