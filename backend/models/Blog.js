import { Schema, model } from "mongoose";
import slugify from "slugify";

const blogSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, unique: true },
		content: { type: String, required: true },
		excerpt: { type: String },
		coverImage: { type: String },
		coverImagePublicId: { type: String },
		category: {
			type: String,
			enum: ["market-trends", "investment", "news", "guides", "lifestyle"],
			default: "news",
		},
		tags: [String],
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isPublished: { type: Boolean, default: false },
		views: { type: Number, default: 0 },
		isFeatured: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

blogSchema.pre("save", function (next) {
	if (this.isModified("title")) {
		this.slug =
			slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
	}
	if (!this.excerpt && this.content) {
		this.excerpt = this.content.substring(0, 200) + "...";
	}
	next();
});

export default model("Blog", blogSchema);
