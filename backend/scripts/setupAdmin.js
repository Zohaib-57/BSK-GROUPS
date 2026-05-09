import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const promoteToAdmin = async (email) => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to database...");

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			console.error(`User with email ${email} not found.`);
			process.exit(1);
		}

		user.role = "admin";
		await user.save();

		console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
		process.exit(0);
	} catch (error) {
		console.error("Error promoting user:", error);
		process.exit(1);
	}
};

const email = process.argv[2];

if (!email) {
	console.log("Please provide an email address: node scripts/setupAdmin.js your-email@example.com");
	process.exit(1);
}

promoteToAdmin(email);
