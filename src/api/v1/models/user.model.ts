import bcrypt from "bcryptjs";
import { Schema, model, Model, Document } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../interfaces";
import { UserRole } from "../enums";
import { getConfig } from "../../../config";

interface IUserMethods extends Document {
  comparePassword: (plainTextPassword: string) => Promise<boolean>;
  generateJWTToken: () => Promise<string>;
  generatePasswordResetToken: () => Promise<string>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name should be smaller than 50 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: [UserRole.User, UserRole.Admin],
      default: UserRole.User,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "resource",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password as string, 10);
  return next();
});

userSchema.method("generateJWTToken", async function generateJWTToken() {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    getConfig("jwtSecret"),
    {
      expiresIn: getConfig("jwtExpiry"),
    }
  );
});
userSchema.method(
  "comparePassword",
  async function comparePassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password!);
  }
);
userSchema.method(
  "generatePasswordResetToken",
  async function generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Set expiry time 15 minutes from now
    this.forgotPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return resetToken;
  }
);

export const User = model<IUser, UserModel>("User", userSchema);
