import User from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";

const { sign, verify } = jsonwebtoken;

const generateTokens = (id) => {
	const accessToken = sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || "7d",
	});
	const refreshToken = sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
	});
	return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
	const { name, email, phone, password } = req.body;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res
			.status(400)
			.json({ success: false, message: "Email already registered" });
	}

	const verificationToken = randomBytes(32).toString("hex");
	const user = await User.create({
		name,
		email,
		phone,
		password,
		verificationToken,
	});

	try {
		await sendEmail({
			to: email,
			subject: "Verify Your BSK Groups Account",
			html: `<p>Hello ${name},</p><p>Click below to verify your email:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}" style="background:#22c55e;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">Verify Email</a>`,
		});
	} catch (e) {
		console.log("Email send failed:", e.message);
	}

	const { accessToken, refreshToken } = generateTokens(user._id);
	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });

	res.status(201).json({
		success: true,
		message: "Registration successful. Please verify your email.",
		accessToken,
		refreshToken,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		},
	});
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "Please provide email and password" });
	}

	const user = await User.findOne({ email }).select("+password +refreshToken");
	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "No account found with this email. Please register first." });
	}

	if (!(await user.matchPassword(password))) {
		return res
			.status(401)
			.json({ success: false, message: "Invalid credentials. Please check your password." });
	}

	if (!user.isActive) {
		return res
			.status(401)
			.json({ success: false, message: "Account has been deactivated" });
	}

	const { accessToken, refreshToken } = generateTokens(user._id);
	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });

	res.json({
		success: true,
		accessToken,
		refreshToken,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
			phone: user.phone,
		},
	});
});

export const refreshToken = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res
			.status(401)
			.json({ success: false, message: "No refresh token" });
	}
	try {
		const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		const user = await User.findById(decoded.id).select("+refreshToken");
		if (!user || user.refreshToken !== refreshToken) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid refresh token" });
		}
		const { accessToken, refreshToken: newRefreshToken } = generateTokens(
			user._id,
		);
		user.refreshToken = newRefreshToken;
		await user.save({ validateBeforeSave: false });
		res.json({ success: true, accessToken, refreshToken: newRefreshToken });
	} catch {
		res.status(401).json({
			success: false,
			message: "Refresh token expired, please login again",
		});
	}
});

export const logout = asyncHandler(async (req, res) => {
	if (req.user) {
		await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
	}
	res.json({ success: true, message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).populate(
		"savedProperties",
		"title price location images slug",
	);
	res.json({ success: true, user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "No user found with this email" });
	}
	const resetToken = randomBytes(32).toString("hex");
	user.resetPasswordToken = createHash("sha256")
		.update(resetToken)
		.digest("hex");
	user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	await user.save({ validateBeforeSave: false });

	try {
		await sendEmail({
			to: user.email,
			subject: "BSK Groups - Password Reset",
			html: `<p>Reset your password by clicking below (valid 10 mins):</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>`,
		});
		res.json({ success: true, message: "Password reset email sent" });
	} catch {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		res
			.status(500)
			.json({ success: false, message: "Email could not be sent" });
	}
});

export const resetPassword = asyncHandler(async (req, res) => {
	const resetPasswordToken = createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});
	if (!user) {
		return res
			.status(400)
			.json({ success: false, message: "Invalid or expired reset token" });
	}
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();
	const { accessToken, refreshToken } = generateTokens(user._id);
	res.json({
		success: true,
		message: "Password reset successful",
		accessToken,
		refreshToken,
	});
});

export const verifyEmail = asyncHandler(async (req, res) => {
	const user = await User.findOne({ verificationToken: req.params.token });
	if (!user) {
		return res
			.status(400)
			.json({ success: false, message: "Invalid verification token" });
	}
	user.isVerified = true;
	user.verificationToken = undefined;
	await user.save({ validateBeforeSave: false });
	res.json({ success: true, message: "Email verified successfully" });
});
