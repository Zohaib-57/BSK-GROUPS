import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext({
	user: null,
	loading: true,
	login: async () => {},
	register: async () => {},
	logout: async () => {},
	updateUser: () => {},
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeUser = async () => {
			const token = localStorage.getItem("accessToken");
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const { data } = await authAPI.getMe();
				setUser(data.user || null);
			} catch (error) {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
			} finally {
				setLoading(false);
			}
		};

		initializeUser();
	}, []);

	const login = async (credentials) => {
		const { data } = await authAPI.login(credentials);
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("refreshToken", data.refreshToken);
		localStorage.setItem("isRegistered", "true");
		setUser(data.user);
		return data;
	};

	const register = async (formData) => {
		const { data } = await authAPI.register(formData);
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("refreshToken", data.refreshToken);
		localStorage.setItem("isRegistered", "true");
		setUser(data.user);
		return data;
	};

	const logout = async () => {
		try {
			await authAPI.logout();
		} catch {
			// ignore logout errors and clear state anyway
		}
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		setUser(null);
	};

	const updateUser = (userData) => {
		console.log("Updating global user state:", userData);
		setUser((prev) => ({ ...prev, ...userData }));
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, logout, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
