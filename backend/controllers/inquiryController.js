import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";

export const createInquiry = asyncHandler(async (req, res) => {
	const { propertyId, name, email, phone, message } = req.body;

	const property = await Property.findById(propertyId).populate(
		"postedBy",
		"email name",
	);
	if (!property)
		return res
			.status(404)
			.json({ success: false, message: "Property not found" });

	const inquiry = await Inquiry.create({
		property: propertyId,
		sender: req.user?._id,
		agent: property.postedBy._id,
		name,
		email,
		phone,
		message,
	});

	property.inquiries += 1;
	await property.save({ validateBeforeSave: false });

	try {
		await sendEmail({
			to: property.postedBy.email,
			subject: `New Inquiry for: ${property.title}`,
			html: `<p><strong>${name}</strong> is interested in your property <strong>${property.title}</strong>.</p>
        <p>Message: ${message}</p><p>Contact: ${email} | ${phone}</p>`,
		});
	} catch (e) {
		console.log("Email error:", e.message);
	}

	res
		.status(201)
		.json({ success: true, message: "Inquiry sent successfully", inquiry });
});

export const getMyInquiries = asyncHandler(async (req, res) => {
	const inquiries = await Inquiry.find({ agent: req.user._id })
		.populate("property", "title slug images")
		.sort({ createdAt: -1 });
	res.json({ success: true, inquiries });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
	const inquiry = await Inquiry.findByIdAndUpdate(
		req.params.id,
		{ status: req.body.status },
		{ returnDocument: "after" },
	);
	res.json({ success: true, inquiry });
});

export const getAllInquiries = asyncHandler(async (req, res) => {
	const inquiries = await Inquiry.find()
		.populate("property", "title")
		.populate("agent", "name email")
		.sort({ createdAt: -1 });
	res.json({ success: true, inquiries });
});
