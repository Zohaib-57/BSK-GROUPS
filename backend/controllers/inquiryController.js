import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";

export const createInquiry = asyncHandler(async (req, res) => {
	const { propertyId, name, email, phone, message, role } = req.body;

	let property = null;
	let agentId = null;
	let recipientEmail = process.env.ADMIN_EMAIL || "info@bskgroups.com";

	if (propertyId) {
		property = await Property.findById(propertyId).populate(
			"postedBy",
			"email name",
		);
		if (property) {
			agentId = property.postedBy._id;
			recipientEmail = property.postedBy.email;
			property.inquiries += 1;
			await property.save({ validateBeforeSave: false });
		}
	}

	const inquiry = await Inquiry.create({
		property: propertyId || null,
		sender: req.user?._id,
		agent: agentId,
		name,
		email,
		phone,
		message,
		role: role || "other",
	});

	// Notify recipient (Agent or Admin)
	try {
		await sendEmail({
			to: recipientEmail,
			subject: property 
				? `New Property Inquiry: ${property.title}` 
				: `New General Contact: ${name}`,
			html: `
				<h3>New Inquiry Received</h3>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Phone:</strong> ${phone}</p>
				<p><strong>Role:</strong> ${role || "Not specified"}</p>
				${property ? `<p><strong>Property:</strong> ${property.title}</p>` : ""}
				<p><strong>Message:</strong></p>
				<div style="padding: 15px; background: #f4f4f4; border-radius: 5px;">
					${message}
				</div>
			`,
		});

		// Also notify Admin if it was a property inquiry (as a backup)
		if (property && process.env.ADMIN_EMAIL && recipientEmail !== process.env.ADMIN_EMAIL) {
			await sendEmail({
				to: process.env.ADMIN_EMAIL,
				subject: `[ADMIN COPY] Property Inquiry: ${property.title}`,
				html: `<p>Admin copy of inquiry sent to agent ${property.postedBy.name}.</p><hr/>` + message
			});
		}
	} catch (e) {
		console.log("Email notification failed:", e.message);
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
