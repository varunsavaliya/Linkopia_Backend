import { Types } from "mongoose";
import { ResourceStatus } from "../enums";

export interface IResource extends Document {
  name: string;
  stackId: Types.ObjectId;
  description: string;
  link: string;
  isActive: boolean;
  status: ResourceStatus;
  createdBy: Types.ObjectId;
}
