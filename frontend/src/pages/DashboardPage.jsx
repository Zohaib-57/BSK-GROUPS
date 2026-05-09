import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { propertyAPI, inquiryAPI } from "../utils/api";
import {
	Plus,
	Building2,
	MessageSquare,
	Heart,
	Eye,
	Pencil,
	Trash2,
	Clock,
	ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./UserDashboard.module.css";

const formatPrice = (p) => {
	if (p >= 10000000) return `${(p / 10000000).toFixed(1)} Cr`;
	if (p >= 100000) return `${(p / 100000).toFixed(0)} Lakh`;
	return p?.toLocaleString();
};

export default function DashboardPage() {
	const { user } = useAuth();

	const { data: propsData, refetch: refetchProps } = useQuery({
		queryKey: ["my-properties"],
		queryFn: () => propertyAPI.getMyProperties().then((r) => r.data),
	});

	const { data: inqData } = useQuery({
		queryKey: ["my-inquiries"],
		queryFn: () => inquiryAPI.getMyInquiries().then((r) => r.data),
	});

	const handleDelete = async (id) => {
		if (!confirm("Delete this property?")) return;
		try {
			await propertyAPI.delete(id);
			toast.success("Property deleted");
			refetchProps();
		} catch {
			toast.error("Failed to delete");
		}
	};

	const properties = propsData?.properties || [];
	const inquiries = inqData?.inquiries || [];

	const stats = [
		{
			label: "My Listings",
			value: properties.length,
			icon: Building2,
			color: "#c9923a",
		},
		{
			label: "Inquiries",
			value: inquiries.length,
			icon: MessageSquare,
			color: "#3b82f6",
		},
		{
			label: "Saved Items",
			value: user?.savedProperties?.length || 0,
			icon: Heart,
			color: "#ef4444",
		},
		{
			label: "Total Views",
			value: properties.reduce((s, p) => s + (p.views || 0), 0),
			icon: Eye,
			color: "#f5a623",
		},
	];

	return (
		<div className={styles.animateFade}>
			<Helmet>
				<title>Dashboard | BSK Groups</title>
			</Helmet>

			<div className={styles.container}>
				{/* Header */}
				<header className={styles.header}>
					<div className={styles.headerContent}>
						<h1 className={styles.title}>
							Welcome back, {user?.name?.split(" ")[0]}!
						</h1>
						<p className={styles.subtitle}>
							Monitor your listings, track interest, and manage your real estate portfolio.
						</p>
					</div>
					<Link to="/post-property" className={`${styles.btn} ${styles.btnPrimary}`}>
						<Plus size={18} /> <span>Post Property</span>
					</Link>
				</header>

				{/* Stats Grid */}
				<div className={styles.statsGrid}>
					{stats.map((s, idx) => (
						<div key={s.label} className={styles.statCard} style={{ animationDelay: `${idx * 0.1}s` }}>
							<div
								className={styles.statIcon}
								style={{ background: `${s.color}12`, color: s.color }}
							>
								<s.icon size={24} />
							</div>
							<div className={styles.statValue}>{s.value}</div>
							<div className={styles.statLabel}>{s.label}</div>
						</div>
					))}
				</div>

				{/* Main Content */}
				<div className={styles.mainGrid}>
					{/* Listings Section */}
					<section className={styles.section}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>My Properties</h2>
							<Link to="/properties" className={styles.listTitle} style={{ fontSize: '13px' }}>
								View all
							</Link>
						</div>

						{properties.length === 0 ? (
							<div className={styles.emptyState}>
								<Building2 size={48} className={styles.emptyIcon} />
								<p>You haven&apos;t listed any properties yet.</p>
								<Link to="/post-property" className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '8px 16px', fontSize: '13px' }}>
									Create Listing
								</Link>
							</div>
						) : (
							<div className={styles.list}>
								{properties.map((p) => (
									<div key={p._id} className={styles.listItem}>
										<img
											src={p.images?.[0]?.url || "/placeholder-property.jpg"}
											alt={p.title}
											className={styles.listImg}
										/>
										<div className={styles.listContent}>
											<Link to={`/properties/${p.slug}`} className={styles.listTitle}>
												{p.title}
											</Link>
											<div className={styles.listMeta}>
												<span className={`${styles.badge} ${p.isApproved ? styles.badgeSuccess : styles.badgeWarning}`}>
													{p.isApproved ? "Active" : "Pending"}
												</span>
												<span>PKR {formatPrice(p.price)}</span>
												<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
													<Eye size={12} /> {p.views}
												</span>
											</div>
										</div>
										<div className={styles.actions}>
											<Link to={`/edit-property/${p._id}`} className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit">
												<Pencil size={14} />
											</Link>
											<button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p._id)} title="Delete">
												<Trash2 size={14} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</section>

					{/* Inquiries Section */}
					<section className={styles.section}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>Recent Inquiries</h2>
						</div>

						{inquiries.length === 0 ? (
							<div className={styles.emptyState}>
								<MessageSquare size={48} className={styles.emptyIcon} />
								<p>No inquiries received yet.</p>
							</div>
						) : (
							<div className={styles.list}>
								{inquiries.slice(0, 5).map((inq) => (
									<div key={inq._id} className={styles.inquiryItem}>
										<div className={styles.inquiryHeader}>
											<div className={styles.avatar}>
												{inq.name?.[0]?.toUpperCase()}
											</div>
											<div className={styles.inquiryName}>{inq.name}</div>
											<div className={styles.listMeta} style={{ marginLeft: 'auto' }}>
												<Clock size={12} /> {new Date(inq.createdAt).toLocaleDateString()}
											</div>
										</div>
										<p className={styles.inquiryMsg}>
											{inq.message}
										</p>
										<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
											<Link to="#" className={styles.listTitle} style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
												Reply <ArrowRight size={12} />
											</Link>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}
