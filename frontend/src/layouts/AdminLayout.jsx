import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	LayoutDashboard,
	Building2,
	Users,
	BookOpen,
	MessageSquare,
	LogOut,
	Menu,
	Search,
	ChevronDown,
	Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./AdminLayout.module.css";

const navItems = [
	{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
	{ to: "/admin/properties", label: "Properties", icon: Building2 },
	{ to: "/admin/users", label: "Users", icon: Users },
	{ to: "/admin/blogs", label: "Blogs", icon: BookOpen },
	{ to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

export default function AdminLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		setMobileOpen(false);
	}, [location.pathname]);

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<div className={styles.layoutWrapper}>
			{mobileOpen && (
				<button
					type="button"
					className={styles.mobileBackdrop}
					onClick={() => setMobileOpen(false)}
					aria-label="Close menu"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : styles.sidebarFull} ${mobileOpen ? styles.sidebarMobileOpen : ""}`}
			>
				<div className={styles.sidebarHeader}>
					{!collapsed && (
						<div className={styles.logoText}>
							<span>BSK</span> ADMIN
						</div>
					)}
					{collapsed && <div className={styles.logoText}><span>B</span>A</div>}
				</div>

				<nav className={styles.navSection}>
					{navItems.map(({ to, label, icon: Icon, end }) => (
						<NavLink
							key={to}
							to={to}
							end={end}
							className={({ isActive }) => 
								`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
							}
							title={collapsed ? label : ""}
						>
							<Icon size={18} />
							{!collapsed && <span>{label}</span>}
						</NavLink>
					))}
				</nav>

				<div className={styles.sidebarFooter}>
					<button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
						<LogOut size={18} />
						{!collapsed && <span>Sign Out</span>}
					</button>
				</div>
			</aside>

			{/* Main Area */}
			<div className={`${styles.mainArea} ${collapsed ? styles.mainAreaCollapsed : styles.mainAreaFull}`}>
				{/* Topbar */}
				<header className={styles.topbar}>
					<div className={styles.topbarLeft}>
						<button
							className={`${styles.collapseBtn} ${styles.mobileMenuBtn}`}
							onClick={() => setMobileOpen((v) => !v)}
							aria-label="Toggle mobile menu"
						>
							<Menu size={20} />
						</button>
						<button
							className={`${styles.collapseBtn} ${styles.desktopCollapseBtn}`}
							onClick={() => setCollapsed(!collapsed)}
							aria-label="Collapse sidebar"
						>
							<Menu size={20} />
						</button>
						<div className={styles.globalSearch}>
							<Search size={16} className={styles.searchIcon} />
							<input type="text" placeholder="Global search..." className={styles.searchInput} />
						</div>
					</div>

					<div className={styles.topbarRight}>
						<button className={styles.collapseBtn}>
							<Bell size={20} />
						</button>
						<div className={styles.userProfile}>
							<div className={styles.avatar}>
								{user?.name?.charAt(0) || "A"}
							</div>
							<div className={styles.userInfo}>
								<span className={styles.userName}>{user?.name || "Admin User"}</span>
								<span className={styles.userRole}>Administrator</span>
							</div>
							<ChevronDown size={14} className="text-gray-400" />
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className={styles.pageContent}>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
