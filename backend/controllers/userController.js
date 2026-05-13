import mongoose from "mongoose";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const getProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).populate(
		"savedProperties",
		"title price location images slug purpose type",
	);
	res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
	const { name, phone, avatar } = req.body;
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{ name, phone, avatar },
		{ returnDocument: "after", runValidators: true },
	);
	res.json({ success: true, user });
});

export const changePassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const user = await User.findById(req.user._id).select("+password");

	if (!(await user.matchPassword(currentPassword))) {
		return res
			.status(400)
			.json({ success: false, message: "Current password is incorrect" });
	}

	user.password = newPassword;
	await user.save();
	res.json({ success: true, message: "Password changed successfully" });
});

export const saveProperty = asyncHandler(async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.propertyId)) {
		return res
			.status(400)
			.json({ success: false, message: "Invalid property ID" });
	}
	const user = await User.findById(req.user._id);
	const alreadySaved = user.savedProperties.includes(req.params.propertyId);

	if (alreadySaved) {
		user.savedProperties = user.savedProperties.filter(
			(id) => id.toString() !== req.params.propertyId,
		);
	} else {
		user.savedProperties.push(req.params.propertyId);
	}

	await user.save({ validateBeforeSave: false });
	res.json({
		success: true,
		saved: !alreadySaved,
		message: alreadySaved ? "Property unsaved" : "Property saved",
	});
});

export const getSavedProperties = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).populate({
		path: "savedProperties",
		select:
			"title price location images slug purpose type area bedrooms bathrooms",
	});
	res.json({ success: true, properties: user.savedProperties });
});

export const getAllUsers = asyncHandler(async (req, res) => {
	const { page = 1, limit = 20, role, keyword } = req.query;
	const query = role ? { role } : {};
	
	if (keyword) {
		query.$or = [
			{ name: new RegExp(keyword, "i") },
			{ email: new RegExp(keyword, "i") }
		];
	}

	const skip = (Number(page) - 1) * Number(limit);
	const [users, total] = await Promise.all([
		User.find(query)
			.select("-password")
			.skip(skip)
			.limit(Number(limit))
			.sort({ createdAt: -1 }),
		User.countDocuments(query),
	]);
	res.json({ success: true, total, users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ isActive: req.body.isActive },
		{ returnDocument: "after" },
	);
	res.json({ success: true, user });
});
export const updateUserAdmin = asyncHandler(async (req, res) => {
	const { role, isVerified, isOfficialAgent, isActive, city } = req.body;
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ role, isVerified, isOfficialAgent, isActive, city },
		{ returnDocument: "after", runValidators: true },
	);

	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "User not found" });
	}

	res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "User not found" });
	}

	await user.deleteOne();
	res.json({ success: true, message: "User removed" });
});
