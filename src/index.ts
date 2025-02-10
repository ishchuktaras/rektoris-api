import express, { Application } from "express";
import cors from "cors";
import schoolRouter from "./routes/school";
import adminRouter from "./routes/admin";
import classRouter from "./routes/classes";
import parentRouter from "./routes/parents";
import studentRouter from "./routes/students";
import departmentRouter from "./routes/departments";
import subjectRouter from "./routes/subjects";
import teachersRouter from "./routes/teachers";
import userRouter from "./routes/user";
import analyticsRouter from "./routes/analytics";

// Configure environment variables
require("dotenv").config();

// Initialize express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port
const PORT: number = Number(process.env.PORT) || 8000;

// API routes
app.use("/api/v1", schoolRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", classRouter);
app.use("/api/v1", parentRouter);
app.use("/api/v1", studentRouter);
app.use("/api/v1", departmentRouter);
app.use("/api/v1", subjectRouter);
app.use("/api/v1", teachersRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", analyticsRouter);


export default app;



