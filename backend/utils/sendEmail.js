import { createTransport } from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
	const transporter = createTransport({
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_PORT),
		secure: false,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		connectionTimeout: 5000,
		greetingTimeout: 5000,
		socketTimeout: 5000,
	});

	await transporter.sendMail({
		from: `"BSK Groups" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
	});
};

export default sendEmail;
