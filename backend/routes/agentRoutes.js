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
		}).select("name email phone avatar role isVerified isOfficialAgent city");

		// Fetch listings count for each agent
		const agentsWithCounts = await Promise.all(
			agents.map(async (agent) => {
				const count = await Property.countDocuments({
					postedBy: agent._id,
					isApproved: true,
				});
				return {
					...agent.toObject(),
					listingsCount: count,
				};
			})
		);

		res.json({ success: true, agents: agentsWithCounts });
	}),
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const agent = await User.findById(req.params.id).select(
			"name email phone avatar createdAt role isVerified isOfficialAgent city",
		);
		if (!agent)
			return res
				.status(404)
				.json({ success: false, message: "Agent not found" });

		const properties = await Property.find({
			postedBy: req.params.id,
			isApproved: true,
		}).limit(12);

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
