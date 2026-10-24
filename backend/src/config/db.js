import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

const connectDB = async (uri = env.MONGO_URI) => {
  const conn = await mongoose.connect(uri);
  logger.info(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
