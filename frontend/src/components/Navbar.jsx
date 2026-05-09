import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	Menu,
	X,
	ChevronDown,
	Plus,
	Heart,
	User,
	LogOut,
	Settings,
	LayoutDashboard,
	Building2,
	Home,
	Users,
	BookOpen,
} from "lucide-react";
import styles from "./Navbar.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
	{ label: "Houses", path: "/properties?type=house" },
	{ label: "Apartments", path: "/properties?type=apartment" },
	{ label: "Plots", path: "/properties?type=plot" },
	{ label: "Commercial", path: "/properties?type=commercial" },
	{ label: "Villas", path: "/properties?type=villa" },
	{ label: "Farmhouses", path: "/properties?type=farmhouse" },
];

// Single source of truth for nav links
const NAV_LINKS = [
	{ label: "Home", path: "/", icon: <Home size={15} />, end: true },
	{ label: "Agents", path: "/agents", icon: <Users size={15} /> },
	{ label: "Blog", path: "/blogs", icon: <BookOpen size={15} /> },
	{ label: "About", path: "/about", icon: <Building2 size={15} /> },
	{ label: "Contact", path: "/contact", icon: <Users size={15} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [propertiesOpen, setPropertiesOpen] = useState(false);
	const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);

	const userMenuRef = useRef(null);
	const propertiesRef = useRef(null);

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(e) {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
				setUserMenuOpen(false);
			}
			if (propertiesRef.current && !propertiesRef.current.contains(e.target)) {
				setPropertiesOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close mobile menu on route change
	const closeMobile = () => setMobileOpen(false);

	const handleLogout = async () => {
		await logout();
		setUserMenuOpen(false);
		setMobileOpen(false);
		navigate("/");
	};

	const avatarLetter = user?.name?.[0]?.toUpperCase() ?? "U";

	return (
		<header className={styles.header}>
			{/* ── Top bar ── */}
			<div className={styles.topBar}>
				<div className={styles.topBarInner}>
					<span>🏠 Pakistan&apos;s Most Trusted Property Portal</span>
					<div className={styles.topBarLinks}>
						{user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
					</div>
				</div>
			</div>

			{/* ── Main nav ── */}
			<nav className={styles.nav}>
				<div className={styles.navInner}>
					{/* Logo */}
					<Link to="/" className={styles.brandLogo} onClick={closeMobile}>
						<div className={styles.brandBox}>BSK</div>
						<div className={styles.brandText}>
							<span className={styles.brandName}>BSK Groups</span>
							<span className={styles.brandTagline}>Real Estate</span>
						</div>
					</Link>

					{/* ── Desktop nav links (Centered) ── */}
					<div className={styles.navLinks}>
						{NAV_LINKS.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								end={link.end}
								className={({ isActive }) =>
									isActive
										? `${styles.navLink} ${styles.active}`
										: styles.navLink
								}
							>
								{link.label}
							</NavLink>
						))}

						{/* Properties dropdown */}
						<div
							className={styles.dropdown}
							ref={propertiesRef}
							onMouseEnter={() => setPropertiesOpen(true)}
							onMouseLeave={() => setPropertiesOpen(false)}
						>
							<button
								className={`${styles.navLink} ${styles.dropdownTrigger}`}
								onClick={() => setPropertiesOpen((v) => !v)}
								aria-expanded={propertiesOpen}
							>
								Properties
								<ChevronDown
									size={14}
									className={`${styles.chevron} ${propertiesOpen ? styles.chevronUp : ""}`}
								/>
							</button>

							{propertiesOpen && (
								<div className={styles.dropdownMenu}>
									<div className={styles.dropdownSection}>
										<span className={styles.dropdownSectionLabel}>
											By Purpose
										</span>
										<Link
											to="/properties?purpose=sale"
											className={styles.dropdownItem}
											onClick={() => setPropertiesOpen(false)}
										>
											For Sale
										</Link>
										<Link
											to="/properties?purpose=rent"
											className={styles.dropdownItem}
											onClick={() => setPropertiesOpen(false)}
										>
											For Rent
										</Link>
									</div>
									<div className={styles.dropdownDivider} />
									<div className={styles.dropdownSection}>
										<span className={styles.dropdownSectionLabel}>By Type</span>
										{PROPERTY_TYPES.map((t) => (
											<Link
												key={t.label}
												to={t.path}
												className={styles.dropdownItem}
												onClick={() => setPropertiesOpen(false)}
											>
												{t.label}
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* ── Right side ── */}
					<div className={styles.navRight}>
						{user ? (
							<>
								<Link
									to="/saved-properties"
									className={styles.iconBtn}
									title="Saved Properties"
								>
									<Heart size={18} />
								</Link>

								<Link to="/post-property" className={styles.postBtn}>
									<Plus size={15} />
									<span>Post Property</span>
								</Link>

								{/* User dropdown */}
								<div className={styles.userMenu} ref={userMenuRef}>
									<button
										className={styles.userBtn}
										onClick={() => setUserMenuOpen((v) => !v)}
										aria-expanded={userMenuOpen}
									>
										{user.avatar ? (
											<img
												src={user.avatar}
												alt={user.name}
												className={styles.avatar}
											/>
										) : (
											<div className={styles.avatarPlaceholder}>
												{avatarLetter}
											</div>
										)}
										<ChevronDown
											size={13}
											className={`${styles.chevron} ${userMenuOpen ? styles.chevronUp : ""}`}
										/>
									</button>

									{userMenuOpen && (
										<div className={styles.userDropdown}>
											<div className={styles.userInfo}>
												<strong>{user.name}</strong>
												<span>{user.email}</span>
											</div>
											<div className={styles.dropdownDivider} />
											<Link
												to="/dashboard"
												className={styles.dropdownItem}
												onClick={() => setUserMenuOpen(false)}
											>
												<LayoutDashboard size={15} /> Dashboard
											</Link>
											<Link
												to="/profile"
												className={styles.dropdownItem}
												onClick={() => setUserMenuOpen(false)}
											>
												<User size={15} /> My Profile
											</Link>
											<Link
												to="/saved-properties"
												className={styles.dropdownItem}
												onClick={() => setUserMenuOpen(false)}
											>
												<Heart size={15} /> Saved Properties
											</Link>
											{user.role === "admin" && (
												<Link
													to="/admin"
													className={styles.dropdownItem}
													onClick={() => setUserMenuOpen(false)}
												>
													<Settings size={15} /> Admin Panel
												</Link>
											)}
											<div className={styles.dropdownDivider} />
											<button
												className={`${styles.dropdownItem} ${styles.logoutBtn}`}
												onClick={handleLogout}
											>
												<LogOut size={15} /> Logout
											</button>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<Link to="/login" className={styles.loginBtn}>
									Login
								</Link>
								<Link to="/register" className={styles.registerBtn}>
									Register
								</Link>
							</>
						)}

						{/* Mobile toggle */}
						<button
							className={styles.mobileToggle}
							onClick={() => setMobileOpen((v) => !v)}
							aria-label="Toggle menu"
						>
							{mobileOpen ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</div>

				{/* ── Mobile menu ── */}
				<div
					className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
				>
					<div className={styles.mobileMenuInner}>
						{/* Standard nav links */}
						{NAV_LINKS.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								end={link.end}
								className={({ isActive }) =>
									isActive
										? `${styles.mobileLink} ${styles.mobileLinkActive}`
										: styles.mobileLink
								}
								onClick={closeMobile}
							>
								{link.icon}
								{link.label}
							</NavLink>
						))}

						{/* Properties accordion */}
						<div className={styles.mobileAccordion}>
							<button
								className={styles.mobileLink}
								onClick={() => setMobilePropertiesOpen((v) => !v)}
							>
								<Building2 size={15} />
								Properties
								<ChevronDown
									size={14}
									className={`${styles.chevron} ${mobilePropertiesOpen ? styles.chevronUp : ""} ${styles.chevronRight}`}
								/>
							</button>
							{mobilePropertiesOpen && (
								<div className={styles.mobileSubMenu}>
									<Link
										to="/properties?purpose=sale"
										className={styles.mobileSubLink}
										onClick={closeMobile}
									>
										For Sale
									</Link>
									<Link
										to="/properties?purpose=rent"
										className={styles.mobileSubLink}
										onClick={closeMobile}
									>
										For Rent
									</Link>
									{PROPERTY_TYPES.map((t) => (
										<Link
											key={t.label}
											to={t.path}
											className={styles.mobileSubLink}
											onClick={closeMobile}
										>
											{t.label}
										</Link>
									))}
								</div>
							)}
						</div>

						<div className={styles.mobileDivider} />

						{user ? (
							<>
								<NavLink
									to="/dashboard"
									className={styles.mobileLink}
									onClick={closeMobile}
								>
									<LayoutDashboard size={15} /> Dashboard
								</NavLink>
								<NavLink
									to="/saved-properties"
									className={styles.mobileLink}
									onClick={closeMobile}
								>
									<Heart size={15} /> Saved Properties
								</NavLink>
								<NavLink
									to="/post-property"
									className={`${styles.mobileLink} ${styles.mobileLinkAccent}`}
									onClick={closeMobile}
								>
									<Plus size={15} /> Post Property
								</NavLink>
								<button
									className={`${styles.mobileLink} ${styles.mobileLinkLogout}`}
									onClick={handleLogout}
								>
									<LogOut size={15} /> Logout
								</button>
							</>
						) : (
							<>
								<NavLink
									to="/login"
									className={styles.mobileLink}
									onClick={closeMobile}
								>
									<User size={15} /> Login
								</NavLink>
								<NavLink
									to="/register"
									className={`${styles.mobileLink} ${styles.mobileLinkAccent}`}
									onClick={closeMobile}
								>
									<Plus size={15} /> Register
								</NavLink>
							</>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
