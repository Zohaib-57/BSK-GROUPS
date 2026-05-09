import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";

export const getBlogs = asyncHandler(async (req, res) => {
	const { page = 1, limit = 9, category, keyword } = req.query;
	const query = { isPublished: true };
	if (category) query.category = category;
	if (keyword)
		query.$or = [
			{ title: new RegExp(keyword, "i") },
			{ content: new RegExp(keyword, "i") },
		];

	const skip = (Number(page) - 1) * Number(limit);
	const [blogs, total] = await Promise.all([
		Blog.find(query)
			.populate("author", "name avatar")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(Number(limit))
			.lean(),
		Blog.countDocuments(query),
	]);
	res.json({ success: true, total, blogs });
});

export const getBlog = asyncHandler(async (req, res) => {
	const blog = await Blog.findOne({
		slug: req.params.slug,
		isPublished: true,
	}).populate("author", "name avatar");
	if (!blog)
		return res.status(404).json({ success: false, message: "Blog not found" });
	blog.views += 1;
	await blog.save({ validateBeforeSave: false });
	res.json({ success: true, blog });
});

export const getFeaturedBlogs = asyncHandler(async (req, res) => {
	const blogs = await Blog.find({ isFeatured: true, isPublished: true })
		.limit(4)
		.populate("author", "name avatar")
		.lean();
	res.json({ success: true, blogs });
});

export const createBlog = asyncHandler(async (req, res) => {
	req.body.author = req.user._id;
	const blog = await Blog.create(req.body);
	res.status(201).json({ success: true, blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
	const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
		returnDocument: "after",
	});
	res.json({ success: true, blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
	await Blog.findByIdAndDelete(req.params.id);
	res.json({ success: true, message: "Blog deleted" });
});
