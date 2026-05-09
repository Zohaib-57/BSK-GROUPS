import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send, ShieldCheck, User, Headphones, Laptop } from "lucide-react";
import { inquiryAPI } from "../utils/api";
import toast from "react-hot-toast";
import styles from "./ContactPage.module.css";

const OFFICE_DIRECTORY = [
	{
		name: "Arsalan Khan",
		role: "Chief Executive Officer",
		email: "arsalan.ceo@bskgroups.com",
		icon: <ShieldCheck size={20} />
	},
	{
		name: "Zainab Ahmed",
		role: "Office Manager",
		email: "zainab.manager@bskgroups.com",
		icon: <User size={20} />
	},
	{
		name: "IT Support Team",
		role: "Technical Specialist",
		email: "tech.support@bskgroups.com",
		icon: <Laptop size={20} />
	},
	{
		name: "General Inquiries",
		role: "Customer Operations",
		email: "info@bskgroups.com",
		icon: <Headphones size={20} />
	}
];

export default function ContactPage() {
	const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await inquiryAPI.create({
				...form,
				message: `[${form.subject}] ${form.message}`
			});
			toast.success("Message sent! We will contact you soon.");
			setForm({ name: "", email: "", subject: "", message: "" });
		} catch (err) {
			toast.error("Failed to send message. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Contact Us | BSK Groups - Corporate Directory</title>
			</Helmet>

			<div className={styles.pageContainer}>
				{/* Hero Banner */}
				<section className={styles.hero}>
					<div className={styles.container}>
						<span className={styles.heroSubtitle}>Get in Touch</span>
						<h1 className={styles.heroTitle}>Corporate Directory & Support</h1>
					</div>
				</section>

				<div className={styles.container}>
					<div className={styles.contactGrid}>
						{/* Office Directory */}
						<section className={styles.directorySection}>
							<h2 className={styles.directoryTitle}>
								<span /> Office Leadership
							</h2>
							<div className={styles.workerList}>
								{OFFICE_DIRECTORY.map((worker, index) => (
									<div key={index} className={styles.workerCard}>
										<div className={styles.workerIcon}>{worker.icon}</div>
										<div className={styles.workerInfo}>
											<span className={styles.workerRole}>{worker.role}</span>
											<h3 className={styles.workerName}>{worker.name}</h3>
											<a href={`mailto:${worker.email}`} className={styles.workerEmail}>
												{worker.email}
											</a>
										</div>
									</div>
								))}
							</div>
						</section>

						{/* Contact Form */}
						<section className={styles.formSection}>
							<h2 className={styles.directoryTitle}>
								<span /> Direct Inquiry
							</h2>
							<form onSubmit={handleSubmit} className={styles.formGrid}>
								<div className={styles.inputGroup}>
									<label className={styles.label}>Full Name</label>
									<input 
										type="text" 
										placeholder="John Doe" 
										className={styles.input} 
										value={form.name}
										onChange={(e) => setForm({...form, name: e.target.value})}
										required 
									/>
								</div>
								<div className={styles.inputGroup}>
									<label className={styles.label}>Email Address</label>
									<input 
										type="email" 
										placeholder="john@example.com" 
										className={styles.input} 
										value={form.email}
										onChange={(e) => setForm({...form, email: e.target.value})}
										required 
									/>
								</div>
								<div className={`${styles.inputGroup} col-span-full`}>
									<label className={styles.label}>Subject</label>
									<input 
										type="text" 
										placeholder="Property Inquiry" 
										className={styles.input} 
										value={form.subject}
										onChange={(e) => setForm({...form, subject: e.target.value})}
										required 
									/>
								</div>
								<div className={`${styles.inputGroup} col-span-full`}>
									<label className={styles.label}>Message</label>
									<textarea 
										placeholder="How can we help you?" 
										className={styles.textarea} 
										value={form.message}
										onChange={(e) => setForm({...form, message: e.target.value})}
										required 
									/>
								</div>
								<button type="submit" disabled={loading} className={styles.submitButton}>
									<Send size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
									{loading ? "Sending..." : "Send Message"}
								</button>
							</form>
						</section>
					</div>

					{/* Bottom Office Info */}
					<div className={styles.officeGrid}>
						<div className={styles.infoCard}>
							<div className={styles.infoIcon}><MapPin size={24} /></div>
							<h3 className={styles.infoTitle}>Main Office</h3>
							<p className={styles.infoText}>
								Phase 7, DHA Peshawar,<br />
								Khyber Pakhtunkhwa, Pakistan
							</p>
						</div>
						<div className={styles.infoCard}>
							<div className={styles.infoIcon}><Phone size={24} /></div>
							<h3 className={styles.infoTitle}>Direct Hotline</h3>
							<p className={styles.infoText}>
								+92 91 123 4567<br />
								Mon - Sat, 9am - 6pm
							</p>
						</div>
						<div className={styles.infoCard}>
							<div className={styles.infoIcon}><Mail size={24} /></div>
							<h3 className={styles.infoTitle}>Official Support</h3>
							<p className={styles.infoText}>
								support@bskgroups.com<br />
								24/7 Online Assistance
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
