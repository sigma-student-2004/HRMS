import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DBconnection from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicantRoutes from "./routes/applicantRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import router from "./routes/dashboardRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payrollRouter from "./routes/payrollRoutes.js";
import applicantRouter from "./routes/applicantRoutes.js";
import performanceReviewRouter from "./routes/performanceReviewRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS FIX (important for frontend)
app.use(
  cors({
    origin: "https://hrms-one-omega.vercel.app",
    credentials: true,
  })
);

// middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// DB
DBconnection();


console.log(process.env.ATLAS_URI);

// PORT
const PORT = process.env.PORT || 8000;

// ROUTES
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/jobs",jobRoutes);
app.use("/applicant",applicantRouter);
app.use("/attendance",attendanceRoutes);
app.use("/dashboard", router);
app.use("/leaves", leaveRoutes);
app.use("/payroll", payrollRouter);
app.use("/performance-review",performanceReviewRouter)

// SERVER START
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});