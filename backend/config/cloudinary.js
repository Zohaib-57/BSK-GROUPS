import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Check if environment variables are loaded
const missingVars = [];
if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push("CLOUDINARY_CLOUD_NAME");
if (!process.env.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY");
if (!process.env.CLOUDINARY_API_SECRET) missingVars.push("CLOUDINARY_API_SECRET");

if (missingVars.length > 0) {
	console.error(`❌ Cloudinary configuration missing: ${missingVars.join(", ")}`);
	// We won't exit here immediately to see if loadEnv.js logs show anything useful
} else {
	// Configure Cloudinary
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	console.log('✅ Cloudinary configured successfully');
}

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "bsk-groups",
		allowed_formats: ["jpg", "jpeg", "png", "webp"],
		transformation: [{ width: 1200, height: 800, crop: "limit" }],
	},
});

// Configure Multer
export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"), false);
		}
	},
});

export { cloudinary };