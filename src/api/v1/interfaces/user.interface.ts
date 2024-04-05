import { Request } from "express";
import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  saved: Types.Array<Types.ObjectId>;
  isActive: boolean;
}

export type IUserRequest =Request<{}, {}, { user: IUser; }>;