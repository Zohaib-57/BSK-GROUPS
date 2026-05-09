import { Helmet } from "react-helmet-async";
import { Users, Target, Shield, Award, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import styles from "./AboutPage.module.css";

const TEAM_MEMBERS = [
	{
		name: "Arsalan Khan",
		role: "Founder & CEO",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
	},
	{
		name: "Zainab Ahmed",
		role: "Head of Operations",
		image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
	},
	{
		name: "Bilal Sheikh",
		role: "Principal Architect",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
	},
	{
		name: "Maria Gul",
		role: "Senior Consultant",
		image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
	}
];

const CORE_VALUES = [
	{
		icon: <Shield size={24} />,
		title: "Unwavering Trust",
		text: "We believe in complete transparency and integrity in every transaction, ensuring our clients feel secure throughout their journey."
	},
	{
		icon: <Target size={24} />,
		title: "Strategic Innovation",
		text: "Utilizing advanced data and technology to provide the most accurate market insights and property valuations in Peshawar."
	},
	{
		icon: <Users size={24} />,
		title: "Client-Centricity",
		text: "Your goals are our priority. We tailor our services to meet the unique needs of every individual, family, and investor."
	},
	{
		icon: <Award size={24} />,
		title: "Excellence in Service",
		text: "From initial consultation to final handover, we maintain the highest standards of professional excellence and care."
	},
	{
		icon: <MapPin size={24} />,
		title: "Local Expertise",
		text: "Deeply rooted in Peshawar, we possess unmatched knowledge of local neighborhoods, trends, and legal procedures."
	},
	{
		icon: <CheckCircle2 size={24} />,
		title: "Quality Assurance",
		text: "Every property we list undergoes a rigorous verification process to ensure it meets our quality and legal standards."
	}
];

export default function AboutPage() {
	return (
		<>
			<Helmet>
				<title>About Us | BSK Groups - Real Estate Excellence</title>
			</Helmet>

			<div className={styles.pageContainer}>
				{/* Hero Section */}
				<section className={styles.hero}>
					<div className={styles.container}>
						<span className={styles.heroTagline}>Est. 2015</span>
						<h1 className={styles.heroTitle}>
							Redefining the Real Estate Landscape of Peshawar.
						</h1>
					</div>
				</section>

				{/* Stats Section */}
				<div className={styles.statsSection}>
					<div className={styles.container}>
						<div className={styles.statsGrid}>
							<div className={styles.statCard}>
								<span className={styles.statNumber}>1.2K+</span>
								<span className={styles.statLabel}>Properties Sold</span>
							</div>
							<div className={styles.statCard}>
								<span className={styles.statNumber}>500+</span>
								<span className={styles.statLabel}>Happy Families</span>
							</div>
							<div className={styles.statCard}>
								<span className={styles.statNumber}>9+</span>
								<span className={styles.statLabel}>Years Experience</span>
							</div>
							<div className={styles.statCard}>
								<span className={styles.statNumber}>15+</span>
								<span className={styles.statLabel}>Awards Won</span>
							</div>
						</div>
					</div>
				</div>

				{/* Story Section */}
				<section className="py-20">
					<div className={styles.container}>
						<div className={styles.storyGrid}>
							<div className={styles.storyImageWrapper}>
								<img loading="lazy" 
									src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
									alt="BSK Groups Office" 
									className={styles.storyImage}
								/>
							</div>
							<div className={styles.storyContent}>
								<span className={styles.sectionLabel}>Our Story</span>
								<h2 className={styles.sectionTitle}>
									A Legacy of Trust and Architectural Vision.
								</h2>
								<p className={styles.storyText}>
									Founded in 2015, BSK Groups began with a simple yet ambitious vision: 
									to bring professional standards and transparency to the real estate market of Peshawar. 
									What started as a small consultancy has grown into a leading force in the city's 
									urban development.
								</p>
								<p className={styles.storyText}>
									We don't just deal in square footage; we deal in dreams, stability, and legacy. 
									Whether it's helping a first-time buyer find their perfect home or advising 
									institutional investors on large-scale developments, our approach remains the 
									same: expertise combined with empathy.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Values Section */}
				<section className={styles.valuesSection}>
					<div className={styles.container}>
						<div className="text-center mb-16">
							<span className={styles.sectionLabel}>Our Values</span>
							<h2 className={styles.sectionTitle}>The Pillars of Our Success</h2>
						</div>
						<div className={styles.valuesGrid}>
							{CORE_VALUES.map((value, index) => (
								<div key={index} className={styles.valueCard}>
									<div className={styles.valueIcon}>{value.icon}</div>
									<h3 className={styles.valueTitle}>{value.title}</h3>
									<p className={styles.valueText}>{value.text}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Team Section */}
				<section className="py-20">
					<div className={styles.container}>
						<div className="text-center mb-16">
							<span className={styles.sectionLabel}>Our Leadership</span>
							<h2 className={styles.sectionTitle}>Meet the Minds Behind BSK</h2>
						</div>
						<div className={styles.teamGrid}>
							{TEAM_MEMBERS.map((member, index) => (
								<div key={index} className={styles.teamCard}>
									<div className={styles.teamImageWrapper}>
										<img loading="lazy" src={member.image} alt={member.name} className={styles.teamImage} />
									</div>
									<h3 className={styles.teamName}>{member.name}</h3>
									<span className={member.role}>{member.role}</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
