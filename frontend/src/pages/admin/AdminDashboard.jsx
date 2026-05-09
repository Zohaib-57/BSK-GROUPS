import { useQuery } from "@tanstack/react-query";
import { 
	Building2, 
	Users, 
	MessageSquare, 
	BookOpen, 
	TrendingUp, 
	Plus,
	Eye,
	Clock,
	Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import styles from "./AdminDashboard.module.css";
import toast from "react-hot-toast";

export default function AdminDashboard() {
	const { data: stats, isLoading, refetch: refetchStats } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => adminAPI.getDashboardStats().then((r) => r.data),
	});

	const { data: properties, refetch: refetchProperties } = useQuery({
		queryKey: ["admin-recent-properties"],
		queryFn: () => adminAPI.getAllProperties({ limit: 5 }).then((r) => r.data),
	});

	const handleApprove = async (id, isApproved) => {
		try {
			await adminAPI.approve(id, isApproved);
			toast.success(`Property ${isApproved ? "approved" : "rejected"} successfully`);
			refetchProperties();
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
			try {
				await adminAPI.deleteProperty(id);
				toast.success("Property deleted successfully");
				refetchStats();
				refetchProperties();
			} catch (error) {
				toast.error("Failed to delete property");
			}
		}
	};

	const statCards = [
		{ 
			label: "Total Properties", 
			value: stats?.totalProperties || "124", 
			icon: Building2, 
			trend: "+12%" 
		},
		{ 
			label: "Active Users", 
			value: stats?.totalUsers || "842", 
			icon: Users, 
			trend: "+5%" 
		},
		{ 
			label: "Inquiries", 
			value: stats?.totalInquiries || "28", 
			icon: MessageSquare, 
			trend: "+18%" 
		},
		{ 
			label: "Blog Posts", 
			value: stats?.totalBlogs || "15", 
			icon: BookOpen, 
			trend: "0%" 
		},
	];

	const recentActivity = (properties?.properties || []).map((prop, idx) => ({
		id: prop._id,
		type: "property",
		text: `New ${prop.type} listed: ${prop.title}`,
		time: new Date(prop.createdAt).toLocaleDateString(),
		icon: Building2
	}));

	return (
		<div className={styles.dashboardContainer}>
			{/* Page Header */}
			<div className={styles.pageHeader}>
				<h1 className={styles.pageTitle}>Admin Overview</h1>
				<p className={styles.pageSubtitle}>Welcome back. Here is what's happening with BSK Group today.</p>
			</div>

			{/* Stats Grid */}
			<div className={styles.statsGrid}>
				{statCards.map((stat, index) => (
					<div key={index} className={styles.statCard}>
						<div className={styles.statIcon}>
							<stat.icon size={24} />
						</div>
						<div className={styles.statInfo}>
							<span className={styles.statLabel}>{stat.label}</span>
							<div className="flex items-end gap-2">
								<span className={styles.statValue}>{stat.value}</span>
								<span className="text-[10px] font-bold text-primary mb-1 flex items-center">
									<TrendingUp size={10} className="mr-0.5" /> {stat.trend}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className={styles.mainContent}>
				{/* Recent Properties Table */}
				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Recent Property Listings</h2>
						<Link to="/admin/properties" className={styles.viewAll}>View All Properties</Link>
					</div>
					<div className={styles.tableWrapper}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Property</th>
									<th>Location</th>
									<th>Price</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{(properties?.properties || []).map((prop) => (
									<tr key={prop._id}>
										<td className="font-semibold">{prop.title}</td>
										<td className="text-gray-500">{prop.location?.city || prop.location?.address || "Peshawar"}</td>
										<td className="font-bold text-primary">Rs. {prop.price?.toLocaleString()}</td>
										<td>
											<span className={`${styles.statusBadge} ${prop.isApproved ? styles.statusActive : styles.statusPending}`}>
												{prop.isApproved ? "Approved" : "Pending"}
											</span>
										</td>
										<td>
											<div className="flex gap-2">
												<Link to={`/properties/${prop.slug}`} className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-primary transition-colors">
													<Eye size={16} />
												</Link>
												<Link to={`/edit-property/${prop._id}`} className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-primary transition-colors">
													<Plus size={16} style={{ transform: 'rotate(45deg)' }} />
												</Link>
												<button 
													onClick={() => handleDelete(prop._id)}
													className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
												>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Activity Feed */}
				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Recent Activity</h2>
					</div>
					<div className={styles.activityFeed}>
						{recentActivity.map((activity) => (
							<div key={activity.id} className={styles.activityItem}>
								<div className={styles.activityIcon}>
									<activity.icon size={14} />
								</div>
								<div className={styles.activityInfo}>
									<p className={styles.activityText}>{activity.text}</p>
									<span className={styles.activityTime}>
										<Clock size={10} className="inline mr-1" />
										{activity.time}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
