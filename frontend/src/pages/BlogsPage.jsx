import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { blogAPI } from "../utils/api";
import { Calendar, Eye, Search, ArrowRight } from "lucide-react";
import styles from "./BlogsPage.module.css";

const CATEGORIES = [
	"all",
	"market-trends",
	"investment",
	"news",
	"guides",
	"lifestyle",
];



export default function BlogsPage() {
	const [category, setCategory] = useState("");
	const [keyword, setKeyword] = useState("");

	const { data, isLoading } = useQuery({
		queryKey: ["blogs", category, keyword],
		queryFn: () =>
			blogAPI
				.getAll({
					category: category || undefined,
					keyword: keyword || undefined,
				})
				.then((r) => r.data),
	});

	const blogsToShow = data?.blogs || [];

	return (
		<>
			<Helmet>
				<title>Real Estate Blog | BSK Groups</title>
			</Helmet>

			<div className={styles.pageContainer}>
				{/* Page Header */}
				<div className={styles.pageHeader}>
					<div className={styles.container}>
						<h1 className={styles.pageTitle}>Real Estate Insights</h1>
						<p className={styles.pageSubtitle}>
							Stay updated with the latest market trends, investment tips, 
							and urban development news from the heart of Peshawar.
						</p>
					</div>
				</div>

				{/* Toolbar / Search */}
				<div className={styles.toolbar}>
					<div className={styles.searchWrapper}>
						<Search size={20} className={styles.searchIcon} />
						<input
							type="text"
							placeholder="Search articles, trends, or guides..."
							className={styles.searchInput}
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.container}>
					{/* Category Filter */}
					<div className={styles.categoryFilter}>
						{CATEGORIES.map((c) => (
							<button
								key={c}
								className={`${styles.categoryTab} ${
									category === c || (c === "all" && !category)
										? styles.categoryTabActive
										: ""
								}`}
								onClick={() => setCategory(c === "all" ? "" : c)}
							>
								{c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
							</button>
						))}
					</div>

					{/* Blog Grid */}
					{isLoading && !blogsToShow.length ? (
						<div className="flex justify-center items-center py-20">
							<div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						<div className={styles.blogGrid}>
							{blogsToShow.map((blog) => (
								<Link
									key={blog._id}
									to={`/blogs/${blog.slug}`}
									className={styles.blogCard}
								>
									<div className={styles.imageWrapper}>
										<img
											src={blog.coverImage}
											alt={blog.title}
											className={styles.blogImage}
										/>
										<span className={styles.categoryBadge}>
											{blog.category.replace("-", " ")}
										</span>
									</div>

									<div className={styles.blogContent}>
										<div className={styles.blogDate}>
											<Calendar size={14} />
											{new Date(blog.createdAt).toLocaleDateString("en-US", {
												month: "long",
												day: "numeric",
												year: "numeric"
											})}
										</div>

										<h3 className={styles.blogTitle}>{blog.title}</h3>
										<p className={styles.blogExcerpt}>{blog.excerpt}</p>

										<div className={styles.blogFooter}>
											<span className={styles.readMore}>
												Read Article <ArrowRight size={14} />
											</span>
											<span className={styles.viewsCount}>
												<Eye size={14} /> {blog.views.toLocaleString()}
											</span>
										</div>
									</div>
								</Link>
							))}

							{blogsToShow.length === 0 && (
								<div className={styles.emptyState}>
									<Search size={48} className={styles.emptyIcon} />
									<h3 className={styles.emptyTitle}>No Articles Found</h3>
									<p className="text-gray-500 mt-2">
										Try adjusting your search or filters to find what you're looking for.
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
