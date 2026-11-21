import "../src/instrument.js";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";

// Cache DB connection across serverless function warm containers
let connectingPromise = null;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!connectingPromise) {
    connectingPromise = connectDB()
      .catch((err) => {
        console.error("MongoDB connection failed in serverless handler:", err);
      })
      .finally(() => {
        connectingPromise = null;
      });
  }
  return connectingPromise;
};

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}
