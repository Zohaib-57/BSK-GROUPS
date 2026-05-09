import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { userAPI, uploadAPI } from "../utils/api";
import toast from "react-hot-toast";
import { User, Lock, Save, Mail, Phone, Upload, X } from "lucide-react";
import styles from "./UserDashboard.module.css";

export default function ProfilePage() {
	const { user, updateUser } = useAuth();
	const [tab, setTab] = useState("profile");
	const [form, setForm] = useState({
		name: user?.name || "",
		phone: user?.phone || "",
		avatar: user?.avatar || "",
	});
	const [passForm, setPassForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validation
		if (file.size > 2 * 1024 * 1024) {
			return toast.error("Image must be less than 2MB");
		}
		if (!file.type.startsWith("image/")) {
			return toast.error("Please upload an image file");
		}

		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		
		try {
			let avatarUrl = form.avatar;

			// If a new file is selected, upload it first
			if (selectedFile) {
				const formData = new FormData();
				formData.append("images", selectedFile);
				
				const uploadRes = await uploadAPI.uploadImages(formData);
				avatarUrl = uploadRes.data.images[0].url;
			}

			const { data } = await userAPI.updateProfile({ ...form, avatar: avatarUrl });
			updateUser(data.user);
			setForm(p => ({ ...p, avatar: avatarUrl }));
			setSelectedFile(null);
			toast.success("Profile updated successfully!");
		} catch (err) {
			console.error("Profile update error:", err);
			const message = err.response?.data?.message || err.message || "Update failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		if (passForm.newPassword !== passForm.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		setLoading(true);
		try {
			await userAPI.changePassword({
				currentPassword: passForm.currentPassword,
				newPassword: passForm.newPassword,
			});
			toast.success("Password changed successfully!");
			setPassForm({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to change password");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className={styles.animateFade}>
			<Helmet>
				<title>My Profile | BSK Groups</title>
			</Helmet>

			<div className={styles.container}>
				<div className={styles.profileLayout}>
					{/* Header */}
					<header className={styles.header} style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '8px' }}>
						<h1 className={styles.title}>Account Settings</h1>
						<p className={styles.subtitle}>Manage your personal information and security preferences.</p>
					</header>

					{/* Tabs */}
					<div className={styles.tabs}>
						<button
							className={`${styles.tabBtn} ${tab === "profile" ? styles.tabActive : ""}`}
							onClick={() => setTab("profile")}
						>
							<User size={18} /> Profile Info
						</button>
						<button
							className={`${styles.tabBtn} ${tab === "password" ? styles.tabActive : ""}`}
							onClick={() => setTab("password")}
						>
							<Lock size={18} /> Security
						</button>
					</div>

					{/* Form Card */}
					<div className={styles.section} style={{ padding: '40px' }}>
						{tab === "profile" ? (
							<form onSubmit={handleProfileUpdate}>
								{/* Avatar Header */}
								<div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '32px', borderBottom: `1px solid var(--ud-border)` }}>
									<div style={{ position: 'relative' }}>
										<div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--ud-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', overflow: 'hidden', border: '4px solid var(--ud-bg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
											{previewUrl ? (
												<img loading="lazy" src={previewUrl} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
											) : (
												<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{user?.name?.[0]?.toUpperCase()}</div>
											)}
										</div>
										<label 
											htmlFor="avatar-upload" 
											style={{ position: 'absolute', bottom: '0', right: '0', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ud-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s' }}
											onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
											onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
										>
											<Upload size={16} />
											<input 
												id="avatar-upload"
												type="file" 
												hidden 
												accept="image/*"
												onChange={handleFileChange}
											/>
										</label>
									</div>
									<div>
										<h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ud-text)', margin: '0 0 4px' }}>{user?.name}</h2>
										<p style={{ fontSize: '14px', color: 'var(--ud-text-muted)', margin: '0 0 12px' }}>{user?.email}</p>
										<div style={{ display: 'flex', gap: '8px' }}>
											<span className={styles.badge} style={{ background: 'var(--ud-brand-light)', color: 'var(--ud-brand)' }}>{user?.role}</span>
											{selectedFile && (
												<button 
													type="button"
													onClick={() => { setSelectedFile(null); setPreviewUrl(user?.avatar || ""); }}
													style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
												>
													<X size={12} /> Reset Image
												</button>
											)}
										</div>
									</div>
								</div>

								<div className={styles.formGrid}>
									<div className={styles.field}>
										<label className={styles.label}><User size={12} style={{ marginRight: '4px' }} /> Full Name</label>
										<input
											name="name"
											className={styles.input}
											value={form.name}
											onChange={handleChange}
											placeholder="Your name"
											required
										/>
									</div>
									<div className={styles.field}>
										<label className={styles.label}><Phone size={12} style={{ marginRight: '4px' }} /> Phone Number</label>
										<input
											name="phone"
											className={styles.input}
											value={form.phone}
											onChange={handleChange}
											placeholder="03xx xxxxxxx"
											required
										/>
									</div>
									<div className={`${styles.field} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
										<label className={styles.label}><Mail size={12} style={{ marginRight: '4px' }} /> Email Address</label>
										<input
											className={`${styles.input} ${styles.inputDisabled}`}
											value={user?.email}
											disabled
										/>
										<p style={{ fontSize: '12px', color: 'var(--ud-text-muted)', marginTop: '4px' }}>Email address cannot be changed for security reasons.</p>
									</div>
								</div>

								<div style={{ marginTop: '40px' }}>
									<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
										{loading ? <div className={styles.spinner} /> : <Save size={18} />}
										<span>Save Profile Changes</span>
									</button>
								</div>
							</form>
						) : (
							<form onSubmit={handlePasswordChange}>
								<div style={{ maxWidth: '480px' }}>
									<div className={styles.field} style={{ marginBottom: '20px' }}>
										<label className={styles.label}>Current Password</label>
										<input
											type="password"
											className={styles.input}
											value={passForm.currentPassword}
											onChange={(e) => setPassForm(p => ({ ...p, currentPassword: e.target.value }))}
											required
										/>
									</div>
									<div className={styles.field} style={{ marginBottom: '20px' }}>
										<label className={styles.label}>New Password</label>
										<input
											type="password"
											className={styles.input}
											value={passForm.newPassword}
											onChange={(e) => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
											required
											minLength={6}
										/>
										<p style={{ fontSize: '12px', color: 'var(--ud-text-muted)', marginTop: '4px' }}>Minimum 6 characters required.</p>
									</div>
									<div className={styles.field} style={{ marginBottom: '32px' }}>
										<label className={styles.label}>Confirm New Password</label>
										<input
											type="password"
											className={styles.input}
											value={passForm.confirmPassword}
											onChange={(e) => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
											required
										/>
									</div>

									<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
										{loading ? <div className={styles.spinner} /> : <Lock size={18} />}
										<span>Update Security Key</span>
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
