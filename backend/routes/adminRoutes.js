import { Router } from "express";
const router = Router();
import {
	getDashboardStats,
	getAllProperties,
	updatePropertyAdmin,
	deletePropertyAdmin,
} from "../controllers/adminController.js";
import { getPropertyById } from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById); // New
router.put("/properties/:id", updatePropertyAdmin);
router.delete("/properties/:id", deletePropertyAdmin);

export default router;
