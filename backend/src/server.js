import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// After an uncaught exception the process is in an unknown state: log and exit
// so the platform (Railway) restarts a clean instance.
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
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
