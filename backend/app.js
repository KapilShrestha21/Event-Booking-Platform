import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
import AppError from "./src/utils/AppError.js";

const app = express();

// find the current file path - which is - F:\Github-push-project\ticketing-platform\backend\app.js
const __filename = fileURLToPath(import.meta.url);

// find the current folder containing that file - which is - F:\Github-push-project\ticketing-platform\backend
const __dirname = path.dirname(__filename);

// create a path to upload - like accessing uploads folder
const uploadsDir = path.join(__dirname, 'uploads');

// ensure 'uploads' directory exists on server startup
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// middleware
app.use(express.json());
app.use(cookieParser());

// make save image accessible through a URL - The URL starts with /uploads, so it should look inside uploads folder
app.use(
    '/uploads', // When the URL starts with /uploads, use this uploads folder to find the requested file.
    express.static(path.join(__dirname, 'uploads')) // Actual folder where the files are stored
);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

// route
app.use("/api/v1/auth", authRoutes); // for login http://localhost:5000/api/v1/auth/login
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// catch error if "client hits a nonexistent route"
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// error handler middleware
app.use(errorHandler);

export default app;