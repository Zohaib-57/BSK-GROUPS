import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

const { verify } = jsonwebtoken;

export const protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Not authorized, no token" });
	}
	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select("-password");
		if (!req.user) {
			return res
				.status(401)
				.json({ success: false, message: "User not found" });
		}
		if (!req.user.isActive) {
			return res
				.status(401)
				.json({ success: false, message: "Account deactivated" });
		}
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Token invalid or expired" });
	}
};

export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `Role '${req.user.role}' is not authorized for this route`,
			});
		}
		next();
	};
};

export const optionalAuth = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (token) {
		try {
			const decoded = verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
		} catch {}
	}
	next();
};
