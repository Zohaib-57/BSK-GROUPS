import { Router } from "express";
const router = Router();
import { upload, cloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import { protect } from "../middleware/auth.js";
import asyncHandler from "express-async-handler";

// @route POST /api/upload/images
router.post(
	"/images",
	protect,
	upload.array("images", 10),
	asyncHandler(async (req, res) => {
		if (!req.files || req.files.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "No files uploaded" });
		}
		const uploadPromises = req.files.map((file) =>
			uploadToCloudinary(file.buffer)
		);
		const results = await Promise.all(uploadPromises);
		const images = results.map((result) => ({
			url: result.secure_url,
			publicId: result.public_id,
		}));
		res.json({ success: true, images });
	}),
);

// @route DELETE /api/upload/:publicId
router.delete(
	"/:publicId",
	protect,
	asyncHandler(async (req, res) => {
		await cloudinary.uploader.destroy(req.params.publicId);
		res.json({ success: true, message: "Image deleted" });
	}),
);

export default router;
