import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Catch any uncaught exceptions / unhandled rejections so they are logged
// instead of silently crashing the process.
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

// Start HTTP server FIRST so Railway's health-check passes immediately,
// then connect to MongoDB in the background.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

  // Connect to MongoDB after the server is already listening
  connectDB().catch((err) => {
    console.error('MongoDB connection failed (server still running):', err.message);
  });
});
