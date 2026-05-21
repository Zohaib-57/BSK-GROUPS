import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, Building2, ChevronDown } from "lucide-react";
import styles from "./SearchBar.module.css";

const CITIES = [
	"Peshawar",
	"Islamabad",
	"Lahore",
	"Karachi",
	"Rawalpindi",
	"Mardan",
	"Abbottabad",
	"Nowshera",
];

const PROPERTY_TYPES = [
	{ value: "", label: "All Types" },
	{ value: "house", label: "House" },
	{ value: "apartment", label: "Apartment" },
	{ value: "plot", label: "Plot" },
	{ value: "commercial", label: "Commercial" },
	{ value: "villa", label: "Villa" },
	{ value: "farmhouse", label: "Farmhouse" },
	{ value: "room", label: "Room" },
	{ value: "office", label: "Office" },
	{ value: "shop", label: "Shop" },
	{ value: "warehouse", label: "Warehouse" },
];

export default function SearchBar({ hero = false }) {
	const navigate = useNavigate();
	const [purpose, setPurpose] = useState("sale");
	const [type, setType] = useState("");
	const [city, setCity] = useState("");
	const [area, setArea] = useState("");
	const [society, setSociety] = useState("");
	const [keyword, setKeyword] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		const params = new URLSearchParams();
		params.set("purpose", purpose);
		if (type) params.set("type", type);
		if (city) params.set("city", city);
		if (area.trim()) params.set("area", area.trim());
		if (society.trim()) params.set("society", society.trim());
		if (keyword.trim()) params.set("keyword", keyword.trim());
		navigate(`/properties?${params.toString()}`);
	};

	return (
		<form
			className={`${styles.searchBar} ${hero ? styles.hero : ""}`}
			onSubmit={handleSearch}
		>
			{/* ── Buy / Rent tabs ── */}
			<div className={styles.tabs}>
				<button
					type="button"
					className={`${styles.tab} ${purpose === "sale" ? styles.tabActive : ""}`}
					onClick={() => setPurpose("sale")}
				>
					Buy
				</button>
				<button
					type="button"
					className={`${styles.tab} ${purpose === "rent" ? styles.tabActive : ""}`}
					onClick={() => setPurpose("rent")}
				>
					Rent
				</button>
				<button
					type="button"
					className={`${styles.tab} ${purpose === "lease" ? styles.tabActive : ""}`}
					onClick={() => setPurpose("lease")}
				>
					Lease
				</button>
			</div>

			{/* ── Desktop inputs ── */}
			<div className={styles.row}>
				{/* Property Type */}
				<div className={styles.field}>
					<label className={styles.label}>
						<Home size={11} /> Property Type
					</label>
					<div className={styles.selectWrap}>
						<select
							className={styles.select}
							value={type}
							onChange={(e) => setType(e.target.value)}
						>
							{PROPERTY_TYPES.map((t) => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
						<ChevronDown size={14} className={styles.selectArrow} />
					</div>
				</div>

				<div className={styles.divider} />

				{/* City */}
				<div className={styles.field}>
					<label className={styles.label}>
						<MapPin size={11} /> City
					</label>
					<div className={styles.selectWrap}>
						<select
							className={styles.select}
							value={city}
							onChange={(e) => setCity(e.target.value)}
						>
							<option value="">All Cities</option>
							{CITIES.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<ChevronDown size={14} className={styles.selectArrow} />
					</div>
				</div>

				<div className={styles.divider} />

				{/* Area / Town / Colony */}
				<div className={styles.field}>
					<label className={styles.label}>
						<MapPin size={11} /> Area / Town
					</label>
					<input
						type="text"
						placeholder="e.g. Hayatabad"
						className={styles.input}
						value={area}
						onChange={(e) => setArea(e.target.value)}
					/>
				</div>

				<div className={styles.divider} />

				{/* Society / Project */}
				<div className={styles.field}>
					<label className={styles.label}>
						<Building2 size={11} /> Society / Project
					</label>
					<input
						type="text"
						placeholder="e.g. Park View City"
						className={styles.input}
						value={society}
						onChange={(e) => setSociety(e.target.value)}
					/>
				</div>

				<div className={styles.divider} />

				{/* Keyword */}
				<div className={`${styles.field} ${styles.fieldGrow}`}>
					<label className={styles.label}>
						<Search size={11} /> Keyword
					</label>
					<input
						type="text"
						placeholder="Title, description…"
						className={styles.input}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
				</div>

				{/* Submit */}
				<button type="submit" className={styles.submitBtn}>
					<Search size={18} />
					<span>Find Properties</span>
				</button>
			</div>

			{/* ── Mobile inputs ── */}
			<div className={styles.mobileBody}>
				<div className={styles.mobileField}>
					<label className={styles.label}>
						<Home size={11} /> Property Type
					</label>
					<div className={styles.selectWrap}>
						<select
							className={styles.select}
							value={type}
							onChange={(e) => setType(e.target.value)}
						>
							{PROPERTY_TYPES.map((t) => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
						<ChevronDown size={14} className={styles.selectArrow} />
					</div>
				</div>

				<div className={styles.mobileField}>
					<label className={styles.label}>
						<MapPin size={11} /> City
					</label>
					<div className={styles.selectWrap}>
						<select
							className={styles.select}
							value={city}
							onChange={(e) => setCity(e.target.value)}
						>
							<option value="">All Cities</option>
							{CITIES.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<ChevronDown size={14} className={styles.selectArrow} />
					</div>
				</div>

				<div className={styles.mobileField}>
					<label className={styles.label}>
						<MapPin size={11} /> Area / Town / Colony
					</label>
					<input
						type="text"
						placeholder="e.g. Hayatabad, Bahria Town"
						className={styles.input}
						value={area}
						onChange={(e) => setArea(e.target.value)}
					/>
				</div>

				<div className={styles.mobileField}>
					<label className={styles.label}>
						<Building2 size={11} /> Society / Project
					</label>
					<input
						type="text"
						placeholder="e.g. Park View City"
						className={styles.input}
						value={society}
						onChange={(e) => setSociety(e.target.value)}
					/>
				</div>

				<div className={styles.mobileField}>
					<label className={styles.label}>
						<Search size={11} /> Keyword
					</label>
					<input
						type="text"
						placeholder="Title, description…"
						className={styles.input}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
				</div>

				<button type="submit" className={`${styles.submitBtn} ${styles.submitBtnFull}`}>
					<Search size={18} />
					<span>Find Properties</span>
				</button>
			</div>
		</form>
	);
}
