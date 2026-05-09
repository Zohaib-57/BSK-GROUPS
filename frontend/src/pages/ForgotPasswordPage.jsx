import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";
import { Mail, CheckCircle, ArrowLeft, Send } from "lucide-react";
import styles from "./AuthPage.module.css";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await authAPI.forgotPassword(email);
			setSent(true);
			toast.success("Reset link sent to your email!");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to send reset email");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.authContainer}>
			<Helmet>
				<title>Forgot Password | BSK Groups</title>
			</Helmet>

			<div className={styles.card}>
				{sent ? (
					<div className="text-center">
						<div className={styles.successIcon}>
							<CheckCircle size={32} />
						</div>
						<h1 className={styles.title}>Email Sent</h1>
						<p className={styles.description}>
							We've sent a password reset link to <strong>{email}</strong>. 
							Please check your inbox and follow the instructions.
						</p>
						<Link to="/login" className={styles.submitBtn}>
							Back to Login
						</Link>
					</div>
				) : (
					<>
						<div className={styles.header}>
							<div className={styles.logoBox}>BSK</div>
							<h1 className={styles.title}>Recovery</h1>
							<p className={styles.subtitle}>Enter your email to receive a secure reset link.</p>
						</div>

						<form onSubmit={handleSubmit}>
							<div className={styles.formGroup}>
								<label className={styles.label}>Email Address</label>
								<input
									type="email"
									className={styles.input}
									placeholder="e.g. name@company.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoFocus
								/>
							</div>

							<button
								type="submit"
								className={styles.submitBtn}
								disabled={loading}
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Send size={18} /> Send Reset Link
									</>
								)}
							</button>

							<div className={styles.footer}>
								<Link to="/login" className={styles.link}>
									<ArrowLeft size={14} className="inline mr-1" /> Back to Login
								</Link>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
