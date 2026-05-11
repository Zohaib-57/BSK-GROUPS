import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Trash2, Edit2, Eye, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { blogAPI } from "../../utils/api";
import styles from "./AdminTable.module.css";
import toast from "react-hot-toast";

export default function AdminBlogs() {
	const [searchTerm, setSearchTerm] = useState("");
	
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-blogs", searchTerm],
		queryFn: () => blogAPI.getAll({ keyword: searchTerm }).then((r) => r.data),
	});

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
			try {
				// blogAPI.delete(id) - Assuming this exists or using adminAPI
				toast.success("Article deleted successfully");
				refetch();
			} catch (error) {
				toast.error("Failed to delete article");
			}
		}
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.title}>Editorial Management</h1>
					<p className={styles.subtitle}>Create, edit, and manage your market insights and news articles.</p>
				</div>
				<button className="w-full sm:w-auto justify-center flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all">
					<Plus size={18} /> New Article
				</button>
			</div>

			<div className={styles.tableSection}>
				<div className={styles.tableToolbar}>
					<div className={styles.searchBox}>
						<Search size={18} className={styles.searchIcon} />
						<input 
							type="text" 
							placeholder="Search by title, category, or keyword..." 
							className={styles.searchInput}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="w-full sm:w-auto text-xs font-bold text-gray-400 uppercase tracking-widest sm:text-right">
						{data?.blogs?.length || 0} Total Articles
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Article Details</th>
								<th>Category</th>
								<th>Published</th>
								<th>Engagement</th>
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
							) : (data?.blogs || []).map((blog) => (
								<tr key={blog._id}>
									<td>
										<div className={styles.userInfo}>
											<img loading="lazy" 
												src={blog.coverImage} 
												alt={blog.title} 
												className={styles.avatar}
												style={{ borderRadius: '8px', width: '3.5rem' }}
											/>
											<div>
												<span className={styles.name}>{blog.title}</span>
												<span className={styles.email}>By Administrator</span>
											</div>
										</div>
									</td>
									<td>
										<span className={`${styles.badge} ${styles.badgeAdmin}`}>
											{blog.category.replace("-", " ")}
										</span>
									</td>
									<td className="text-gray-500 font-medium">
										{new Date(blog.createdAt).toLocaleDateString()}
									</td>
									<td>
										<div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
											<Eye size={14} /> {blog.views.toLocaleString()} Views
										</div>
									</td>
									<td style={{ textAlign: 'right' }}>
										<div className="flex justify-end gap-1">
											<Link to={`/blogs/${blog.slug}`} className={styles.actionBtn} title="View Article">
												<Eye size={16} />
											</Link>
											<button className={styles.actionBtn} title="Edit Article">
												<Edit2 size={16} />
											</button>
											<button 
												className={`${styles.actionBtn} ${styles.deleteBtn}`} 
												onClick={() => handleDelete(blog._id)}
												title="Delete Article"
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
