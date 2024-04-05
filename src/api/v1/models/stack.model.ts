import { model, Model, Schema } from "mongoose";
import { IStack } from "../interfaces";

const stackSchema: Schema<IStack> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Stack name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Stack description is required"],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
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

export const Stack: Model<IStack> = model("Stack", stackSchema);
