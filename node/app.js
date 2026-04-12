import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './api/routers/auth-routes.js';
import dotenv from 'dotenv';
const app = express();

dotenv.config();

const port = 5000; 

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));

app.use(express.json());
mongoose.connect("mongodb://localhost:27017/your_db_name") 
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});