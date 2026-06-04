import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageSquare, Trash2, CheckCircle, Mail, Filter } from "lucide-react";
import { inquiryAPI } from "../../utils/api";
import styles from "./AdminTable.module.css";
import toast from "react-hot-toast";

export default function AdminInquiries() {
	const [searchTerm, setSearchTerm] = useState("");

	// ✅ Use admin-only getAll endpoint (not getMyInquiries which is agent-scoped)
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-inquiries"],
		queryFn: () => inquiryAPI.getAll().then((r) => r.data),
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

	// Client-side search filter
	const allInquiries = data?.inquiries || [];
	const filtered = searchTerm
		? allInquiries.filter(
				(inq) =>
					inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					inq.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					inq.message?.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: allInquiries;

	return (
		<div className={styles.pageContainer}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.title}>Lead Management</h1>
					<p className={styles.subtitle}>Track and respond to all property inquiries and contact requests.</p>
				</div>
				<div className="w-full sm:w-auto flex gap-2">
					<button className="w-full sm:w-auto justify-center flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:border-primary hover:text-primary transition-all">
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
					<div className="w-full sm:w-auto text-xs font-bold text-gray-400 uppercase tracking-widest sm:text-right">
						{filtered.length} Total Leads
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Sender Details</th>
								<th>Property / Subject</th>
								<th>Message</th>
								<th>Received</th>
								<th>Status</th>
								<th style={{ textAlign: "right" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{/* ✅ Loading row */}
							{isLoading ? (
								<tr>
									<td colSpan="6" className="text-center py-20">
										<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
									</td>
								</tr>
							) : filtered.length === 0 ? (
								/* ✅ Empty state row — no text nodes outside <tr> */
								<tr>
									<td colSpan="6" className="text-center py-20 text-gray-400 font-medium">
										{searchTerm ? "No leads match your search." : "No leads found. Great job on responding to everyone!"}
									</td>
								</tr>
							) : (
								/* ✅ Data rows */
								filtered.map((inquiry) => (
									<tr key={inquiry._id}>
										<td>
											<div className={styles.userInfo}>
												<div className={styles.avatar}>
													<MessageSquare size={20} className="m-auto text-gray-400" />
												</div>
												<div>
													<span className={styles.name}>{inquiry.name}</span>
													<span className={styles.email}>{inquiry.email}</span>
													{inquiry.phone && (
														<span className={styles.email}>📞 {inquiry.phone}</span>
													)}
												</div>
											</div>
										</td>
										<td>
											<div>
												<span className="font-bold text-secondary block">
													{inquiry.property?.title || inquiry.subject || "General Inquiry"}
												</span>
												<span className="text-[11px] text-gray-400 capitalize">{inquiry.role || "buyer"}</span>
											</div>
										</td>
										<td style={{ maxWidth: 220 }}>
											<span className="text-[12px] text-gray-500 line-clamp-2 block">{inquiry.message}</span>
										</td>
										<td className="text-gray-500 font-medium">
											{new Date(inquiry.createdAt).toLocaleDateString("en-PK", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td>
											<span
												className={`${styles.badge} ${
													inquiry.status === "responded"
														? styles.badgeAgent
														: styles.badgeUser
												}`}
											>
												{inquiry.status === "responded" ? "✓ Responded" : "⏳ Pending"}
											</span>
										</td>
										<td style={{ textAlign: "right" }}>
											<div className="flex justify-end gap-1">
												{/* Reply via email */}
												<a
													href={`mailto:${inquiry.email}?subject=Re: ${inquiry.property?.title || "Your Inquiry"} — BSK Groups&body=Dear ${inquiry.name},%0A%0AThank you for your inquiry about ${inquiry.property?.title || "our properties"}.%0A%0A`}
													className={styles.actionBtn}
													title="Reply via Email"
												>
													<Mail size={16} />
												</a>
												{/* Mark as responded */}
												{inquiry.status !== "responded" && (
													<button
														className={styles.actionBtn}
														title="Mark as Responded"
														onClick={() => handleStatusUpdate(inquiry._id, "responded")}
													>
														<CheckCircle size={16} />
													</button>
												)}
												{/* Archive */}
												<button
													className={`${styles.actionBtn} ${styles.deleteBtn}`}
													title="Archive Lead"
													onClick={() => handleStatusUpdate(inquiry._id, "archived")}
												>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
