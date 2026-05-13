// userRoutes.js
import { Router } from "express";
const router = Router();
import {
	getProfile,
	updateProfile,
	changePassword,
	saveProperty,
	getSavedProperties,
	getAllUsers,
	updateUserStatus,
	updateUserAdmin,
	deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/save-property/:propertyId", protect, saveProperty);
router.get("/saved-properties", protect, getSavedProperties);
router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/:id/status", protect, authorize("admin"), updateUserStatus);
router.put("/:id", protect, authorize("admin"), updateUserAdmin);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
