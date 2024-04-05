import { Types } from "mongoose";

export interface IStack extends Document {
  name: string;
  categoryId: Types.ObjectId;
  description: string;
  isActive: boolean;
}
