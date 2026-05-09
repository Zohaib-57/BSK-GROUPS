import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageSquare, Trash2, CheckCircle, Clock, Filter } from "lucide-react";
import { inquiryAPI } from "../../utils/api";
import styles from "./AdminTable.module.css";
import toast from "react-hot-toast";

export default function AdminInquiries() {
	const [searchTerm, setSearchTerm] = useState("");
	
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-inquiries", searchTerm],
		queryFn: () => inquiryAPI.getMyInquiries().then((r) => r.data), // Assuming admin can see all via this or specific admin route
	});

	const handleStatusUpdate = async (id, status) => {
		try {
			await inquiryAPI.updateStatus(id, status);
			toast.success(`Inquiry marked as ${status}`);
			refetch();
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.title}>Lead Management</h1>
					<p className={styles.subtitle}>Track and respond to all property inquiries and contact requests.</p>
				</div>
				<div className="flex gap-2">
					<button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:border-primary hover:text-primary transition-all">
						<Filter size={16} /> Filter Leads
					</button>
				</div>
			</div>

			<div className={styles.tableSection}>
				<div className={styles.tableToolbar}>
					<div className={styles.searchBox}>
						<Search size={18} className={styles.searchIcon} />
						<input 
							type="text" 
							placeholder="Search by name, property, or email..." 
							className={styles.searchInput}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						{data?.inquiries?.length || 0} Total Leads
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Sender Details</th>
								<th>Property / Subject</th>
								<th>Received</th>
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
							) : (data?.inquiries || []).map((inquiry) => (
								<tr key={inquiry._id}>
									<td>
										<div className={styles.userInfo}>
											<div className={styles.avatar}>
												<MessageSquare size={20} className="m-auto text-gray-400" />
											</div>
											<div>
												<span className={styles.name}>{inquiry.name}</span>
												<span className={styles.email}>{inquiry.email} • {inquiry.phone}</span>
											</div>
										</div>
									</td>
									<td>
										<div>
											<span className="font-bold text-secondary block">{inquiry.property?.title || inquiry.subject || "General Inquiry"}</span>
											<span className="text-[11px] text-gray-400 line-clamp-1">{inquiry.message}</span>
										</div>
									</td>
									<td className="text-gray-500 font-medium">
										{new Date(inquiry.createdAt).toLocaleDateString()}
									</td>
									<td>
										<span className={`${styles.badge} ${
											inquiry.status === 'responded' ? styles.badgeAgent : styles.badgeUser
										}`}>
											{inquiry.status}
										</span>
									</td>
									<td style={{ textAlign: 'right' }}>
										<div className="flex justify-end gap-1">
											<button 
												className={styles.actionBtn} 
												title="Mark as Responded"
												onClick={() => handleStatusUpdate(inquiry._id, 'responded')}
											>
												<CheckCircle size={16} />
											</button>
											<button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Archive Lead">
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							))}

							{data?.inquiries?.length === 0 && (
								<tr>
									<td colSpan="5" className="text-center py-20 text-gray-400 font-medium">
										No leads found. Great job on responding to everyone!
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
