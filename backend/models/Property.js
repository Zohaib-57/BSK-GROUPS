import { Schema, model } from "mongoose";
import slugify from "slugify";

const propertySchema = new Schema(
	{
		title: { type: String, required: [true, "Title is required"], trim: true },
		slug: { type: String, unique: true },
		description: { type: String, required: [true, "Description is required"] },
		price: { type: Number, required: [true, "Price is required"] },
		priceType: {
			type: String,
			enum: ["fixed", "negotiable", "per_month", "per_year"],
			default: "fixed",
		},
		currency: { type: String, default: "PKR" },

		type: {
			type: String,
			required: true,
			enum: [
				"house",
				"apartment",
				"plot",
				"commercial",
				"villa",
				"farmhouse",
				"room",
				"office",
				"shop",
				"warehouse",
			],
		},
		purpose: { type: String, required: true, enum: ["sale", "rent", "lease"] },
		status: {
			type: String,
			enum: ["available", "sold", "rented", "pending"],
			default: "available",
		},

		area: {
			value: { type: Number, required: true },
			unit: {
				type: String,
				enum: ["marla", "kanal", "sqft", "sqm", "sqyd"],
				default: "marla",
			},
		},

		bedrooms: { type: Number, default: 0 },
		bathrooms: { type: Number, default: 0 },
		floors: { type: Number, default: 1 },
		kitchens: { type: Number, default: 0 },
		garages: { type: Number, default: 0 },
		garageCapacity: { type: Number, default: 0 },

		location: {
			address: { type: String, required: true },
			city: { type: String, required: true, default: "Peshawar" },
			area: { type: String },
			society: { type: String },
			province: { type: String, default: "Khyber Pakhtunkhwa" },
			country: { type: String, default: "Pakistan" },
			coordinates: {
				lat: { type: Number },
				lng: { type: Number },
			},
		},

		images: [
			{
				url: String,
				publicId: String,
				isMain: { type: Boolean, default: false },
			},
		],

		features: {
			mainRoads: Boolean,
			electricityBackup: Boolean,
			centralAc: Boolean,
			security: Boolean,
			gym: Boolean,
			swimmingPool: Boolean,
			garden: Boolean,
			mosque: Boolean,
			community: Boolean,
			doubleGlazedWindows: Boolean,
			sewerage: Boolean,
			cornerPlot: Boolean,
			facingPark: Boolean,
			boundaryWall: Boolean,
			servantQuarters: Boolean,
			laundryRoom: Boolean,
			storeRoom: Boolean,
		},

		agent: { type: Schema.Types.ObjectId, ref: "User" },
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		isFeatured: { type: Boolean, default: false },
		isPremium: { type: Boolean, default: false },
		isVerified: { type: Boolean, default: false },
		isApproved: { type: Boolean, default: true },

		views: { type: Number, default: 0 },
		inquiries: { type: Number, default: 0 },

		expiresAt: { type: Date },
	},
	{ timestamps: true },
);

propertySchema.pre("save", async function () {
	if (this.isModified("title") || !this.slug) {
		this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
	}
});

propertySchema.index({ "location.city": 1, type: 1, purpose: 1, price: 1 });
propertySchema.index({ isFeatured: 1, isPremium: 1 });

export default model("Property", propertySchema);
