import express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';
import cors from 'cors';

dotenv.config();

// Configure Cloudinary (no changes needed here)
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
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
