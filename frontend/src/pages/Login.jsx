import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, Building2 } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const [form, setForm] = useState({ email: "", password: "" });
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const data = await login(form);
			toast.success(`Welcome back, ${data.user.name}!`);
			navigate(data.user.role === "admin" ? "/admin" : from, { replace: true });
		} catch (err) {
			const message = err.response?.data?.message || "Invalid credentials";
			toast.error(message);
			
			// If user doesn't exist, redirect to register
			if (err.response?.status === 404) {
				setTimeout(() => {
					navigate("/register", { state: { email: form.email } });
				}, 1500);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Login | BSK Groups</title>
			</Helmet>

			<div className={styles.page}>
				{/* Left panel — branding */}
				<div className={styles.panel}>
					<div className={styles.panelContent}>
						<div className={styles.panelLogo}>
							<Building2 size={32} />
						</div>
						<h2 className={styles.panelTitle}>BSK Groups</h2>
						<p className={styles.panelSub}>
							Pakistan's most trusted real estate portal in Peshawar & KPK
						</p>

						<ul className={styles.panelList}>
							{[
								"500+ verified property listings",
								"Trusted by 200+ happy clients",
								"50+ professional agents",
								"10+ years of experience",
							].map((item) => (
								<li key={item} className={styles.panelListItem}>
									<span className={styles.panelDot} />
									{item}
								</li>
							))}
						</ul>
					</div>

					{/* Decorative circles */}
					<div className={styles.circle1} aria-hidden="true" />
					<div className={styles.circle2} aria-hidden="true" />
				</div>

				{/* Right panel — form */}
				<div className={styles.formSide}>
					<div className={styles.card}>
						{/* Header */}
						<div className={styles.cardHeader}>
							<div className={styles.mobileLogo}>
								<Building2 size={22} />
							</div>
							<h1 className={styles.cardTitle}>Welcome back</h1>
							<p className={styles.cardSub}>
								Sign in to your BSK Groups account
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className={styles.form} noValidate>
							{/* Email */}
							<div className={styles.field}>
								<label className={styles.label} htmlFor="email">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									className={styles.input}
									placeholder="you@example.com"
									value={form.email}
									onChange={(e) =>
										setForm((p) => ({ ...p, email: e.target.value }))
									}
									required
									autoFocus
									autoComplete="email"
								/>
							</div>

							{/* Password */}
							<div className={styles.field}>
								<div className={styles.labelRow}>
									<label className={styles.label} htmlFor="password">
										Password
									</label>
									<Link to="/forgot-password" className={styles.forgot}>
										Forgot password?
									</Link>
								</div>
								<div className={styles.passwordWrap}>
									<input
										id="password"
										type={showPass ? "text" : "password"}
										className={`${styles.input} ${styles.inputPad}`}
										placeholder="••••••••"
										value={form.password}
										onChange={(e) =>
											setForm((p) => ({ ...p, password: e.target.value }))
										}
										required
										autoComplete="current-password"
									/>
									<button
										type="button"
										className={styles.eyeBtn}
										onClick={() => setShowPass((v) => !v)}
										aria-label={showPass ? "Hide password" : "Show password"}
									>
										{showPass ? <EyeOff size={17} /> : <Eye size={17} />}
									</button>
								</div>
							</div>

							{/* Submit */}
							<button
								type="submit"
								className={styles.submitBtn}
								disabled={loading}
							>
								{loading ? (
									<>
										<span className={styles.spinner} />
										Signing in…
									</>
								) : (
									<>
										<LogIn size={17} />
										Sign In
									</>
								)}
							</button>
						</form>

						{/* Footer */}
						<p className={styles.footerText}>
							Don't have an account?{" "}
							<Link to="/register" className={styles.footerLink}>
								Create one
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
