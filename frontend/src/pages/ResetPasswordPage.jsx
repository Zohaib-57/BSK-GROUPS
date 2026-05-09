import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";
import { KeyRound, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import styles from "./AuthPage.module.css";

export default function ResetPasswordPage() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [form, setForm] = useState({ password: "", confirmPassword: "" });
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (form.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setLoading(true);
		try {
			await authAPI.resetPassword(token, form.password);
			setSuccess(true);
			toast.success("Password reset successfully!");
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Reset link is invalid or expired"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.authContainer}>
			<Helmet>
				<title>Reset Password | BSK Groups</title>
			</Helmet>

			<div className={styles.card}>
				{success ? (
					<div className="text-center">
						<div className={styles.successIcon}>
							<CheckCircle size={32} />
						</div>
						<h1 className={styles.title}>Securely Reset</h1>
						<p className={styles.description}>
							Your password has been successfully updated. You can now use your new credentials to access your account.
						</p>
						<Link to="/login" className={styles.submitBtn}>
							Log In to Your Account
						</Link>
					</div>
				) : (
					<>
						<div className={styles.header}>
							<div className={styles.logoBox}>BSK</div>
							<h1 className={styles.title}>New Password</h1>
							<p className={styles.subtitle}>Define a strong password to secure your account access.</p>
						</div>

						<form onSubmit={handleSubmit}>
							<div className={styles.formGroup}>
								<label className={styles.label}>New Password</label>
								<div className="relative">
									<input
										type={showPass ? "text" : "password"}
										className={styles.input}
										placeholder="Min. 6 characters"
										value={form.password}
										onChange={(e) =>
											setForm((p) => ({ ...p, password: e.target.value }))
										}
										required
									/>
									<button
										type="button"
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
										onClick={() => setShowPass(!showPass)}
									>
										{showPass ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label className={styles.label}>Confirm New Password</label>
								<div className="relative">
									<input
										type={showConfirmPass ? "text" : "password"}
										className={styles.input}
										placeholder="Repeat password"
										value={form.confirmPassword}
										onChange={(e) =>
											setForm((p) => ({ ...p, confirmPassword: e.target.value }))
										}
										required
									/>
									<button
										type="button"
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
										onClick={() => setShowConfirmPass(!showConfirmPass)}
									>
										{showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<button
								type="submit"
								className={styles.submitBtn}
								disabled={loading}
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Resetting...
									</>
								) : (
									<>
										<Lock size={18} /> Update Password
									</>
								)}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
