// authRoutes.js
import { Router } from "express";
const router = Router();
import {
	register,
	login,
	refreshToken,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
	verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

export default router;
