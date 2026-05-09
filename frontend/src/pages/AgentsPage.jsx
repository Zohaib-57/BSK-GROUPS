import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";
import { Phone, Mail, Building2, MapPin, ChevronRight, Users, Star, ShieldCheck } from "lucide-react";
import styles from "./AgentsPage.module.css";

/* ── Professional Dummy Agents (Luxury Editorial) ── */
const DUMMY_AGENTS = [
	{
		_id: "agent-1",
		name: "Zarak Khan",
		phone: "+92 300 8585123",
		email: "zarak.khan@bskgroups.com",
		city: "Peshawar",
		listingsCount: 18,
		online: true,
		avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256",
		role: "Executive Partner"
	},
	{
		_id: "agent-2",
		name: "Mehwish Bangash",
		phone: "+92 321 9988771",
		email: "mehwish.b@bskgroups.com",
		city: "Peshawar",
		listingsCount: 12,
		online: true,
		avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256",
		role: "Senior Consultant"
	},
	{
		_id: "agent-3",
		name: "Hamza Durrani",
		phone: "+92 333 4445556",
		email: "hamza.d@bskgroups.com",
		city: "Islamabad",
		listingsCount: 25,
		online: false,
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256",
		role: "Regional Manager"
	},
	{
		_id: "agent-4",
		name: "Sana Afridi",
		phone: "+92 345 1112233",
		email: "sana.afridi@bskgroups.com",
		city: "Peshawar",
		listingsCount: 9,
		online: true,
		avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256",
		role: "Property Specialist"
	},
	{
		_id: "agent-5",
		name: "Salman Yousafzai",
		phone: "+92 311 5556677",
		email: "salman.y@bskgroups.com",
		city: "Peshawar",
		listingsCount: 21,
		online: false,
		avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256",
		role: "Investment Advisor"
	},
	{
		_id: "agent-6",
		name: "Zoya Shah",
		phone: "+92 301 2233445",
		email: "zoya.shah@bskgroups.com",
		city: "Mardan",
		listingsCount: 14,
		online: true,
		avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256",
		role: "Residential Expert"
	},
	{
		_id: "agent-7",
		name: "Asfandiyar Wali",
		phone: "+92 305 7788990",
		email: "asfand@bskgroups.com",
		city: "Peshawar",
		listingsCount: 32,
		online: true,
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256",
		role: "Director of Sales"
	},
	{
		_id: "agent-8",
		name: "Khadija Bibi",
		phone: "+92 322 1122334",
		email: "khadija@bskgroups.com",
		city: "Nowshera",
		listingsCount: 7,
		online: true,
		avatar: "https://images.unsplash.com/photo-1598550874175-4d0fe4a2c90d?auto=format&fit=crop&w=256&h=256",
		role: "Client Success Manager"
	}
];

export default function AgentsPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["agents"],
		queryFn: () => api.get("/agents").then((r) => r.data),
	});

	/* Filter out admin and merge with dummy */
	const realAgents = data?.agents?.filter((a) => a.role !== "admin") || [];
	const agentList = !isLoading && realAgents.length > 0 ? realAgents : DUMMY_AGENTS;

	const totalListings = agentList.reduce(
		(sum, a) => sum + (a.listingsCount ?? 0),
		0
	);

	return (
		<div className={styles.agentsContainer}>
			<Helmet>
				<title>Our Elite Agents | BSK Groups</title>
			</Helmet>

			{/* Hero Section */}
			<section className={styles.hero}>
				<div className={styles.heroBadge}>
					<ShieldCheck size={14} /> BSK Groups Platinum Network
				</div>
				<h1 className={styles.heroTitle}>
					Partner with <span>Excellence</span>.
				</h1>
				<p className={styles.heroSub}>
					Our elite network of real estate professionals combines local expertise with global standards to deliver unparalleled property services.
				</p>
				
				<div className={styles.statsGrid}>
					<div className={styles.statItem}>
						<span className={styles.statValue}>{agentList.length}+</span>
						<span className={styles.statLabel}>Expert Agents</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNum}>{totalListings}+</span>
						<span className={styles.statValue}>{totalListings}</span>
						<span className={styles.statLabel}>Properties Listed</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statValue}>100%</span>
						<span className={styles.statLabel}>Verified Profiles</span>
					</div>
				</div>
			</section>

			{/* Grid Section */}
			<section className={styles.contentArea}>
				<div className={styles.gridHeader}>
					<h2 className={styles.gridTitle}>
						<Users size={24} className="text-primary" />
						Professional Directory
					</h2>
					<span className={styles.gridCount}>
						Showing {agentList.length} Elite Professionals
					</span>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-20">
						<div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
					</div>
				) : (
					<div className={styles.agentsGrid}>
						{agentList.map((agent) => (
							<Link
								key={agent._id}
								to={`/agents/${agent._id}`}
								className={styles.agentCard}
							>
								<div className={styles.cardHeader}>
									<div className={styles.avatarWrapper}>
										{agent.avatar ? (
											<img
												src={agent.avatar}
												alt={agent.name}
												className={styles.avatar}
											/>
										) : (
											<div className={styles.avatarPlaceholder}>
												{agent.name?.[0]?.toUpperCase()}
											</div>
										)}
										{agent.online && <span className={styles.onlineBadge} />}
									</div>
									<h3 className={styles.agentName}>{agent.name}</h3>
									<p className={styles.agentRole}>{agent.role || "Property Expert"}</p>
									<div className={styles.agentCity}>
										<MapPin size={14} className="text-primary" /> {agent.city}
									</div>
								</div>

								<div className={styles.cardBody}>
									<div className={styles.contactItem}>
										<Phone size={14} />
										{agent.phone}
									</div>
									<div className={styles.contactItem}>
										<Mail size={14} />
										{agent.email}
									</div>
								</div>

								<div className={styles.cardFooter}>
									<div className={styles.listingStats}>
										<Building2 size={16} />
										<span>{agent.listingsCount ?? 0}</span> Active Listings
									</div>
									<div className={styles.viewProfile}>
										View Profile <ChevronRight size={16} />
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
