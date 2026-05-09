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

const DUMMY_BLOGS = [
	{
		_id: "dummy1",
		slug: "future-of-real-estate-in-peshawar",
		title: "The Future of Real Estate in Peshawar: 2024 Market Outlook",
		excerpt: "Discover the emerging trends and investment hotspots in Peshawar's rapidly growing property market for the upcoming year.",
		category: "market-trends",
		coverImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 1240
	},
	{
		_id: "dummy2",
		slug: "investment-tips-for-dha-peshawar",
		title: "5 Essential Investment Tips for DHA Peshawar Investors",
		excerpt: "Thinking of investing in DHA Peshawar? Here are five critical factors you must consider before making your move.",
		category: "investment",
		coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 890
	},
	{
		_id: "dummy3",
		slug: "top-5-luxury-apartments-in-peshawar",
		title: "Top 5 Luxury Apartments in Peshawar for Modern Living",
		excerpt: "Explore the most prestigious vertical living projects in the city that offer world-class amenities and security.",
		category: "lifestyle",
		coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 2150
	},
	{
		_id: "dummy4",
		slug: "why-invest-in-bahria-town-peshawar",
		title: "Why Bahria Town Peshawar is the New Investment Magnet",
		excerpt: "An in-depth analysis of why Bahria Town remains one of the most sought-after locations for overseas Pakistanis.",
		category: "news",
		coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 1560
	},
	{
		_id: "dummy5",
		slug: "legal-guide-property-buying-pakistan",
		title: "A Complete Legal Guide to Buying Property in Pakistan",
		excerpt: "Navigate the complex legal landscape of real estate transactions with our comprehensive guide for first-time buyers.",
		category: "guides",
		coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 3400
	},
	{
		_id: "dummy6",
		slug: "smart-city-peshawar-innovation",
		title: "Smart City Peshawar: How Technology is Changing Urban Living",
		excerpt: "Discover how the smart city initiative is revolutionizing infrastructure and quality of life in Peshawar's newest developments.",
		category: "market-trends",
		coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		createdAt: new Date().toISOString(),
		views: 720
	}
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

	// Use actual data if available, otherwise fallback to filtered dummy data
	const blogsToShow = (data?.blogs && data.blogs.length > 0) 
		? data.blogs 
		: DUMMY_BLOGS.filter(b => {
			const matchesCategory = !category || b.category === category;
			const matchesKeyword = !keyword || b.title.toLowerCase().includes(keyword.toLowerCase());
			return matchesCategory && matchesKeyword;
		});

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
