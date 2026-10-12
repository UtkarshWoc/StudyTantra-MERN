import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Trust proxy for rate limiter to work correctly behind reverse proxies like Railway
app.set('trust proxy', 1);

// CORS: Must be defined before other middlewares so rejected requests still get CORS headers
const normalizeOrigin = (o) => o.trim().replace(/\/+$/, '').toLowerCase();

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'https://study-tantra-mern.vercel.app',
  // Supports a comma-separated list of origins
  ...(process.env.ALLOWED_ORIGIN || '').split(',').filter(Boolean).map(normalizeOrigin),
]);

app.use(cors({
  origin: function (origin, callback) {
    // Requests with no Origin (curl, server-to-server) are allowed. Browser origins
    // must match exactly — a prefix check would let "https://app.vercel.app.evil.com" in.
    callback(null, !origin || allowedOrigins.has(normalizeOrigin(origin)));
  },
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// Security headers
app.use(helmet());

// Rate limiting (100 req per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check routes. /healthz reports 503 until MongoDB is connected so
// platform health checks don't mark a DB-less instance as healthy.
app.get("/", (req, res) => {
  res.send("StudyTantra API is running...");
});

app.get("/healthz", (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ok' : 'degraded', db: dbReady ? 'connected' : 'disconnected' });
});

// Fail fast instead of letting Mongoose buffer queries until they time out.
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Service is starting up or the database is unavailable. Please retry shortly.' });
  }
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Files are served from Cloudinary — no local static file serving needed

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
