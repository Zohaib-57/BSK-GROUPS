import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";
import { Phone, Mail, Building2, MapPin, ChevronRight, Users, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import styles from "./AgentsPage.module.css";



export default function AgentsPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["agents"],
		queryFn: () => api.get("/agents").then((r) => r.data),
	});

	const agentList = data?.agents?.filter((a) => a.role !== "admin") || [];

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
									<h3 className={styles.agentName}>
										{agent.name}
										{agent.isVerified && <CheckCircle2 size={16} className={styles.verifiedIcon} />}
									</h3>
									<p className={styles.agentRole}>{agent.role || "Property Expert"}</p>
									{agent.isOfficialAgent && (
										<div className={styles.officialBadge}>
											Official BSK Partner
										</div>
									)}
									<div className={styles.agentCity}>
										<MapPin size={14} className="text-primary" /> {agent.city || "Pakistan"}
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
						{agentList.length === 0 && (
							<div className="col-span-full py-12 text-center text-gray-500">
								No agents available at the moment.
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	);
}
