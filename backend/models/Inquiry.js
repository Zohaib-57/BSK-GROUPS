import { Schema, model } from "mongoose";

const inquirySchema = new Schema(
	{
		property: {
			type: Schema.Types.ObjectId,
			ref: "Property",
		},
		sender: { type: Schema.Types.ObjectId, ref: "User" },
		agent: { type: Schema.Types.ObjectId, ref: "User" },
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		message: { type: String, required: true },
		role: {
			type: String,
			enum: ["buyer", "agent", "other"],
			default: "buyer",
		},
		status: {
			type: String,
			enum: ["new", "read", "replied", "closed"],
			default: "new",
		},
	},
	{ timestamps: true },
);

export default model("Inquiry", inquirySchema);
