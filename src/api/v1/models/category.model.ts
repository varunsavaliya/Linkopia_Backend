import { model, Model, Schema } from "mongoose";
import { ICategory } from "../interfaces";

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> = model("Category", categorySchema);
