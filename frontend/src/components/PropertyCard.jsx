import { Link } from "react-router-dom";
import {
	MapPin,
	Bed,
	Bath,
	Square,
	Heart,
	Star,
	CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import toast from "react-hot-toast";

const formatPrice = (price) => {
	if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
	if (price >= 100000) return `${(price / 100000).toFixed(0)} Lakh`;
	return price.toLocaleString();
};

export default function PropertyCard({ property, horizontal = false }) {
	const { user } = useAuth();
	const [saved, setSaved] = useState(
		user?.savedProperties?.includes(property._id),
	);
	const [saving, setSaving] = useState(false);

	const mainImage =
		property.images?.find((i) => i.isMain)?.url ||
		property.images?.[0]?.url ||
		"/placeholder-property.jpg";

	const handleSave = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to save properties");
			return;
		}
		setSaving(true);
		try {
			const { data } = await userAPI.saveProperty(property._id);
			setSaved(data.saved);
			toast.success(data.message);
		} catch {
			toast.error("Failed to save");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Link
			to={`/properties/${property.slug}`}
			className={`
        group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-lg 
        transition-all duration-300 no-underline text-inherit flex flex-col
        ${horizontal ? "sm:flex-row" : ""}
      `}
		>
			{/* Image Section */}
			<div
				className={`relative overflow-hidden ${horizontal ? "sm:w-64 sm:shrink-0" : ""}`}
			>
				<img
					src={mainImage}
					alt={property.title}
					className={`
            w-full h-48 object-cover transition-transform duration-700 
            group-hover:scale-110
            ${horizontal ? "sm:h-full" : ""}
          `}
					loading="lazy"
				/>

				{/* Top Badges */}
				<div className="absolute top-2 left-2 flex gap-1 flex-wrap">
					{property.isFeatured && (
						<span className="bg-secondary/90 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
							Featured
						</span>
					)}
					{property.isVerified && (
						<span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
							<CheckCircle size={9} /> Verified
						</span>
					)}
				</div>

				{/* Save Button */}
				<button
					className={`
            absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border-none 
            cursor-pointer flex items-center justify-center shadow-md 
            transition-all duration-200 hover:bg-white hover:scale-110
            ${saved ? "text-red-500" : "text-gray-400 hover:text-red-500"}
          `}
					onClick={handleSave}
					disabled={saving}
				>
					<Heart size={14} fill={saved ? "currentColor" : "none"} />
				</button>
			</div>

			{/* Content Section */}
			<div className="p-3.5 flex-1 flex flex-col gap-1">
				{/* Price Row */}
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-bold text-primary">
						PKR {formatPrice(property.price)}
					</span>
					{property.priceType !== "fixed" && (
						<span className="text-[11px] text-gray-500 font-medium">
							{property.priceType === "per_month" ? "/mo" : ""}
						</span>
					)}
				</div>

				{/* Title */}
				<h3 className="text-[13px] font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
					{property.title}
				</h3>

				{/* Location */}
				<div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
					<MapPin size={11} className="text-primary/70" />
					<span className="truncate font-medium">
						{property.location.area || property.location.society}, {property.location.city}
					</span>
				</div>

				{/* Specs */}
				<div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
					<div className="flex gap-3">
						{property.bedrooms > 0 && (
							<div className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold">
								<Bed size={12} className="text-gray-400" /> {property.bedrooms}
							</div>
						)}
						{property.bathrooms > 0 && (
							<div className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold">
								<Bath size={12} className="text-gray-400" /> {property.bathrooms}
							</div>
						)}
					</div>
					<div className="flex items-center gap-1 text-[11px] text-gray-600 font-bold bg-gray-50 px-1.5 py-0.5 rounded">
						<Square size={10} className="text-gray-400" /> {property.area.value} {property.area.unit}
					</div>
				</div>
			</div>
				{/* Agent Info */}
				{property.postedBy && (
					<div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
						{property.postedBy.avatar ? (
							<img
								src={property.postedBy.avatar}
								alt={property.postedBy.name}
								className="w-6 h-6 rounded-full object-cover"
							/>
						) : (
							<div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-semibold">
								{property.postedBy.name?.[0]?.toUpperCase()}
							</div>
						)}
						<span className="text-xs text-gray-500 truncate">
							{property.postedBy.name}
						</span>
					</div>
				)}

			{/* Add line-clamp utility for text truncation */}
			<style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
		</Link>
	);
}
