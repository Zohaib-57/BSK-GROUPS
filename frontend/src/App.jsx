import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetail";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import PostPropertyPage from "./pages/PostPropertyPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import SavedPropertiesPage from "./pages/SavedPropertiesPage";
import ProfilePage from "./pages/ProfilePage";
import AgentsPage from "./pages/AgentsPage";
import AgentProfilePage from "./pages/AgentProfilePage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import AboutPage from "./pages/AboutPage";
import LiveInventoryPage from "./pages/LiveInventoryPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminInquiries from "./pages/admin/AdminInquiries";

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading)
		return (
			<div className="page-loader">
				<div className="spinner" />
			</div>
		);
	if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
	if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
	return children;
};

const GuestRoute = ({ children }) => {
	const { user, loading } = useAuth();
	if (loading)
		return (
			<div className="page-loader">
				<div className="spinner" />
			</div>
		);
	if (user) return <Navigate to="/" replace />;
	return children;
};

const AppRoutes = () => (
	<Routes>
		{/* Public routes with main layout */}
		<Route element={<Layout />}>
			<Route path="/" element={<HomePage />} />
			<Route path="/properties" element={<PropertiesPage />} />
			<Route path="/properties/:slug" element={<PropertyDetailPage />} />
			<Route path="/agents" element={<AgentsPage />} />
			<Route path="/agents/:id" element={<AgentProfilePage />} />
			<Route path="/blogs" element={<BlogsPage />} />
			<Route path="/blogs/:slug" element={<BlogDetailPage />} />
			<Route path="/about" element={<AboutPage />} />
			<Route path="/live-inventory" element={<LiveInventoryPage />} />
			<Route path="/contact" element={<ContactPage />} />
			<Route path="/verify-email/:token" element={<VerifyEmailPage />} />
			<Route path="/reset-password/:token" element={<ResetPasswordPage />} />

			{/* Auth routes */}
			<Route
				path="/login"
				element={
					<GuestRoute>
						<LoginPage />
					</GuestRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<GuestRoute>
						<RegisterPage />
					</GuestRoute>
				}
			/>
			<Route
				path="/forgot-password"
				element={
					<GuestRoute>
						<ForgotPasswordPage />
					</GuestRoute>
				}
			/>

			{/* Protected routes */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/post-property"
				element={
					<ProtectedRoute>
						<PostPropertyPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/edit-property/:id"
				element={
					<ProtectedRoute>
						<EditPropertyPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/saved-properties"
				element={
					<ProtectedRoute>
						<SavedPropertiesPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				}
			/>
		</Route>

		{/* Admin routes */}
		<Route
			path="/admin"
			element={
				<ProtectedRoute adminOnly>
					<AdminLayout />
				</ProtectedRoute>
			}
		>
			<Route index element={<AdminDashboard />} />
			<Route path="properties" element={<AdminProperties />} />
			<Route path="users" element={<AdminUsers />} />
			<Route path="blogs" element={<AdminBlogs />} />
			<Route path="inquiries" element={<AdminInquiries />} />
		</Route>

		<Route path="*" element={<NotFoundPage />} />
	</Routes>
);

export default function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<ScrollToTop />
					<AuthProvider>
						<AppRoutes />
						<Toaster
							position="top-center"
							toastOptions={{
								duration: 2500,
								style: {
									background: "#fff",
									color: "#1e293b",
									padding: "16px 24px",
									borderRadius: "16px",
									fontSize: "15px",
									fontWeight: "500",
									boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									border: "1px solid rgba(0,0,0,0.05)",
								},
								success: {
									iconTheme: { primary: "#c9923a", secondary: "#fff" },
									style: { borderLeft: "5px solid #c9923a" },
								},
								error: {
									iconTheme: { primary: "#ef4444", secondary: "#fff" },
									style: { borderLeft: "5px solid #ef4444" },
								},
							}}
						/>
					</AuthProvider>
				</BrowserRouter>
			</QueryClientProvider>
		</HelmetProvider>
	);
}
