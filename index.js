import express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from 'path'; // path is not used here but was in the original file, keeping imports consistent

dotenv.config();

// Configure Cloudinary (no changes needed here)
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

const app = express()

// Build allowed origins list from environment variables. Support comma-separated lists
// so you can provide multiple allowed origins in a single env var.
const devDefaultOrigin = 'http://localhost:5173';
function parseOrigins(...vals) {
  const list = [];
  for (const v of vals) {
    if (!v) continue;
    // split on comma and trim
    v.split(',').map(s => s.trim()).filter(Boolean).forEach(s => list.push(s));
  }
  return list;
}

let allowedOrigins = parseOrigins(process.env.FRONTEND_URL, process.env.FRONTEND_URL_2);
if (process.env.NODE_ENV !== 'production' && !allowedOrigins.includes(devDefaultOrigin)) {
  allowedOrigins.push(devDefaultOrigin);
}

// remove duplicates
allowedOrigins = [...new Set(allowedOrigins)];
console.log('Allowed CORS origins:', allowedOrigins);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests during development)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Make sure preflight requests are handled by CORS middleware
app.options('*', cors(corsOptions));
const PORT =  process.env.PORT || 8080

// Using middlewares
app.use(express.json());  // Data parsing for register and login
app.use(cookieParser());  // Middleware for parsing cookies

// Import routing
import userRoutes from './routes/userRoutes.js';
import pinRoutes from "./routes/pinRoutes.js";

// Routes
app.use('/api/user', userRoutes);
app.use("/api/pin", pinRoutes);

// Simple health check route
app.get("/",(request,response)=>{
    response.json({
        message : "Server is running on PORT " + PORT
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDb();
})
