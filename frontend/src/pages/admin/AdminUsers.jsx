import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus, Trash2, Edit2, Shield, MoreVertical, User } from "lucide-react";
import { adminAPI } from "../../utils/api";
import styles from "./AdminTable.module.css";
import toast from "react-hot-toast";

export default function AdminUsers() {
	const [searchTerm, setSearchTerm] = useState("");
	
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-users", searchTerm],
		queryFn: () => adminAPI.getAllUsers({ keyword: searchTerm }).then((r) => r.data),
	});

	const handleDelete = (id) => {
		toast((t) => (
			<div className="flex flex-col gap-3">
				<p className="font-semibold text-gray-800">
					Are you sure you want to delete this user?
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
							const loadingToast = toast.loading("Deleting user...");
							try {
								await adminAPI.deleteUser(id);
								toast.success("User deleted successfully", { id: loadingToast });
								refetch();
							} catch (error) {
								toast.error("Failed to delete user", { id: loadingToast });
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
						Delete
					</button>
				</div>
			</div>
		), {
			duration: 4000,
			position: "top-center",
			style: {
				padding: "16px",
				borderRadius: "16px",
				minWidth: "300px"
			}
		});
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.title}>User Management</h1>
					<p className={styles.subtitle}>View and manage all platform users, agents, and administrators.</p>
				</div>
				<button className="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all">
					<UserPlus size={18} /> Add New User
				</button>
			</div>

			<div className={styles.tableSection}>
				<div className={styles.tableToolbar}>
					<div className={styles.searchBox}>
						<Search size={18} className={styles.searchIcon} />
						<input 
							type="text" 
							placeholder="Search by name, email, or role..." 
							className={styles.searchInput}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						{data?.users?.length || 0} Total Users
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>User Details</th>
								<th>Role</th>
								<th>Joined Date</th>
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
							) : (data?.users || []).map((user) => (
								<tr key={user._id}>
									<td>
										<div className={styles.userInfo}>
											<div className={styles.avatar}>
												<User size={20} className="m-auto text-gray-400" />
											</div>
											<div>
												<span className={styles.name}>{user.name}</span>
												<span className={styles.email}>{user.email}</span>
											</div>
										</div>
									</td>
									<td>
										<span className={`${styles.badge} ${
											user.role === 'admin' ? styles.badgeAdmin : 
											user.role === 'agent' ? styles.badgeAgent : styles.badgeUser
										}`}>
											{user.role}
										</span>
									</td>
									<td className="text-gray-500 font-medium">
										{new Date(user.createdAt).toLocaleDateString()}
									</td>
									<td>
										<span className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider">
											<div className="w-1.5 h-1.5 rounded-full bg-primary" /> Active
										</span>
									</td>
									<td style={{ textAlign: 'right' }}>
										<div className="flex justify-end gap-1">
											<button className={styles.actionBtn} title="Edit User">
												<Edit2 size={16} />
											</button>
											<button 
												className={`${styles.actionBtn} ${styles.deleteBtn}`} 
												onClick={() => handleDelete(user._id)}
												title="Delete User"
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
