import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL
		? `${import.meta.env.VITE_API_URL}/api`
		: "/api",
	headers: { "Content-Type": "application/json" },
});

// Attach access token
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const original = err.config;
		if (err.response?.status === 401 && !original._retry) {
			original._retry = true;
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) {
				localStorage.clear();
				window.location.href = "/login";
				return Promise.reject(err);
			}
			try {
				const { data } = await axios.post("/api/auth/refresh", {
					refreshToken,
				});
				localStorage.setItem("accessToken", data.accessToken);
				localStorage.setItem("refreshToken", data.refreshToken);
				original.headers.Authorization = `Bearer ${data.accessToken}`;
				return api(original);
			} catch {
				localStorage.clear();
				window.location.href = "/login";
			}
		}
		return Promise.reject(err);
	},
);

export default api;

// API service functions
export const authAPI = {
	register: (data) => api.post("/auth/register", data),
	login: (data) => api.post("/auth/login", data),
	logout: () => api.post("/auth/logout"),
	getMe: () => api.get("/auth/me"),
	forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
	resetPassword: (token, password) =>
		api.put(`/auth/reset-password/${token}`, { password }),
	verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

export const propertyAPI = {
	getAll: (params) => api.get("/properties", { params }),
	getFeatured: () => api.get("/properties/featured"),
	getBySlug: (slug) => api.get(`/properties/${slug}`),
	getById: (id) => api.get(`/properties/id/${id}`), // New
	create: (data) => api.post("/properties", data),
	update: (id, data) => api.put(`/properties/${id}`, data),
	delete: (id) => api.delete(`/properties/${id}`),
	getMyProperties: () => api.get("/properties/my-properties"),
	getAgentStats: () => api.get("/properties/agent-stats"),
	approve: (id, isApproved) =>
		api.put(`/properties/${id}/approve`, { isApproved }),
};

export const userAPI = {
	getProfile: () => api.get("/users/profile"),
	updateProfile: (data) => api.put("/users/profile", data),
	changePassword: (data) => api.put("/users/change-password", data),
	saveProperty: (id) => api.post(`/users/save-property/${id}`),
	getSavedProperties: () => api.get("/users/saved-properties"),
	getAll: (params) => api.get("/users", { params }),
};

export const inquiryAPI = {
	create: (data) => api.post("/inquiries", data),
	getMyInquiries: () => api.get("/inquiries/my-inquiries"),
	updateStatus: (id, status) => api.put(`/inquiries/${id}/status`, { status }),
};

export const blogAPI = {
	getAll: (params) => api.get("/blogs", { params }),
	getBySlug: (slug) => api.get(`/blogs/${slug}`),
	getFeatured: () => api.get("/blogs/featured"),
	create: (data) => api.post("/blogs", data),
	update: (id, data) => api.put(`/blogs/${id}`, data),
	delete: (id) => api.delete(`/blogs/${id}`),
};

export const adminAPI = {
	getDashboardStats: () => api.get("/admin/stats"),
	getAllProperties: (params) => api.get("/admin/properties", { params }),
	getPropertyById: (id) => api.get(`/admin/properties/${id}`), // New
	updateProperty: (id, data) => api.put(`/admin/properties/${id}`, data),
	deleteProperty: (id) => api.delete(`/admin/properties/${id}`),
	getAllUsers: (params) => api.get("/users", { params }),
	deleteUser: (id) => api.delete(`/users/${id}`),
};

export const uploadAPI = {
	uploadImages: (formData) =>
		api.post("/upload/images", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};
