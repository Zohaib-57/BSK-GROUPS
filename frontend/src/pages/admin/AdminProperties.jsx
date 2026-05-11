import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Trash2, Edit2, Eye, MapPin, Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import styles from "./AdminTable.module.css";
import toast from "react-hot-toast";

export default function AdminProperties() {
	const [searchTerm, setSearchTerm] = useState("");
	
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-properties", searchTerm],
		queryFn: () => adminAPI.getAllProperties({ keyword: searchTerm }).then((r) => r.data),
	});

	const handleApprove = async (id, isApproved) => {
		try {
			await adminAPI.updateProperty(id, { isApproved });
			toast.success(`Property ${isApproved ? "approved" : "rejected"} successfully`);
			refetch();
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	const handleDelete = (id) => {
		toast((t) => (
			<div className="flex flex-col gap-3">
				<p className="font-semibold text-gray-800">
					Delete this property? This cannot be undone.
				</p>
				<div className="flex justify-end gap-2">
					<button
						onClick={() => toast.dismiss(t.id)}
						className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={async () => {
							toast.dismiss(t.id);
							const loadingToast = toast.loading("Removing property...");
							try {
								await adminAPI.deleteProperty(id);
								toast.success("Property removed successfully", { id: loadingToast });
								refetch();
							} catch (error) {
								toast.error("Failed to remove property", { id: loadingToast });
							}
						}}
						style={{ 
							backgroundColor: '#ef4444', 
							color: '#fff', 
							padding: '6px 16px', 
							fontSize: '12px', 
							fontWeight: 'bold', 
							borderRadius: '8px',
							border: 'none',
							cursor: 'pointer'
						}}
					>
						Confirm Delete
					</button>
				</div>
			</div>
		), {
			duration: 4000,
			position: "top-center",
			style: {
				padding: "16px",
				borderRadius: "16px",
				minWidth: "320px"
			}
		});
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.title}>Property Inventory</h1>
					<p className={styles.subtitle}>Manage and review all property listings across the platform.</p>
				</div>
				<Link to="/post-property" className="w-full sm:w-auto justify-center flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
					<Plus size={18} /> List New Property
				</Link>
			</div>

			<div className={styles.tableSection}>
				<div className={styles.tableToolbar}>
					<div className={styles.searchBox}>
						<Search size={18} className={styles.searchIcon} />
						<input 
							type="text" 
							placeholder="Search by title, location, or owner..." 
							className={styles.searchInput}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="w-full sm:w-auto text-xs font-bold text-gray-400 uppercase tracking-widest sm:text-right">
						{data?.totalCount || 0} Total Listings
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Property Details</th>
								<th>Location</th>
								<th>Price</th>
								<th>Status</th>
								<th style={{ textAlign: 'right' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan="5" className="text-center py-20">
										<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
									</td>
								</tr>
							) : (data?.properties || []).map((prop) => (
								<tr key={prop._id}>
									<td>
										<div className={styles.userInfo}>
											<img loading="lazy" 
												src={prop.coverImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
												alt={prop.title} 
												className={styles.avatar}
												style={{ borderRadius: '8px' }}
											/>
											<div>
												<span className={styles.name}>{prop.title}</span>
												<span className={styles.email}>{prop.category} • {prop.type}</span>
											</div>
										</div>
									</td>
									<td>
										<div className="flex items-center gap-1.5 text-gray-500 font-medium">
											<MapPin size={14} className="text-gray-400" />
											{prop.location?.address || prop.location?.city || "Peshawar"}
										</div>
									</td>
									<td className="font-bold text-secondary">
										Rs. {prop.price?.toLocaleString()}
									</td>
									<td>
										<span className={`${styles.badge} ${
											prop.isApproved ? styles.badgeAgent : styles.badgeUser
										}`}>
											{prop.isApproved ? "Approved" : "Pending"}
										</span>
									</td>
									<td style={{ textAlign: 'right' }}>
										<div className="flex justify-end gap-1">
											{!prop.isApproved && (
												<button 
													className={`${styles.actionBtn} text-primary`} 
													onClick={() => handleApprove(prop._id, true)}
													title="Approve Listing"
												>
													<Check size={16} />
												</button>
											)}
											{prop.isApproved && (
												<button 
													className={`${styles.actionBtn} text-orange-500`} 
													onClick={() => handleApprove(prop._id, false)}
													title="Move to Pending"
												>
													<Clock size={16} />
												</button>
											)}
											<Link to={`/properties/${prop.slug}`} className={styles.actionBtn} title="View Live">
												<Eye size={16} />
											</Link>
											<Link to={`/edit-property/${prop._id}`} className={styles.actionBtn} title="Edit Listing">
												<Edit2 size={16} />
											</Link>
											<button 
												className={`${styles.actionBtn} ${styles.deleteBtn}`} 
												onClick={() => handleDelete(prop._id)}
												title="Delete Listing"
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
		</div>
	);
}
