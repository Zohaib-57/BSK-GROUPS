import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import {
	Phone,
	Mail,
	Calendar,
	Building2,
	MessageCircle,
	MapPin,
	Star,
	ChevronLeft,
	ShieldCheck,
	CheckCircle2,
	TrendingUp,
	ArrowLeft
} from "lucide-react";
import styles from "./AgentProfilePage.module.css";



export default function AgentProfilePage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data, isLoading } = useQuery({
		queryKey: ["agent", id],
		queryFn: () =>
			api
				.get(`/agents/${id}`)
				.then((r) => r.data)
				.catch(() => null),
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#f8fafc]">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	const agentData = data?.agent;
	const properties = data?.properties || [];

	if (!agentData) {
		return <div className="p-20 text-center text-gray-500">Agent not found</div>;
	}

	// Prevent showing admin
	if (agentData.role === 'admin') {
		return <div className="p-20 text-center text-gray-500">Access Restricted</div>;
	}

	return (
		<div className={styles.profileContainer}>
			<Helmet>
				<title>{agentData.name} | Elite Partner | BSK Groups</title>
			</Helmet>

			{/* Hero Section */}
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<div className={styles.avatarWrapper}>
						{agentData.avatar ? (
							<img loading="lazy" src={agentData.avatar} alt={agentData.name} className={styles.avatar} />
						) : (
							<div className={styles.avatarPlaceholder}>{agentData.name?.[0]}</div>
						)}
						{agentData.online && <span className={styles.onlineBadge}>Active Now</span>}
					</div>

					<div className={styles.agentInfo}>
						<div className={styles.verifiedBadge}>
							<ShieldCheck size={14} /> BSK Verified Professional
						</div>
						<h1 className={styles.name}>{agentData.name}</h1>
						<p className={styles.role}>{agentData.role || "Property Consultant"}</p>
						
						<div className={styles.metaGrid}>
							<div className={styles.metaItem}>
								<MapPin size={18} /> {agentData.city}
							</div>
							<div className={styles.metaItem}>
								<Calendar size={18} /> Since {new Date(agentData.createdAt || "2020-01-01").getFullYear()}
							</div>
							<div className={styles.metaItem}>
								<TrendingUp size={18} /> {agentData.experience || "5+ Years"} Experience
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Layout */}
			<div className={styles.mainLayout}>
				{/* Sidebar */}
				<aside className={styles.sidebar}>
					<div className={styles.sideCard}>
						<h3 className={styles.sideTitle}>Direct Contact</h3>
						<div className={styles.contactList}>
							<a href={`tel:${agentData.phone}`} className={`${styles.contactBtn} ${styles.btnPhone}`}>
								<Phone size={18} /> Call Professional
							</a>
							<a href={`https://wa.me/${agentData.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={`${styles.contactBtn} ${styles.btnWA}`}>
								<MessageCircle size={18} /> WhatsApp
							</a>
							<a href={`mailto:${agentData.email}`} className={`${styles.contactBtn} ${styles.btnEmail}`}>
								<Mail size={18} /> Send Message
							</a>
						</div>
					</div>

					<div className={styles.sideCard}>
						<h3 className={styles.sideTitle}>Performance</h3>
						<div className={styles.statRow}>
							<div className={styles.statBox}>
								<span className={styles.statNum}>{properties.length || agentData.listingsCount || 0}</span>
								<span className={styles.statLabel}>Active</span>
							</div>
							<div className={styles.statBox}>
								<span className={styles.statNum}>{agentData.dealsClosed || 42}</span>
								<span className={styles.statLabel}>Closed</span>
							</div>
						</div>
					</div>
				</aside>

				{/* Content */}
				<main className={styles.content}>
					<div className={styles.listingsHeader}>
						<h2 className={styles.sectionTitle}>
							<Building2 size={24} className="text-primary" />
							Premium Listings
						</h2>
					</div>

					{properties.length > 0 ? (
						<div className={styles.propertyGrid}>
							{properties.map((p) => (
								<PropertyCard key={p._id} property={p} />
							))}
						</div>
					) : (
						<div className={styles.emptyState}>
							<Building2 size={48} className={styles.emptyIcon} />
							<p className={styles.emptyText}>No active listings currently available.</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
