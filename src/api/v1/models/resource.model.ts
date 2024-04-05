import { model, Model, Schema } from "mongoose";
import { ResourceStatus } from "../enums";
import { IResource } from "../interfaces";

const resourceSchema: Schema<IResource> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Resource name is required"],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Resource description is required"],
      trim: true,
    },
    stackId: {
      type: Schema.Types.ObjectId,
      ref: "stack",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: [
        ResourceStatus.Pending,
        ResourceStatus.Approved,
        ResourceStatus.Declined,
      ],
      default: ResourceStatus.Pending,
    },
  },
  {
    timestamps: true,
  }
);

export const Resource: Model<IResource> = model("Resource", resourceSchema);
