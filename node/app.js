import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './api/routers/auth-routes.js';
import requestRoutes from './api/routers/requestRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMyRequest } from './api/controllers/request.js';
import { getRequestByLoggedUser } from './api/controllers/request.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// השרת של קבצים סטטיים מתיקיית uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

mongoose.connect("mongodb://localhost:27017/your_db_name") 
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/requests/my-request', getMyRequest);
app.use('/api/requests/my-status', getRequestByLoggedUser);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});