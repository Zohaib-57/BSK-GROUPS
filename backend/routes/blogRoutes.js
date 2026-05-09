import { Router } from "express";
const router = Router();
import {
	getBlogs,
	getBlog,
	getFeaturedBlogs,
	createBlog,
	updateBlog,
	deleteBlog,
} from "../controllers/blogController.js";
import { protect, authorize } from "../middleware/auth.js";

router.get("/", getBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/:slug", getBlog);
router.post("/", protect, authorize("admin", "agent"), createBlog);
router.put("/:id", protect, authorize("admin", "agent"), updateBlog);
router.delete("/:id", protect, authorize("admin"), deleteBlog);

export default router;
