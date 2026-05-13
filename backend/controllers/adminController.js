import asyncHandler from "express-async-handler";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Inquiry from "../models/Inquiry.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
	const [
		totalProperties,
		approvedProperties,
		pendingProperties,
		featuredProperties,
		totalUsers,
		totalAgents,
		totalBlogs,
		totalInquiries,
		totalViewsResult
	] = await Promise.all([
		Property.countDocuments(),
		Property.countDocuments({ isApproved: true }),
		Property.countDocuments({ isApproved: false }),
		Property.countDocuments({ isFeatured: true }),
		User.countDocuments({ role: "user" }),
		User.countDocuments({ role: "agent" }),
		Blog.countDocuments(),
		Inquiry.countDocuments(),
		Property.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }])
	]);

	const totalViews = totalViewsResult[0]?.total || 0;

	res.json({
		success: true,
		stats: {
			totalProperties,
			approvedProperties,
			pendingProperties,
			featuredProperties,
			totalUsers,
			totalAgents,
			totalBlogs,
			totalInquiries,
			totalViews
		},
	});
});

export const getAllProperties = asyncHandler(async (req, res) => {
	const properties = await Property.find().sort({ createdAt: -1 });
	res.json({ success: true, properties });
});

export const updatePropertyAdmin = asyncHandler(async (req, res) => {
	const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
		returnDocument: "after",
		runValidators: true,
	});

	if (!property) {
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });
	}

	res.json({ success: true, property });
});

export const deletePropertyAdmin = asyncHandler(async (req, res) => {
	const property = await Property.findByIdAndDelete(req.params.id);

	if (!property) {
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });
	}

	res.json({ success: true, message: "Property deleted successfully" });
});
