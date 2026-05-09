import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { propertyAPI } from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import {
	MapPin,
	Bed,
	Bath,
	Square,
	Phone,
	Mail,
	MessageCircle,
	Calendar,
	CheckCircle2,
	Building2,
	Share2,
	Heart,
	ArrowLeft,
	ShieldCheck,
	Info
} from "lucide-react";
import styles from "./PropertyDetail.module.css";
import toast from "react-hot-toast";

/* ── Fallback Agent (Zarak Khan) ── */
const FALLBACK_AGENT = {
	name: "Zarak Khan",
	role: "Executive Partner",
	phone: "+92 300 8585123",
	email: "zarak.khan@bskgroups.com",
	avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256"
};

export default function PropertyDetailPage() {
	const { slug } = useParams();

	const { data, isLoading } = useQuery({
		queryKey: ["property", slug],
		queryFn: () => propertyAPI.getBySlug(slug).then((r) => r.data),
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#f8fafc]">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	const property = data?.property;
	const similar = data?.similar || [];

	if (!property) {
		return <div className="p-20 text-center text-gray-500">Property not found.</div>;
	}

	/* Use assigned agent or fallback if it's admin */
	const displayAgent = (property.agent && property.agent.role !== 'admin') 
		? property.agent 
		: (property.postedBy && property.postedBy.role !== 'admin')
			? property.postedBy
			: FALLBACK_AGENT;

	const formatPrice = (price) => {
		if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
		if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
		return price.toLocaleString();
	};

	return (
		<div className={styles.detailContainer}>
			<Helmet>
				<title>{property.title} | BSK Groups Peshawar</title>
				<meta name="description" content={property.description?.substring(0, 160)} />
			</Helmet>

			{/* Gallery Section */}
			<section className={styles.gallerySection}>
				<div className={styles.galleryContainer}>
					<img loading="lazy" 
						src={property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6199f7c009?auto=format&fit=crop&w=1200&h=800"} 
						alt={property.title} 
						className={styles.mainImage} 
					/>
					<div className={styles.sideImages}>
						<img loading="lazy" src={property.images?.[1] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400"} alt="View 2" className={styles.sideImage} />
						<img loading="lazy" src={property.images?.[2] || "https://images.unsplash.com/photo-1600607687940-477a284e68c6?auto=format&fit=crop&w=600&h=400"} alt="View 3" className={styles.sideImage} />
					</div>
				</div>
			</section>

			{/* Header Section */}
			<section className={styles.headerSection}>
				<div className={styles.headerContainer}>
					<div className={styles.badgeRow}>
						<span className={`${styles.badge} ${styles.badgePrimary}`}>{property.purpose}</span>
						<span className={`${styles.badge} ${styles.badgeSecondary}`}>{property.type}</span>
						{property.isVerified && <span className={`${styles.badge} ${styles.badgePrimary}`}><CheckCircle2 size={12} className="inline mr-1" /> Verified</span>}
					</div>

					<div className={styles.titleRow}>
						<div>
							<h1 className={styles.title}>{property.title}</h1>
							<div className={styles.address}>
								<MapPin size={18} className="text-primary" />
								{property.location?.address}, {property.location?.city}
							</div>
						</div>
						<div className={styles.priceColumn}>
							<span className={styles.priceLabel}>Asking Price</span>
							<div className={styles.priceValue}>PKR {formatPrice(property.price)}</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<div className={styles.mainLayout}>
				{/* Left Column */}
				<main>
					{/* Features Bar */}
					<div className={styles.detailsCard}>
						<h2 className={styles.sectionTitle}><Info size={20} /> Property Overview</h2>
						<div className={styles.featuresGrid}>
							<div className={styles.featureItem}>
								<div className={styles.featureIcon}><Bed size={20} /></div>
								<div>
									<span className="block text-xs text-gray-400 uppercase">Bedrooms</span>
									{property.bedrooms}
								</div>
							</div>
							<div className={styles.featureItem}>
								<div className={styles.featureIcon}><Bath size={20} /></div>
								<div>
									<span className="block text-xs text-gray-400 uppercase">Bathrooms</span>
									{property.bathrooms}
								</div>
							</div>
							<div className={styles.featureItem}>
								<div className={styles.featureIcon}><Square size={20} /></div>
								<div>
									<span className="block text-xs text-gray-400 uppercase">Area</span>
									{property.area?.value} {property.area?.unit}
								</div>
							</div>
							<div className={styles.featureItem}>
								<div className={styles.featureIcon}><Calendar size={20} /></div>
								<div>
									<span className="block text-xs text-gray-400 uppercase">Posted</span>
									{new Date(property.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>

					{/* Description */}
					<div className={styles.detailsCard}>
						<h2 className={styles.sectionTitle}>Description</h2>
						<p className={styles.description}>{property.description}</p>
					</div>
				</main>

				{/* Right Column - Agent Sidebar */}
				<aside className={styles.sidebar}>
					<div className={styles.agentCard}>
						<div className={styles.agentHeader}>
							<img loading="lazy" 
								src={displayAgent.avatar || "https://ui-avatars.com/api/?name=" + displayAgent.name} 
								alt={displayAgent.name} 
								className={styles.agentAvatar} 
							/>
							<h3 className={styles.agentName}>{displayAgent.name}</h3>
							<p className={styles.agentRole}>{displayAgent.role || "Property Expert"}</p>
						</div>

						<div className={styles.contactButtons}>
							<a href={`tel:${displayAgent.phone}`} className={`${styles.contactBtn} ${styles.btnPrimary}`}>
								<Phone size={18} /> Call Agent
							</a>
							<a href={`https://wa.me/${displayAgent.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={`${styles.contactBtn} ${styles.btnSecondary}`}>
								<MessageCircle size={18} /> WhatsApp
							</a>
							<a href={`mailto:${displayAgent.email}`} className={`${styles.contactBtn} ${styles.btnSecondary}`}>
								<Mail size={18} /> Email Message
							</a>
						</div>
						
						<div className="mt-8 pt-6 border-t border-white/10 text-center">
							<div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
								<ShieldCheck size={14} /> BSK Secure Transaction
							</div>
						</div>
					</div>
				</aside>
			</div>

			{/* Similar Properties */}
			{similar.length > 0 && (
				<section className="max-w-1200 mx-auto px-6 py-20">
					<h2 className="text-2xl font-800 text-secondary mb-8">Similar Listings</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{similar.map(p => (
							<PropertyCard key={p._id} property={p} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
