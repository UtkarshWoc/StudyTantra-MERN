import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Re-throw so the caller can handle it — do NOT call process.exit()
    // because that kills the HTTP server which makes Railway return 502.
    throw error;
  }
};

export default connectDB;
