import "./instrument.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { resumePendingIngestion } from "./services/ingestion/queue.js";

// After an uncaught exception the process is in an unknown state: log and exit
// so the platform (Railway) restarts a clean instance.
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection');
});

// Start HTTP server FIRST so Railway's health-check passes immediately,
// then connect to MongoDB in the background.
app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);

  // Connect to MongoDB after the server is already listening
  connectDB()
    .then(() => resumePendingIngestion())
    .catch((err) => {
      logger.error({ err: err.message }, 'MongoDB connection failed (server still running)');
    });
});
