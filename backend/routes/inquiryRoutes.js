// inquiryRoutes.js
import { Router } from "express";
const router = Router();
import {
	createInquiry,
	getMyInquiries,
	updateInquiryStatus,
	getAllInquiries,
} from "../controllers/inquiryController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";

router.post("/", optionalAuth, createInquiry);
router.get("/my-inquiries", protect, getMyInquiries);
router.put("/:id/status", protect, updateInquiryStatus);
router.get("/", protect, authorize("admin"), getAllInquiries);

export default router;
