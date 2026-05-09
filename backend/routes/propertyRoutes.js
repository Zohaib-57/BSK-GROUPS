import { Router } from "express";
const router = Router();
import {
	getProperties,
	getFeaturedProperties,
	getProperty,
	getPropertyById,
	createProperty,
	updateProperty,
	deleteProperty,
	getMyProperties,
	approveProperty,
	getAgentStats,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

router.get("/", getProperties);
router.get("/featured", getFeaturedProperties);
router.get("/agent-stats", protect, getAgentStats);
router.get("/my-properties", protect, getMyProperties);
router.get("/id/:id", getPropertyById); // New
router.get("/:slug", getProperty);
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.put("/:id/approve", protect, authorize("admin"), approveProperty);

export default router;
