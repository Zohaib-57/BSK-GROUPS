import { createTransport } from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
	const transporter = createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	try {
		console.log(`Attempting to send email to: ${to}...`);
		const info = await transporter.sendMail({
			from: `"BSK Groups" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html,
		});
		console.log("Email sent successfully:", info.messageId);
	} catch (error) {
		console.error("Nodemailer Error Details:", error);
		throw error;
	}
};

export default sendEmail;
