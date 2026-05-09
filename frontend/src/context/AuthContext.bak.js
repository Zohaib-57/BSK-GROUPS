import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminInquiries from "./pages/admin/AdminInquiries";

// Loading Component (can be shared across the app)
const PageLoader = () => (
	<div className="flex justify-center items-center min-h-100">
		<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
	</div>
);

// Configure Query Client with better defaults
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			refetchOnMount: true,
		},
		mutations: {
			retry: 1,
		},
	},
});

// Protected Route Component
const ProtectedRoute = ({
	children,
	adminOnly = false,
	redirectTo = "/login",
}) => {
	const { user, loading } = useAuth();

	if (loading) return <PageLoader />;

	if (!user) {
		return <Navigate to={redirectTo} replace />;
	}

	if (adminOnly && user.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	return children;
};

// Guest Route Component (for auth pages when user is already logged in)
const GuestRoute = ({ children, redirectTo = "/" }) => {
	const { user, loading } = useAuth();

	if (loading) return <PageLoader />;

	if (user) {
		return <Navigate to={redirectTo} replace />;
	}

	return children;
};

// Public Route Component (accessible to everyone)
const PublicRoute = ({ children }) => {
	const { loading } = useAuth();
	if (loading) return <PageLoader />;
	return children;
};

// App Routes Component
const AppRoutes = () => (
	<Routes>
		{/* Public routes with main layout */}
		<Route element={<Layout />}>
			{/* Home & Properties */}
			<Route
				path="/"
				element={
					<PublicRoute>
						<HomePage />
					</PublicRoute>
				}
			/>
			<Route
				path="/properties"
				element={
					<PublicRoute>
						<PropertiesPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/properties/:slug"
				element={
					<PublicRoute>
						<PropertyDetailPage />
					</PublicRoute>
				}
			/>

			{/* Agents */}
			<Route
				path="/agents"
				element={
					<PublicRoute>
						<AgentsPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/agents/:id"
				element={
					<PublicRoute>
						<AgentProfilePage />
					</PublicRoute>
				}
			/>

			{/* Blog */}
			<Route
				path="/blogs"
				element={
					<PublicRoute>
						<BlogsPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/blogs/:slug"
				element={
					<PublicRoute>
						<BlogDetailPage />
					</PublicRoute>
				}
			/>

			{/* Static Pages */}
			<Route
				path="/about"
				element={
					<PublicRoute>
						<AboutPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/contact"
				element={
					<PublicRoute>
						<ContactPage />
					</PublicRoute>
				}
			/>

			{/* Auth & Verification */}
			<Route
				path="/verify-email/:token"
				element={
					<PublicRoute>
						<VerifyEmailPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/reset-password/:token"
				element={
					<PublicRoute>
						<ResetPasswordPage />
					</PublicRoute>
				}
			/>

			{/* Guest-only routes (redirect to dashboard if logged in) */}
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

			{/* Protected routes (require authentication) */}
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

		{/* Admin routes (require admin role) */}
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

		{/* 404 Not Found */}
		<Route path="*" element={<NotFoundPage />} />
	</Routes>
);

// Main App Component
export default function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter
					future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
				>
					<AuthProvider>
						<AppRoutes />
						<Toaster
							position="top-right"
							toastOptions={{
								duration: 3000,
								style: {
									borderRadius: "12px",
									fontFamily: "Inter, system-ui, -apple-system, sans-serif",
									fontSize: "14px",
									fontWeight: "500",
									padding: "12px 16px",
								},
								success: {
									duration: 4000,
									iconTheme: { primary: "#22c55e", secondary: "white" },
									style: {
										background: "#f0fdf4",
										color: "#166534",
									},
								},
								error: {
									duration: 5000,
									iconTheme: { primary: "#ef4444", secondary: "white" },
									style: {
										background: "#fef2f2",
										color: "#991b1b",
									},
								},
								loading: {
									style: {
										background: "#f3f4f6",
										color: "#374151",
									},
								},
							}}
						/>
					</AuthProvider>
				</BrowserRouter>
			</QueryClientProvider>
		</HelmetProvider>
	);
}
