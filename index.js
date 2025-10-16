import express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';
import cors from 'cors';

dotenv.config();

// --- Cloudinary Config ---
cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

// --- Dynamic CORS Setup (same logic as your reference) ---
const allowedOrigins = [
  process.env.FRONTEND_URL,     // e.g. deployed frontend
  process.env.FRONTEND_URL_2,   // optional secondary
  process.env.FRONTEND_URL_3,   // optional third
  'http://localhost:5173',      // local dev
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --- Middlewares ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// --- Routes ---
import userRoutes from './routes/userRoutes.js';
import pinRoutes from "./routes/pinRoutes.js";

app.use('/api/user', userRoutes);
app.use("/api/pin", pinRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ message: `Server is running on PORT ${process.env.PORT || 8080}` });
});

// --- Server + DB connection ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  connectDb();
});
