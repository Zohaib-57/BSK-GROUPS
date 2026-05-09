import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { propertyAPI, blogAPI } from "../utils/api";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import {
	Home,
	TreePine,
	Store,
	Building2,
	ArrowRight,
	Shield,
	Users,
	TrendingUp,
} from "lucide-react";
import "./HomePage.css";

const CATEGORIES = [
	{
		label: "Homes",
		icon: Home,
		path: "/properties?type=house",
		count: "5+ Listings",
		desc: "Find 100% verified residential properties",
	},
	{
		label: "Plots",
		icon: TreePine,
		path: "/properties?type=plot",
		count: "3+ Listings",
		desc: "Best residential, commercial & industrial plots",
	},
	{
		label: "Commercial",
		icon: Store,
		path: "/properties?type=commercial",
		count: "3+ Listings",
		desc: "Explore high-potential commercial properties",
	},
	{
		label: "Apartments",
		icon: Building2,
		path: "/properties?type=apartment",
		count: "2+ Listings",
		desc: "Modern apartments in prime locations",
	},
];

const SOCIETIES = [
	{
		name: "DHA Peshawar",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
		properties: 120,
		from: "from-amber-800",
		to: "to-secondary",
	},
	{
		name: "Hayatabad",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
		properties: 95,
		from: "from-slate-700",
		to: "to-slate-950",
	},
	{
		name: "University Town",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1599423300746-b62533397364",
		properties: 80,
		from: "from-primary-dark",
		to: "to-secondary",
	},
	{
		name: "Naval Anchorage",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
		properties: 60,
		from: "from-primary",
		to: "to-secondary",
	},
	{
		name: "Ring Road Society",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
		properties: 70,
		from: "from-primary-dark",
		to: "to-secondary",
	},
	{
		name: "Gulshan-e-Usman",
		city: "Peshawar",
		province: "KPK",
		image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
		properties: 50,
		from: "from-primary-dark",
		to: "to-secondary",
	},
];

const STATS = [
	{ value: "500+", label: "Properties Listed" },
	{ value: "200+", label: "Happy Clients" },
	{ value: "50+", label: "Trusted Agents" },
	{ value: "10+", label: "Years Experience" },
];

