import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, XCircle, Mail, ArrowRight, Loader2 } from "lucide-react";
import { authAPI } from "../utils/api";
import styles from "./VerifyEmailPage.module.css";

export default function VerifyEmailPage() {
	const { token } = useParams();
	const [status, setStatus] = useState("loading"); // loading, success, error
	const [message, setMessage] = useState("");
	const hasEffectRun = useRef(false);

	useEffect(() => {
		if (hasEffectRun.current) return;
		hasEffectRun.current = true;

		const verify = async () => {
			try {
				const { data } = await authAPI.verifyEmail(token);
				setStatus("success");
				setMessage(data.message || "Your account has been successfully verified.");
			} catch (err) {
				setStatus("error");
				setMessage(
					err.response?.data?.message || 
					"The verification link is invalid or has already expired."
				);
			}
		};

		if (token) {
			verify();
		} else {
			setStatus("error");
			setMessage("Invalid verification request. No token provided.");
		}
	}, [token]);

	return (
		<div className={styles.verifyContainer}>
			<Helmet>
				<title>Verify Your Email | BSK Groups</title>
			</Helmet>

			<div className={styles.card}>
				{/* Loading State */}
				{status === "loading" && (
					<>
						<div className={`${styles.iconWrapper} ${styles.iconLoading}`}>
							<div className={styles.spinner} />
						</div>
						<h1 className={styles.title}>Securing Account</h1>
						<p className={styles.description}>
							We are currently authenticating your email address. This will only take a moment.
						</p>
					</>
				)}

				{/* Success State */}
				{status === "success" && (
					<>
						<div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
							<CheckCircle size={48} />
						</div>
						<h1 className={styles.title}>Email Verified</h1>
						<p className={styles.description}>{message}</p>
						<Link to="/login" className={`${styles.button} ${styles.buttonPrimary}`}>
							Proceed to Login <ArrowRight size={18} />
						</Link>
					</>
				)}

				{/* Error State */}
				{status === "error" && (
					<>
						<div className={`${styles.iconWrapper} ${styles.iconError}`}>
							<XCircle size={48} />
						</div>
						<h1 className={styles.title}>Verification Failed</h1>
						<p className={styles.description}>{message}</p>
						<div className="space-y-3">
							<Link to="/login" className={styles.button}>
								Back to Login
							</Link>
							<Link to="/contact" className="block text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
								Need Help? Contact Support
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
