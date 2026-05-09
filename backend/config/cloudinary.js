import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Configure Cloudinary v2
const missingVars = [];
if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push("CLOUDINARY_CLOUD_NAME");
if (!process.env.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY");
if (!process.env.CLOUDINARY_API_SECRET) missingVars.push("CLOUDINARY_API_SECRET");

if (missingVars.length > 0) {
	console.error(`❌ Cloudinary configuration missing: ${missingVars.join(", ")}`);
} else {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	console.log("✅ Cloudinary configured successfully");
}

// Use memory storage (works with cloudinary v2 natively)
export const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"), false);
		}
	},
});

// Upload a buffer directly to Cloudinary v2
export const uploadToCloudinary = (buffer) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: "bsk-groups",
				transformation: [{ width: 1200, height: 800, crop: "limit" }],
				allowed_formats: ["jpg", "jpeg", "png", "webp"],
			},
			(error, result) => {
				if (error) return reject(error);
				resolve(result);
			}
		);
		const readable = new Readable();
		readable.push(buffer);
		readable.push(null);
		readable.pipe(stream);
	});
};

export { cloudinary };