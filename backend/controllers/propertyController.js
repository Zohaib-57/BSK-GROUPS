import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";
import asyncHandler from "express-async-handler";

export const getAgentStats = asyncHandler(async (req, res) => {
	const [
		totalProperties,
		approvedProperties,
		pendingProperties,
		totalInquiries,
		newInquiries
	] = await Promise.all([
		Property.countDocuments({ postedBy: req.user._id }),
		Property.countDocuments({ postedBy: req.user._id, isApproved: true }),
		Property.countDocuments({ postedBy: req.user._id, isApproved: false }),
		Inquiry.countDocuments({ agent: req.user._id }),
		Inquiry.countDocuments({ agent: req.user._id, status: "new" })
	]);

	res.json({
		success: true,
		stats: {
			totalProperties,
			approvedProperties,
			pendingProperties,
			totalInquiries,
			newInquiries
		}
	});
});

export const getProperties = asyncHandler(async (req, res) => {
	const {
		purpose,
		type,
		city,
		area,
		society,
		minPrice,
		maxPrice,
		minArea,
		maxArea,
		areaUnit,
		bedrooms,
		bathrooms,
		isFeatured,
		isPremium,
		isVerified,
		sort,
		page = 1,
		limit = 12,
		keyword,
	} = req.query;

	const query = { isApproved: true, status: "available" };

	if (purpose) query.purpose = purpose;
	if (type) query.type = type;
	if (city) query["location.city"] = new RegExp(city, "i");
	if (area) query["location.area"] = new RegExp(area, "i");
	if (society) query["location.society"] = new RegExp(society, "i");

	if (minPrice || maxPrice) {
		query.price = {};
		if (minPrice) query.price.$gte = Number(minPrice);
		if (maxPrice) query.price.$lte = Number(maxPrice);
	}

	if (minArea || maxArea) {
		query["area.value"] = {};
		if (minArea) query["area.value"].$gte = Number(minArea);
		if (maxArea) query["area.value"].$lte = Number(maxArea);
	}
	if (areaUnit) query["area.unit"] = areaUnit;

	if (bedrooms) query.bedrooms = Number(bedrooms);
	if (bathrooms) query.bathrooms = Number(bathrooms);
	if (isFeatured === "true") query.isFeatured = true;
	if (isPremium === "true") query.isPremium = true;
	if (isVerified === "true") query.isVerified = true;

	if (keyword) {
		const keywords = keyword.split(" ").filter((k) => k.length > 0);
		const keywordQuery = keywords.map((k) => ({
			$or: [
				{ title: new RegExp(k, "i") },
				{ description: new RegExp(k, "i") },
				{ "location.address": new RegExp(k, "i") },
				{ "location.society": new RegExp(k, "i") },
				{ "location.city": new RegExp(k, "i") },
				{ "location.area": new RegExp(k, "i") },
				{ type: new RegExp(k, "i") },
			],
		}));
		query.$and = query.$and ? [...query.$and, ...keywordQuery] : keywordQuery;
	}

	const sortOptions = {
		newest: { createdAt: -1 },
		oldest: { createdAt: 1 },
		"price-low": { price: 1 },
		"price-high": { price: -1 },
		popular: { views: -1 },
	};

	const sortBy = sortOptions[sort] || { createdAt: -1 };
	const skip = (Number(page) - 1) * Number(limit);

	const [properties, total] = await Promise.all([
		Property.find(query)
			.sort(sortBy)
			.skip(skip)
			.limit(Number(limit))
			.populate("postedBy", "name phone avatar")
			.lean(),
		Property.countDocuments(query),
	]);

	res.json({
		success: true,
		total,
		page: Number(page),
		pages: Math.ceil(total / Number(limit)),
		properties,
	});
});

export const getFeaturedProperties = asyncHandler(async (req, res) => {
	const properties = await Property.find({
		isFeatured: true,
		isApproved: true,
		status: "available",
	})
		.limit(8)
		.populate("postedBy", "name phone avatar")
		.lean();
	res.json({ success: true, properties });
});

export const getProperty = asyncHandler(async (req, res) => {
	const property = await Property.findOne({ slug: req.params.slug })
		.populate("postedBy", "name phone email avatar")
		.populate("agent", "name phone email avatar");

	if (!property) {
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });
	}

	property.views += 1;
	await property.save({ validateBeforeSave: false });

	const similar = await Property.find({
		type: property.type,
		purpose: property.purpose,
		"location.city": property.location.city,
		_id: { $ne: property._id },
		isApproved: true,
	})
		.limit(4)
		.lean();

	res.json({ success: true, property, similar });
});

export const getPropertyById = asyncHandler(async (req, res) => {
	const property = await Property.findById(req.params.id)
		.populate("postedBy", "name phone email avatar")
		.populate("agent", "name phone email avatar");

	if (!property) {
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });
	}

	res.json({ success: true, property });
});

export const createProperty = asyncHandler(async (req, res) => {
	req.body.postedBy = req.user._id;
	req.body.isApproved = true;

	const property = await Property.create(req.body);
	res.status(201).json({ success: true, property });
});

export const updateProperty = asyncHandler(async (req, res) => {
	let property = await Property.findById(req.params.id);
	if (!property)
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });

	if (
		property.postedBy.toString() !== req.user._id.toString() &&
		req.user.role !== "admin"
	) {
		return res.status(403).json({ success: false, message: "Not authorized" });
	}

	property = await Property.findByIdAndUpdate(req.params.id, req.body, {
		returnDocument: "after",
		runValidators: true,
	});
	res.json({ success: true, property });
});

export const deleteProperty = asyncHandler(async (req, res) => {
	const property = await Property.findById(req.params.id);
	if (!property)
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });

	if (
		property.postedBy.toString() !== req.user._id.toString() &&
		req.user.role !== "admin"
	) {
		return res.status(403).json({ success: false, message: "Not authorized" });
	}

	await property.deleteOne();
	res.json({ success: true, message: "Property removed" });
});

export const getMyProperties = asyncHandler(async (req, res) => {
	const properties = await Property.find({ postedBy: req.user._id }).sort({
		createdAt: -1,
	});
	res.json({ success: true, properties });
});

export const approveProperty = asyncHandler(async (req, res) => {
	const property = await Property.findByIdAndUpdate(
		req.params.id,
		{ isApproved: req.body.isApproved },
		{ returnDocument: "after" },
	);
	res.json({ success: true, property });
});
