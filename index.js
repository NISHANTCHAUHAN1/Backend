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

// Define allowed origins and filter out any undefined/null values
// Add a sensible default for local development so requests from Vite (http://localhost:5173)
// are allowed when NODE_ENV !== 'production' and env vars are not set.
const devDefaultOrigin = 'http://localhost:5173';
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  ...(process.env.NODE_ENV !== 'production' ? [devDefaultOrigin] : [])
].filter(Boolean); // .filter(Boolean) removes undefined, null, and empty string entries

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests during development)
    if (!origin) return callback(null, true);

    // Check if the requesting origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      // allow this origin
      return callback(null, true);
    }

    // Do not throw here — throwing an error inside the CORS callback results in an exception
    // and typically a 500 response. Instead, disallow the origin cleanly so the browser
    // will block the response via missing CORS headers.
    console.error(`CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true
}))

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
