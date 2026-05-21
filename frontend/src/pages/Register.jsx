import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Building2 } from "lucide-react";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	
	const [form, setForm] = useState({
		name: "",
		email: location.state?.email || "",
		phone: "",
		password: "",
		confirmPassword: "",
	});
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (location.state?.email) {
			setForm(prev => ({ ...prev, email: location.state.email }));
		}
	}, [location.state]);

	const validatePassword = (pass) => {
		return [
			{ id: 1, regex: /.{8,}/, text: "8+ characters" },
			{ id: 2, regex: /[A-Z]/, text: "Uppercase" },
			{ id: 3, regex: /[a-z]/, text: "Lowercase" },
			{ id: 4, regex: /[0-9]/, text: "Number" },
			{ id: 5, regex: /[^A-Za-z0-9]/, text: "Special char" },
		].map(req => ({
			...req,
			met: req.regex.test(pass)
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const results = validatePassword(form.password);
		const unmet = results.filter(r => !r.met);
		
		if (unmet.length > 0) {
			return toast.error("Password does not meet all requirements.");
		}

		if (form.password !== form.confirmPassword) {
			return toast.error("Passwords do not match");
		}
		
		setLoading(true);
		try {
			await register(form);
			toast.success("Account created successfully!");
			navigate(from, { replace: true });
		} catch (err) {
			toast.error(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<>
			<Helmet>
				<title>Join BSK Groups | Create Account</title>
			</Helmet>

			<div className={styles.page}>
				{/* Left panel — branding */}
				<div className={styles.panel}>
					<div className={styles.panelContent}>
						<div className={styles.panelLogo}>
							<Building2 size={32} />
						</div>
						<h2 className={styles.panelTitle}>Start Your Journey</h2>
						<p className={styles.panelSub}>
							Join Pakistan's premier real estate network and find your dream home in Peshawar & KPK.
						</p>

						<ul className={styles.panelList}>
							{[
								"Access exclusive property listings",
								"Direct connection with top agents",
								"Save and track your favorites",
								"Personalized property alerts",
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
							<h1 className={styles.cardTitle}>Create account</h1>
							<p className={styles.cardSub}>
								Fill in your details to get started
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className={styles.form} noValidate>
							{/* Full Name */}
							<div className={styles.field}>
								<label className={styles.label} htmlFor="name">
									Full Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									className={styles.input}
									placeholder="John Doe"
									value={form.name}
									onChange={handleChange}
									required
									autoFocus
								/>
							</div>

							<div className={styles.grid}>
								{/* Email */}
								<div className={styles.field}>
									<label className={styles.label} htmlFor="email">
										Email Address
									</label>
									<input
										id="email"
										name="email"
										type="email"
										className={styles.input}
										placeholder="you@example.com"
										value={form.email}
										onChange={handleChange}
										required
									/>
								</div>

								{/* Phone */}
								<div className={styles.field}>
									<label className={styles.label} htmlFor="phone">
										Phone Number
									</label>
									<input
										id="phone"
										name="phone"
										type="tel"
										className={styles.input}
										placeholder="03xx xxxxxxx"
										value={form.phone}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className={styles.grid}>
								{/* Password */}
								<div className={styles.field}>
									<label className={styles.label} htmlFor="password">
										Password
									</label>
									<div className={styles.passwordWrap}>
										<input
											id="password"
											name="password"
											type={showPass ? "text" : "password"}
											className={`${styles.input} ${styles.inputPad}`}
											placeholder="••••••••"
											value={form.password}
											onChange={handleChange}
											required
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
									<div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
										{validatePassword(form.password).map(req => (
											<div 
												key={req.id} 
												className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
													req.met ? "text-primary" : "text-gray-500"
												}`}
											>
												<div className={`w-1 h-1 rounded-full ${req.met ? "bg-primary" : "bg-gray-400"}`} />
												{req.text}
											</div>
										))}
									</div>
								</div>

								{/* Confirm Password */}
								<div className={styles.field}>
									<label className={styles.label} htmlFor="confirmPassword">
										Confirm Password
									</label>
									<div className={styles.passwordWrap}>
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPass ? "text" : "password"}
											className={`${styles.input} ${styles.inputPad}`}
											placeholder="••••••••"
											value={form.confirmPassword}
											onChange={handleChange}
											required
										/>
										<button
											type="button"
											className={styles.eyeBtn}
											onClick={() => setShowConfirmPass((v) => !v)}
											aria-label={showConfirmPass ? "Hide password" : "Show password"}
										>
											{showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
										</button>
									</div>
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
										Creating account…
									</>
								) : (
									<>
										<UserPlus size={17} />
										Register
									</>
								)}
							</button>
						</form>

						{/* Footer */}
						<p className={styles.footerText}>
							Already have an account?{" "}
							<Link to="/login" className={styles.footerLink}>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
