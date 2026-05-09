import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { userAPI } from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import { Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./UserDashboard.module.css";

export default function SavedPropertiesPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["saved-properties"],
		queryFn: () => userAPI.getSavedProperties().then((r) => r.data),
	});

	return (
		<div className={styles.animateFade}>
			<Helmet>
				<title>Saved Properties | BSK Groups</title>
			</Helmet>

			<div className={styles.container}>
				{/* Header */}
				<header className={styles.header}>
					<div className={styles.headerContent}>
						<h1 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							<Heart size={28} className="text-red-500" fill="#ef4444" />
							Your Collection
						</h1>
						<p className={styles.subtitle}>
							{data?.properties?.length || 0} properties saved in your personal watchlist.
						</p>
					</div>
					<Link to="/properties" className={`${styles.btn} ${styles.btnOutline}`}>
						<Search size={18} /> <span>Find More</span>
					</Link>
				</header>

				{/* Loading State */}
				{isLoading ? (
					<div className={styles.emptyState}>
						<div className={styles.spinner} style={{ width: '40px', height: '40px', border: '3px solid #ddd', borderTopColor: 'var(--ud-brand)' }} />
						<p>Loading your collection...</p>
					</div>
				) : data?.properties?.length > 0 ? (
					/* Properties Grid */
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{data.properties.map((p) => (
							<PropertyCard key={p._id} property={p} />
						))}
					</div>
				) : (
					/* Empty State */
					<div className={styles.section}>
						<div className={styles.emptyState}>
							<Heart size={64} className={styles.emptyIcon} />
							<h2 className={styles.sectionTitle} style={{ fontSize: '24px' }}>
								Your collection is empty
							</h2>
							<p style={{ maxWidth: '400px', margin: '0 auto 16px' }}>
								Explore Peshawar&apos;s finest properties and click the heart icon to save them here for quick access later.
							</p>
							<Link to="/properties" className={`${styles.btn} ${styles.btnPrimary}`}>
								Explore Properties
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
