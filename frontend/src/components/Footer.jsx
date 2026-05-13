import { Link } from "react-router-dom";
import {
	MapPin, Phone, Mail,
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import styles from "./Footer.module.css";

const NAV_PROPERTIES = [
	{ label: "Homes for Sale", to: "/properties?purpose=sale" },
	{ label: "Homes for Rent", to: "/properties?purpose=rent" },
	{ label: "Plots", to: "/properties?type=plot" },
	{ label: "Commercial", to: "/properties?type=commercial" },
	{ label: "Apartments", to: "/properties?type=apartment" },
	{ label: "Featured Properties", to: "/properties?isFeatured=true" },
];

const NAV_AREAS = [
	{ label: "DHA Peshawar", to: "/properties?city=Peshawar&area=DHA" },
	{ label: "Hayatabad", to: "/properties?city=Peshawar&society=Hayatabad" },
	{ label: "University Town", to: "/properties?city=Peshawar&area=University Town" },
	{ label: "Saddar", to: "/properties?city=Peshawar&area=Saddar" },
	{ label: "Gulbahar", to: "/properties?city=Peshawar&area=Gulbahar" },
	{ label: "Ring Road", to: "/properties?city=Peshawar&area=Ring Road" },
];

const SOCIALS = [
	{
		icon: FaInstagram,
		label: "Instagram",
		href: "https://instagram.com/bskgroups",
		brandColor: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
		isGradient: true
	},
	{
		icon: FaTiktok,
		label: "TikTok",
		href: "https://tiktok.com/@bskgroups",
		brandColor: "#000000"
	},
	{
		icon: FaYoutube,
		label: "YouTube",
		href: "https://youtube.com/@bskgroups",
		brandColor: "#FF0000"
	},
	{
		icon: FaFacebook,
		label: "Facebook",
		href: "https://facebook.com/bskgroups",
		brandColor: "#1877F2"
	},
	{
		icon: IoMail,
		label: "Email",
		href: "mailto:info@bskgroups.com",
		brandColor: "var(--f-green)"
	},
];

export default function Footer() {
	return (
		<footer className={styles.footer}>
			{/* Decorative background */}
			<div className={styles.footerBgGlow} aria-hidden="true" />
			<div className={styles.footerBgGlow2} aria-hidden="true" />
			<div className={styles.footerGrid} aria-hidden="true" />

			{/* ── Top Grid ── */}
			<div className={styles.top}>
				<div className={styles.topInner}>

					<div className={styles.brand}>
						<Link to="/" className={styles.brandLogo}>
							<img src="/logo-bsk.png" alt="BSK Groups" className={styles.footerLogo} />
						</Link>
						<div className={styles.brandDivider} />
						<p className={styles.brandDesc}>
							Pakistan's most trusted property portal. Find verified residential,
							commercial, and industrial properties across Peshawar and KPK.
						</p>
						<div className={styles.socials}>
							{SOCIALS.map(({ icon: Icon, label, href, brandColor, isGradient }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
									className={styles.socialBtn}
									style={{ 
										"--hover-bg": brandColor,
										"--icon-color": isGradient ? "#fff" : "var(--f-soft)"
									}}
								>
									<Icon size={17} />
								</a>
							))}
						</div>
					</div>

					{/* Properties */}
					<div className={styles.col}>
						<h4 className={styles.colTitle}>Properties</h4>
						<ul className={styles.linkList}>
							{NAV_PROPERTIES.map(({ label, to }) => (
								<li key={label} className={styles.linkItem}>
									<Link to={to} className={styles.footerLink}>{label}</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Popular Areas */}
					<div className={styles.col}>
						<h4 className={styles.colTitle}>Popular Areas</h4>
						<ul className={styles.linkList}>
							{NAV_AREAS.map(({ label, to }) => (
								<li key={label} className={styles.linkItem}>
									<Link to={to} className={styles.footerLink}>{label}</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div className={styles.col}>
						<h4 className={styles.colTitle}>Contact Us</h4>
						<ul className={styles.contactList}>
							<li className={styles.contactItem}>
								<span className={styles.contactIcon}>
									<MapPin size={14} />
								</span>
								<span className={styles.contactText}>
									DHA, Peshawar, KPK, Pakistan
								</span>
							</li>
							<li className={styles.contactItem}>
								<span className={styles.contactIcon}>
									<Phone size={14} />
								</span>
								<span className={styles.contactText}>
									<a href="tel:+923001234567" className={styles.contactLink}>
										+92 300 123 4567
									</a>
								</span>
							</li>
							<li className={styles.contactItem}>
								<span className={styles.contactIcon}>
									<Mail size={14} />
								</span>
								<span className={styles.contactText}>
									<a href="mailto:info@bskgroups.com" className={styles.contactLink}>
										info@bskgroups.com
									</a>
								</span>
							</li>
						</ul>

						<a
							href="https://wa.me/923001234567"
							target="_blank"
							rel="noreferrer"
							className={styles.waBtn}
						>
							<img
								src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
								alt="WhatsApp"
								className={styles.waIcon}
							/>
							Chat on WhatsApp
						</a>
					</div>

				</div>
			</div>

			{/* ── Middle Trust Band ── */}
			<div className={styles.mid}>
				<div className={styles.midInner}>
					<div className={styles.trustBadge}>
						<span className={styles.trustDot} />
						<span className={styles.trustText}>Verified & Trusted Since 2018</span>
					</div>
					<div className={styles.midStats}>
						<div className={styles.midStat}>
							<span className={styles.midStatNum}>2,400+</span>
							<span className={styles.midStatLabel}>Properties Listed</span>
						</div>
						<div className={styles.midStat}>
							<span className={styles.midStatNum}>850+</span>
							<span className={styles.midStatLabel}>Deals Closed</span>
						</div>
						<div className={styles.midStat}>
							<span className={styles.midStatNum}>8</span>
							<span className={styles.midStatLabel}>Cities</span>
						</div>
					</div>
				</div>
			</div>

			{/* ── Bottom Bar ── */}
			<div className={styles.bottom}>
				<div className={styles.bottomInner}>
					<p className={styles.copyright}>
						© {new Date().getFullYear()}{" "}
						<span className={styles.copyrightBrand}>BSK Groups</span>.
						{" "}All rights reserved.
					</p>
					<nav className={styles.bottomLinks} aria-label="Legal">
						<Link to="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
						<Link to="/terms" className={styles.bottomLink}>Terms of Service</Link>
						<Link to="/sitemap" className={styles.bottomLink}>Sitemap</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
