import "./loadEnv.js";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
	console.error("Missing JWT_SECRET or JWT_REFRESH_SECRET in .env");
	process.exit(1);
}

const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
	}),
);

app.use(json());
app.use(urlencoded({ extended: true }));

// ✅ Routes (FIXED)
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "BSK Groups API is running", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});

// Connect DB
const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB connected");
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection failed:", err.message);
		process.exit(1);
	});
