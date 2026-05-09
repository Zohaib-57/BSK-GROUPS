export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "1rem",
				lg: "2rem",
				xl: "2rem",
				"2xl": "2.5rem",
			},
		},
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: "#22c55e",
					50: "#f0fdf4",
					100: "#dcfce7",
					200: "#bbf7d0",
					300: "#86efac",
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
					800: "#166534",
					900: "#14532d",
				},
				"primary-dark": "#16a34a",
				"primary-light": "#bbf7d0",
				secondary: {
					DEFAULT: "#111827",
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1f2937",
					900: "#111827",
				},
				"secondary-light": "#1f2937",
				accent: "#facc15",
				"text-primary": "#111827",
				"text-secondary": "#6b7280",
				"text-muted": "#9ca3af",
				"bg-light": "#f9fafb",
				"bg-white": "#ffffff",
				border: "#e5e7eb",
				"border-dark": "#d1d5db",
			},
			boxShadow: {
				sm: "var(--shadow-sm)",
				DEFAULT: "var(--shadow)",
				lg: "var(--shadow-lg)",
				xl: "var(--shadow-xl)",
			},
			borderRadius: {
				DEFAULT: "var(--radius)",
				lg: "var(--radius-lg)",
				xl: "var(--radius-xl)",
			},
			backgroundImage: {
				"linear-to-br":
					"linear-gradient(to bottom right, var(--tw-gradient-stops))",
			},
			minHeight: {
				155: "38.75rem",
			},
			width: {
				18: "4.5rem",
			},
			height: {
				18: "4.5rem",
			},
		},
	},
	plugins: [],
};