const WHY_BSK = [
	{
		icon: Shield,
		title: "Verified Listings",
		desc: "Every property is thoroughly inspected. We guarantee 100% verified listings to protect your investment.",
	},
	{
		icon: Users,
		title: "Trusted Partners",
		desc: "Connecting buyers and sellers with reputable dealers across Peshawar and KPK.",
	},
	{
		icon: TrendingUp,
		title: "Fast Closing",
		desc: "Quick document settlement with expert guidance ensuring a smooth property transaction.",
	},
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
	const { data: featuredData } = useQuery({
		queryKey: ["featured-properties"],
		queryFn: () => propertyAPI.getFeatured().then((r) => r.data),
	});
	const { data: blogsData } = useQuery({
		queryKey: ["featured-blogs"],
		queryFn: () => blogAPI.getFeatured().then((r) => r.data),
	});

	const properties = featuredData?.properties ?? [];
	const blogs = blogsData?.blogs ?? [];

	return (
		<>
			<Helmet>
				<title>BSK Group | Premium Real Estate in Peshawar & Islamabad</title>
				<meta name="description" content="Discover your dream home with BSK Group. The most trusted real estate platform in Peshawar, Islamabad, and Lahore." />
				<meta name="keywords" content="real estate, peshawar properties, islamabad houses, DHA Peshawar, Bahria Town, BSK Group" />
			</Helmet>

			{/* ════════════════════════════════════════
			    HERO
			════════════════════════════════════════ */}
			<section className="hp-hero">
				<div className="hp-hero__bg" aria-hidden="true" />
				<div className="hp-hero__overlay" aria-hidden="true" />

				<div className="hp-container hp-hero__content">
					<p className="hp-eyebrow">Pakistan's Premier Property Portal</p>

					<h1 className="hp-hero__title">
						Discover Your Next
						<br />
						<span className="hp-accent">Property</span> in Peshawar
					</h1>

					<p className="hp-hero__sub">
						Explore verified listings for homes, plots, and commercial
						properties across KPK
					</p>

					<div className="hp-hero__search">
						<SearchBar hero />
					</div>

					<div className="hp-stats">
						{STATS.map((s) => (
							<div key={s.label} className="hp-stat">
								<strong>{s.value}</strong>
								<span>{s.label}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════════════════════════════════
			    CATEGORIES
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--white">
				<div className="hp-container">
					<div className="hp-section__header hp-section__header--center">
						<p className="hp-eyebrow hp-eyebrow--dark">Browse by Type</p>
						<h2 className="hp-section__title">Find Properties by Category</h2>
					</div>

					<div className="hp-categories">
						{CATEGORIES.map((cat) => (
							<Link key={cat.label} to={cat.path} className="hp-cat-card">
								<div className="hp-cat-card__icon">
									<cat.icon size={36} strokeWidth={1.5} />
								</div>
								<h3 className="hp-cat-card__label">{cat.label}</h3>
								<p className="hp-cat-card__count">{cat.count}</p>
								<p className="hp-cat-card__desc">{cat.desc}</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ════════════════════════════════════════
			    FEATURED PROPERTIES
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--gray">
				<div className="hp-container">
					<div className="hp-section__header hp-section__header--between">
						<div>
							<p className="hp-eyebrow hp-eyebrow--dark">Handpicked for You</p>
							<h2 className="hp-section__title">Featured Properties</h2>
						</div>
						<Link to="/properties?isFeatured=true" className="hp-view-all">
							View All <ArrowRight size={16} />
						</Link>
					</div>

					<div className="hp-properties-grid">
						{properties.length > 0 ? (
							properties.slice(0, 8).map((p) => (
								<PropertyCard key={p._id} property={p} />
							))
						) : (
							<p className="text-center text-gray-500 py-10 col-span-full">
								No featured properties available at the moment.
							</p>
						)}
					</div>
				</div>
			</section>

			{/* ════════════════════════════════════════
			    SOCIETIES
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--white">
				<div className="hp-container">
					<div className="hp-section__header hp-section__header--center">
						<p className="hp-eyebrow hp-eyebrow--dark">Top Locations</p>
						<h2 className="hp-section__title">Premium Societies</h2>
					</div>

					<div className="hp-societies">
						{SOCIETIES.map((s) => (
							<Link
								key={s.name}
								to={`/properties?society=${encodeURIComponent(s.name)}`}
								className="hp-society-card"
							>
								{/* Background Image */}
								<img
									src={s.image}
									alt={s.name}
									className="hp-society-card__img"
									loading="lazy"
								/>

								{/* Overlays */}
								<div className="hp-society-card__overlay" />
								<div
									className={`hp-society-card__gradient ${s.from} ${s.to}`}
								/>

								{/* Content */}
								<div className="hp-society-card__body">
									<strong>{s.name}</strong>
									<span>
										{s.city}, {s.province}
									</span>
									<span>{s.properties} Properties</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>
			{/* ════════════════════════════════════════
			    WHY BSK
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--dark">
				<div className="hp-container">
					<div className="hp-section__header hp-section__header--center">
						<p className="hp-eyebrow">Why Choose Us</p>
						<h2 className="hp-section__title hp-section__title--light">
							Pakistan's Most Trusted Property Ecosystem
						</h2>
						<p className="hp-section__sub">
							Empowering investors and certified partners nationwide
						</p>
					</div>

					<div className="hp-why-grid">
						{WHY_BSK.map((item) => (
							<div key={item.title} className="hp-why-card">
								<div className="hp-why-card__icon">
									<item.icon size={30} />
								</div>
								<h3 className="hp-why-card__title">{item.title}</h3>
								<p className="hp-why-card__desc">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════════════════════════════════
			    CTA
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--cta-wrap">
				<div className="hp-container">
					<div className="hp-cta">
						<div className="hp-cta__text">
							<h2 className="hp-cta__title">
								Want to Sell <span className="hp-accent">Fast?</span>
							</h2>
							<p className="hp-cta__sub">
								Reach Peshawar's elite dealers. Post your property in 60
								seconds.
							</p>
						</div>
						<Link to="/post-property" className="hp-cta__btn">
							+ Post Your Property
						</Link>
					</div>
				</div>
			</section>

			{/* ════════════════════════════════════════
			    BLOGS
			════════════════════════════════════════ */}
			{blogs.length > 0 && (
				<section className="hp-section hp-section--white">
					<div className="hp-container">
						<div className="hp-section__header hp-section__header--between">
							<div>
								<p className="hp-eyebrow hp-eyebrow--dark">Stay Informed</p>
								<h2 className="hp-section__title">From The Latest Blogs</h2>
							</div>
							<Link to="/blogs" className="hp-view-all">
								View All <ArrowRight size={16} />
							</Link>
						</div>

						<div className="hp-blogs-grid">
							{blogs.slice(0, 3).map((blog) => (
								<Link
									key={blog._id}
									to={`/blogs/${blog.slug}`}
									className="hp-blog-card"
								>
									{blog.coverImage && (
										<div className="hp-blog-card__img-wrap">
											<img
												src={blog.coverImage}
												alt={blog.title}
												className="hp-blog-card__img"
											/>
										</div>
									)}
									<div className="hp-blog-card__body">
										<span className="hp-blog-card__cat">{blog.category}</span>
										<h3 className="hp-blog-card__title">{blog.title}</h3>
										<p className="hp-blog-card__excerpt">
											{blog.excerpt?.substring(0, 120)}...
										</p>
										<span className="hp-blog-card__date">
											{new Date(blog.createdAt).toLocaleDateString("en-PK", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			{/* ════════════════════════════════════════
			    TEAM TEASER
			════════════════════════════════════════ */}
			<section className="hp-section hp-section--gray">
				<div className="hp-container">
					<div className="hp-section__header hp-section__header--center">
						<p className="hp-eyebrow hp-eyebrow--dark">Our Experts</p>
						<h2 className="hp-section__title">Meet the BSK Team</h2>
						<p className="hp-section__body-text">
							Dedicated real estate professionals ready to help you find your
							perfect property.
						</p>
						<Link to="/agents" className="hp-team-btn">
							Meet Our Agents <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
