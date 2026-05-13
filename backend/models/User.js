import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";

const userSchema = new Schema(
	{
		name: { type: String, required: [true, "Name is required"], trim: true },
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: { type: String, trim: true },
		city: { type: String, default: "Peshawar" },
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: 6,
			select: false,
		},
		role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
		avatar: { type: String, default: "" },
		savedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
		isVerified: { type: Boolean, default: false },
		verificationToken: String,
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		refreshToken: { type: String, select: false },
		isActive: { type: Boolean, default: true },
		isOfficialAgent: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await genSalt(12);
	this.password = await hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await compare(enteredPassword, this.password);
};

export default model("User", userSchema);
