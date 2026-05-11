import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { propertyAPI } from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import styles from "./PropertiesPage.module.css";
import {
	SlidersHorizontal,
	Grid3X3,
	List,
	ChevronDown,
	X,
	Search,
} from "lucide-react";

const TYPES = [
	"house",
	"apartment",
	"plot",
	"commercial",
	"villa",
	"farmhouse",
	"room",
	"office",
	"shop",
	"warehouse",
];
const AREAS = ["marla", "kanal", "sqft", "sqm", "sqyd"];
const CITIES = [
	"Peshawar",
	"Islamabad",
	"Lahore",
	"Karachi",
	"Rawalpindi",
	"Mardan",
	"Abbottabad",
];
const SORTS = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "popular", label: "Most Popular" },
];

export default function PropertiesPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState("grid");

	const [filters, setFilters] = useState({
		purpose: searchParams.get("purpose") || "",
		type: searchParams.get("type") || "",
		city: searchParams.get("city") || "",
		area: searchParams.get("area") || "",
		society: searchParams.get("society") || "",
		keyword: searchParams.get("keyword") || "",
		minPrice: searchParams.get("minPrice") || "",
		maxPrice: searchParams.get("maxPrice") || "",
		minArea: searchParams.get("minArea") || "",
		maxArea: searchParams.get("maxArea") || "",
		areaUnit: searchParams.get("areaUnit") || "",
		bedrooms: searchParams.get("bedrooms") || "",
		bathrooms: searchParams.get("bathrooms") || "",
		isFeatured: searchParams.get("isFeatured") || "",
		sort: searchParams.get("sort") || "newest",
		page: Number(searchParams.get("page")) || 1,
	});

	const queryParams = Object.fromEntries(
		Object.entries(filters).filter(([, v]) => v !== "" && v !== 0),
	);

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["properties", queryParams],
		queryFn: () => propertyAPI.getAll(queryParams).then((r) => r.data),
		keepPreviousData: true,
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
	});

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
	};

	const clearFilters = () => {
		setFilters({
			purpose: "",
			type: "",
			city: "",
			keyword: "",
			minPrice: "",
			maxPrice: "",
			minArea: "",
			maxArea: "",
			areaUnit: "",
			bedrooms: "",
			bathrooms: "",
			isFeatured: "",
			sort: "newest",
			page: 1,
		});
	};

	useEffect(() => {
		const p = new URLSearchParams();
		Object.entries(filters).forEach(([k, v]) => {
			if (v) p.set(k, v);
		});
		setSearchParams(p);
	}, [filters]);

	const activeFiltersCount = [
		filters.purpose,
		filters.type,
		filters.minPrice,
		filters.maxPrice,
		filters.minArea,
		filters.bedrooms,
		filters.bathrooms,
		filters.isFeatured,
	].filter(Boolean).length;

	return (
		<>
			<Helmet>
				<title>Properties for Sale & Rent in Peshawar | BSK Groups</title>
			</Helmet>

			{/* Page Header */}
			<div className={styles.pageHeader}>
				<div className={styles.container}>
					<h1 className={styles.pageTitle}>
						Properties {filters.city ? `in ${filters.city}` : ""}
					</h1>
					<p className={styles.pageSubtitle}>
						{data?.total || 0} properties found
					</p>
				</div>
			</div>

			{/* Page Body */}
			<div className={styles.pageContainer}>
				<div className={styles.container}>
					{/* Toolbar */}
					<div className={styles.toolbar}>
						{/* Left Section */}
						<div className={styles.toolbarLeft}>
							{/* Filter Button */}
							<button
								className={`${styles.filterButton} ${activeFiltersCount > 0 ? styles.filterButtonActive : ""}`}
								onClick={() => setShowFilters(!showFilters)}
							>
								<SlidersHorizontal size={20} className="shrink-0" />
								<span className="hidden sm:inline">Advanced Filters</span>
								<span className="sm:hidden">Filters</span>
								{activeFiltersCount > 0 && (
									<span className={styles.filterBadge}>
										{activeFiltersCount}
									</span>
								)}
							</button>

							{/* Reset & Purpose Tabs */}
							<div className={styles.toolbarLeft}>
								{activeFiltersCount > 0 && (
									<>
										<button
											className={styles.resetButton}
											onClick={clearFilters}
										>
											<X size={18} /> Reset
										</button>
										<div className={styles.divider} />
									</>
								)}
								{/* Quick purpose tabs */}
								<div className={styles.purposeTabs}>
									{["", "sale", "rent", "lease"].map((p) => (
										<button
											key={p}
											className={`${styles.purposeTab} ${filters.purpose === p ? styles.purposeTabActive : ""}`}
											onClick={() => updateFilter("purpose", p)}
										>
											{p === "" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Right Section */}
						<div className={styles.toolbarRight}>
							{/* Sort Dropdown */}
							<div className={styles.sortSection}>
								<span className={styles.sortLabel}>Sort:</span>
								<select
									className={styles.sortSelect}
									value={filters.sort}
									onChange={(e) => updateFilter("sort", e.target.value)}
								>
									{SORTS.map((s) => (
										<option key={s.value} value={s.value}>
											{s.label}
										</option>
									))}
								</select>
							</div>

							{/* View Toggle */}
							<div className={styles.viewToggle}>
								<button
									className={`${styles.viewButton} ${viewMode === "grid" ? styles.viewButtonActive : ""}`}
									onClick={() => setViewMode("grid")}
									aria-label="Grid view"
								>
									<Grid3X3 size={20} />
								</button>
								<button
									className={`${styles.viewButton} ${viewMode === "list" ? styles.viewButtonActive : ""}`}
									onClick={() => setViewMode("list")}
									aria-label="List view"
								>
									<List size={20} />
								</button>
							</div>
						</div>
					</div>

					{/* Filters Panel */}
					{showFilters && (
						<div className={styles.filtersPanel}>
							{/* Panel Header */}
							<div className={styles.filtersPanelHeader}>
								<h3 className={styles.filtersPanelTitle}>
									Advanced Filters
								</h3>
								<button
									onClick={() => setShowFilters(false)}
									className={styles.closeButton}
									aria-label="Close filters"
								>
									<X size={24} />
								</button>
							</div>

							{/* Filter Grid */}
							<div className={styles.filterGrid}>
								{/* Property Type */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Property Type
									</label>
									<select
										className={styles.filterSelect}
										value={filters.type}
										onChange={(e) => updateFilter("type", e.target.value)}
									>
										<option value="">All Types</option>
										{TYPES.map((t) => (
											<option key={t} value={t}>
												{t.charAt(0).toUpperCase() + t.slice(1)}
											</option>
										))}
									</select>
								</div>

								{/* City */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										City
									</label>
									<select
										className={styles.filterSelect}
										value={filters.city}
										onChange={(e) => updateFilter("city", e.target.value)}
									>
										<option value="">All Cities</option>
										{CITIES.map((c) => (
											<option key={c} value={c}>
												{c}
											</option>
										))}
									</select>
								</div>

								{/* Min Price */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Min Price (PKR)
									</label>
									<input
										type="number"
										className={styles.filterInput}
										placeholder="Min Price"
										value={filters.minPrice}
										onChange={(e) => updateFilter("minPrice", e.target.value)}
									/>
								</div>

								{/* Max Price */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Max Price (PKR)
									</label>
									<input
										type="number"
										className={styles.filterInput}
										placeholder="Max Price"
										value={filters.maxPrice}
										onChange={(e) => updateFilter("maxPrice", e.target.value)}
									/>
								</div>

								{/* Min Area */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Min Area
									</label>
									<input
										type="number"
										className={styles.filterInput}
										placeholder="Min Area"
										value={filters.minArea}
										onChange={(e) => updateFilter("minArea", e.target.value)}
									/>
								</div>

								{/* Area Unit */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Area Unit
									</label>
									<select
										className={styles.filterSelect}
										value={filters.areaUnit}
										onChange={(e) => updateFilter("areaUnit", e.target.value)}
									>
										<option value="">Any Unit</option>
										{AREAS.map((a) => (
											<option key={a} value={a}>
												{a.toUpperCase()}
											</option>
										))}
									</select>
								</div>

								{/* Bedrooms */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Bedrooms
									</label>
									<select
										className={styles.filterSelect}
										value={filters.bedrooms}
										onChange={(e) => updateFilter("bedrooms", e.target.value)}
									>
										<option value="">Any</option>
										{[1, 2, 3, 4, 5, 6].map((n) => (
											<option key={n} value={n}>
												{n}+
											</option>
										))}
									</select>
								</div>

								{/* Keyword Search */}
								<div className={styles.filterGroup}>
									<label className={styles.filterLabel}>
										Keyword
									</label>
									<div className={styles.searchWrapper}>
										<Search
											size={20}
											className={styles.searchIcon}
										/>
										<input
											type="text"
											className={styles.searchInput}
											placeholder="Search location..."
											value={filters.keyword}
											onChange={(e) => updateFilter("keyword", e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Results Grid/List */}
					<div
						className={`min-h-[400px] ${viewMode === "list"
								? "flex flex-col gap-4 md:gap-5 lg:gap-6"
								: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
							}`}
					>
						{isLoading || isFetching ? (
							// Loading Skeletons
							Array(8)
								.fill(0)
								.map((_, i) => (
									<div
										key={i}
										className={`${viewMode === "list"
												? "h-48 md:h-56"
												: "h-80 md:h-[360px] lg:h-[400px]"
											} bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] rounded-xl animate-[shimmer_1.5s_infinite]`}
									/>
								))
						) : data?.properties?.length > 0 ? (
							// Property Cards
							data.properties.map((p) => (
								<PropertyCard
									key={p._id}
									property={p}
									horizontal={viewMode === "list"}
								/>
							))
						) : (
							// Empty State
							<div className="col-span-full text-center py-12 md:py-16 lg:py-20 px-4">
								<Search
									size={48}
									className="mx-auto mb-4 opacity-20 text-gray-400"
								/>
								<h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
									No properties found
								</h3>
								<p className="text-sm md:text-base text-gray-500 mb-6 max-w-md mx-auto">
									Try adjusting your filters or search a different location.
								</p>
								<button
									className="bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg"
									onClick={clearFilters}
								>
									Clear All Filters
								</button>
							</div>
						)}
					</div>

					{/* Pagination */}
					{data?.pages > 1 && (
						<div className="flex justify-center items-center gap-2 md:gap-3 mt-8 md:mt-10 lg:mt-12 flex-wrap">
							{/* Previous Button */}
							<button
								className={`px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg text-xs md:text-sm font-semibold bg-white cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700`}
								disabled={filters.page === 1}
								onClick={() => updateFilter("page", filters.page - 1)}
							>
								<span className="hidden sm:inline">← Previous</span>
								<span className="sm:hidden">←</span>
							</button>

							{/* Page Numbers */}
							<div className="flex gap-1 md:gap-2 overflow-x-auto max-w-full scrollbar-hide">
								{Array.from(
									{ length: Math.min(data.pages, 7) },
									(_, i) => i + 1,
								).map((p) => (
									<button
										key={p}
										className={`min-w-[36px] md:min-w-[40px] px-3 md:px-4 py-2 md:py-2.5 border-2 rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-all duration-200 ${p === filters.page
												? "bg-primary border-primary text-white shadow-md"
												: "bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
											}`}
										onClick={() => updateFilter("page", p)}
									>
										{p}
									</button>
								))}
								{data.pages > 7 && filters.page < data.pages - 3 && (
									<>
										<span className="px-2 py-2 text-gray-400 text-sm">...</span>
										<button
											className="min-w-[36px] md:min-w-[40px] px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg text-xs md:text-sm font-semibold bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary"
											onClick={() => updateFilter("page", data.pages)}
										>
											{data.pages}
										</button>
									</>
								)}
							</div>

							{/* Next Button */}
							<button
								className={`px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg text-xs md:text-sm font-semibold bg-white cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700`}
								disabled={filters.page === data.pages}
								onClick={() => updateFilter("page", filters.page + 1)}
							>
								<span className="hidden sm:inline">Next →</span>
								<span className="sm:hidden">→</span>
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Shimmer Animation Styles */}
			<style>{`
				@keyframes shimmer {
					0% {
						background-position: 200% 0;
					}
					100% {
						background-position: -200% 0;
					}
				}
				
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</>
	);
}
