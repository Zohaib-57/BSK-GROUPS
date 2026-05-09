import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { propertyAPI, adminAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { 
	Building2, 
	MapPin, 
	Bed, 
	Bath, 
	Info, 
	Save, 
	X, 
	ArrowLeft 
} from "lucide-react";
import styles from "./EditPropertyPage.module.css";

export default function EditPropertyPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [form, setForm] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const { user } = useAuth();

	const { data, isLoading } = useQuery({
		queryKey: ["property-edit", id],
		queryFn: async () => {
			try {
				const apiCall = user?.role === "admin" 
					? adminAPI.getPropertyById(id) 
					: propertyAPI.getById(id);
				
				const r = await apiCall;
				return r.data.property || null;
			} catch (err) {
				const r = await propertyAPI.getMyProperties();
				return r.data.properties.find((p) => p._id === id) || null;
			}
		},
		enabled: !!id && !!user,
	});

	useEffect(() => {
		if (data) setForm(data);
	}, [data]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await propertyAPI.update(id, form);
			toast.success("Property updated successfully!");
			navigate(user?.role === "admin" ? "/admin/properties" : "/dashboard");
		} catch (err) {
			toast.error(err.response?.data?.message || "Update failed");
		} finally {
			setSubmitting(false);
		}
	};

	if (isLoading || !form)
		return (
			<div className={styles.loaderWrapper}>
				<div className={styles.loader} />
			</div>
		);

	const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
	const setNested = (parent, key, val) =>
		setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: val } }));

	return (
		<div className={styles.editContainer}>
			<Helmet>
				<title>Edit Property | BSK Groups</title>
			</Helmet>

			<div className={styles.content}>
				{/* Back Navigation */}
				<button 
					onClick={() => navigate(-1)} 
					className="flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
				>
					<ArrowLeft size={16} /> Back to Dashboard
				</button>

				{/* Header */}
				<div className={styles.header}>
					<h1 className={styles.title}>Refine Listing</h1>
					<p className={styles.subtitle}>Modify the details of <strong>{form.title}</strong></p>
				</div>

				<form onSubmit={handleSubmit}>
					{/* Basic Information */}
					<div className={styles.formCard}>
						<h2 className={styles.sectionTitle}><Building2 size={18} /> Basic Information</h2>
						<div className={styles.inputGrid}>
							<div className={styles.fullWidth}>
								<label className={styles.label}>Property Title</label>
								<input
									className={styles.input}
									value={form.title}
									onChange={(e) => set("title", e.target.value)}
									required
									placeholder="e.g. Modern Villa with Pool"
								/>
							</div>

							<div>
								<label className={styles.label}>Price (PKR)</label>
								<input
									type="number"
									className={styles.input}
									value={form.price}
									onChange={(e) => set("price", e.target.value)}
									required
								/>
							</div>

							<div>
								<label className={styles.label}>Purpose</label>
								<select
									className={styles.select}
									value={form.purpose}
									onChange={(e) => set("purpose", e.target.value)}
								>
									<option value="sale">For Sale</option>
									<option value="rent">For Rent</option>
									<option value="lease">For Lease</option>
								</select>
							</div>
						</div>
					</div>

					{/* Features & Details */}
					<div className={styles.formCard}>
						<h2 className={styles.sectionTitle}><Info size={18} /> Features & Details</h2>
						<div className={styles.inputGrid}>
							<div>
								<label className={styles.label}>Bedrooms</label>
								<div className="relative">
									<Bed size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
									<input
										type="number"
										min={0}
										className={`${styles.input} pl-12`}
										value={form.bedrooms}
										onChange={(e) => set("bedrooms", Number(e.target.value))}
									/>
								</div>
							</div>

							<div>
								<label className={styles.label}>Bathrooms</label>
								<div className="relative">
									<Bath size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
									<input
										type="number"
										min={0}
										className={`${styles.input} pl-12`}
										value={form.bathrooms}
										onChange={(e) => set("bathrooms", Number(e.target.value))}
									/>
								</div>
							</div>

							<div className={styles.fullWidth}>
								<label className={styles.label}>Property Description</label>
								<textarea
									className={styles.textarea}
									rows={6}
									value={form.description}
									onChange={(e) => set("description", e.target.value)}
									placeholder="Describe the property's unique features..."
								/>
							</div>
						</div>
					</div>

					{/* Location Details */}
					<div className={styles.formCard}>
						<h2 className={styles.sectionTitle}><MapPin size={18} /> Location Details</h2>
						<div className={styles.inputGrid}>
							<div className={styles.fullWidth}>
								<label className={styles.label}>Full Address</label>
								<input
									className={styles.input}
									value={form.location?.address}
									onChange={(e) =>
										setNested("location", "address", e.target.value)
									}
									placeholder="House #, Street, Block..."
								/>
							</div>
							<div>
								<label className={styles.label}>City</label>
								<input
									className={styles.input}
									value={form.location?.city}
									onChange={(e) =>
										setNested("location", "city", e.target.value)
									}
								/>
							</div>
							<div>
								<label className={styles.label}>Area / Society</label>
								<input
									className={styles.input}
									value={form.location?.area || form.location?.society}
									onChange={(e) =>
										setNested("location", "area", e.target.value)
									}
								/>
							</div>
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className={styles.actions}>
						<button
							type="button"
							className={styles.btnCancel}
							onClick={() => navigate(-1)}
						>
							Discard Changes
						</button>
						<button
							type="submit"
							className={styles.btnSubmit}
							disabled={submitting}
						>
							{submitting ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save size={18} /> Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
