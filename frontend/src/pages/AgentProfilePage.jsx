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

/* ── Professional Dummy Agents (Same as AgentsPage for parity) ── */
const DUMMY_AGENTS = {
	"agent-1": { name: "Zarak Khan", phone: "+92 300 8585123", email: "zarak.khan@bskgroups.com", city: "Peshawar", listingsCount: 18, online: true, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=512&h=512", role: "Executive Partner", dealsClosed: 142, experience: "12 Years", bio: "Leading expert in commercial and residential developments across KPK." },
	"agent-2": { name: "Mehwish Bangash", phone: "+92 321 9988771", email: "mehwish.b@bskgroups.com", city: "Peshawar", listingsCount: 12, online: true, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=512&h=512", role: "Senior Consultant", dealsClosed: 89, experience: "8 Years", bio: "Specializing in luxury villas and residential plots in Hayatabad." },
	"agent-3": { name: "Hamza Durrani", phone: "+92 333 4445556", email: "hamza.d@bskgroups.com", city: "Islamabad", listingsCount: 25, online: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=512&h=512", role: "Regional Manager", dealsClosed: 210, experience: "15 Years", bio: "Managing BSK's expansion into the capital's premium sectors." },
	"agent-4": { name: "Sana Afridi", phone: "+92 345 1112233", email: "sana.afridi@bskgroups.com", city: "Peshawar", listingsCount: 9, online: true, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=512&h=512", role: "Property Specialist", dealsClosed: 34, experience: "4 Years", bio: "Dedicated to finding the perfect family homes in Peshawar's suburbs." },
	"agent-5": { name: "Salman Yousafzai", phone: "+92 311 5556677", email: "salman.y@bskgroups.com", city: "Peshawar", listingsCount: 21, online: false, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=512&h=512", role: "Investment Advisor", dealsClosed: 115, experience: "10 Years", bio: "Expert in high-yield commercial investments and portfolio management." },
	"agent-6": { name: "Zoya Shah", phone: "+92 301 2233445", email: "zoya.shah@bskgroups.com", city: "Mardan", listingsCount: 14, online: true, avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=512&h=512", role: "Residential Expert", dealsClosed: 67, experience: "7 Years", bio: "Focused on providing top-tier residential solutions in Mardan and surrounding areas." },
	"agent-7": { name: "Asfandiyar Wali", phone: "+92 305 7788990", email: "asfand@bskgroups.com", city: "Peshawar", listingsCount: 32, online: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=512&h=512", role: "Director of Sales", dealsClosed: 420, experience: "20 Years", bio: "Veteran sales leader with an unparalleled track record in Peshawar real estate." },
	"agent-8": { name: "Khadija Bibi", phone: "+92 322 1122334", email: "khadija@bskgroups.com", city: "Nowshera", listingsCount: 7, online: true, avatar: "https://images.unsplash.com/photo-1598550874175-4d0fe4a2c90d?auto=format&fit=crop&w=512&h=512", role: "Client Success Manager", dealsClosed: 28, experience: "3 Years", bio: "Ensuring every client finds their dream home with a seamless transaction experience." },
};

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

	/* Fallback logic */
	const agentData = data?.agent || DUMMY_AGENTS[id] || DUMMY_AGENTS["agent-1"];
	const properties = data?.properties || [];

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
