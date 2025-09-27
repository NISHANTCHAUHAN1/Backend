import express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';
import path from 'path';
import cors from 'cors';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
  });

const app = express()
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  
  credentials: true
}))


app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

const port = process.env.PORT || 5000;


//using middleweares
app.use(express.json());  // data pass for register and login
app.use(cookieParser());  // npm cookie cookies pass for profile
 
// import routing
import userRoutes from './routes/userRoutes.js';
import pinRoutes from "./routes/pinRoutes.js";

app.use('/api/user', userRoutes);
app.use("/api/pin", pinRoutes);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})