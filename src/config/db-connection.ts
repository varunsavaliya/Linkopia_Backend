import mongoose from "mongoose";
import { getConfig } from "./env-config";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(getConfig("mongoUri"));
    if (connection) console.log(`connected to mongoDB: ${connection.host}`);
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
