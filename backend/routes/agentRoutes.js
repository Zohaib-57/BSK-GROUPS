// agentRoutes.js
import { Router } from "express";
const router = Router();
import User from "../models/User.js";
import Property from "../models/Property.js";
import asyncHandler from "express-async-handler";
import { protect, authorize } from "../middleware/auth.js";

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const agents = await User.find({
			role: "agent",
			isActive: true,
		}).select("name email phone avatar role");
		res.json({ success: true, agents });
	}),
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const agent = await User.findById(req.params.id).select(
			"name email phone avatar createdAt",
		);
		if (!agent)
			return res
				.status(404)
				.json({ success: false, message: "Agent not found" });
		const properties = await Property.find({
			postedBy: req.params.id,
			isApproved: true,
		}).limit(6);
		res.json({ success: true, agent, properties });
	}),
);

router.put(
	"/:id/make-agent",
	protect,
	authorize("admin"),
	asyncHandler(async (req, res) => {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ role: "agent" },
			{ returnDocument: "after" },
		);
		res.json({ success: true, user });
	}),
);

export default router;
