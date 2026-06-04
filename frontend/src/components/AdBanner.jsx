import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Tag, Star, Zap } from "lucide-react";
import "./AdBanner.css";

// ─── Ad Data (editable — add/remove/update ads here) ────────────────────────
const ADS = [
	{
		id: 1,
		tag: "🔥 Hot Deal",
		headline: "DHA Peshawar — 10 Marla Plot at Unbeatable Price!",
		sub: "Limited inventory available. Verified & balloted. Contact BSK Group today.",
		cta: "Explore Now",
		ctaLink: "/properties?society=DHA%20Peshawar",
		badge: "Featured",
		theme: "gold",
		icon: Star,
	},
	{
		id: 2,
		tag: "💼 For Agents",
		headline: "List Your Property Free — Reach 10,000+ Buyers!",
		sub: "Join BSK Group's growing network of trusted agents & dealers across KPK.",
		cta: "Post Property",
		ctaLink: "/post-property",
		badge: "Free",
		theme: "blue",
		icon: Zap,
	},
	{
		id: 3,
		tag: "🏠 New Launch",
		headline: "Hayatabad Phase 7 — Commercial Plots Now Available",
		sub: "Prime commercial plots in Peshawar's most sought-after locality. Don't miss out.",
		cta: "View Listings",
		ctaLink: "/properties?society=Hayatabad",
		badge: "New",
		theme: "emerald",
		icon: Sparkles,
	},
	{
		id: 4,
		tag: "🎯 Exclusive Offer",
		headline: "University Town Apartments — Starting at Just PKR 80 Lac",
		sub: "Fully furnished options available. Easy installment plans. Verified listings only.",
		cta: "See Details",
		ctaLink: "/properties?type=apartment",
		badge: "Sale",
		theme: "rose",
		icon: Tag,
	},
];

const ROTATION_INTERVAL = 5000; // ms

export default function AdBanner() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [dismissed, setDismissed] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [direction, setDirection] = useState("next"); // "next" | "prev"
	const [paused, setPaused] = useState(false);

	const goTo = useCallback(
		(index, dir = "next") => {
			if (animating) return;
			setDirection(dir);
			setAnimating(true);
			setTimeout(() => {
				setCurrentIndex(index);
				setAnimating(false);
			}, 300);
		},
		[animating]
	);

	const goNext = useCallback(() => {
		goTo((currentIndex + 1) % ADS.length, "next");
	}, [currentIndex, goTo]);

	const goPrev = useCallback(() => {
		goTo((currentIndex - 1 + ADS.length) % ADS.length, "prev");
	}, [currentIndex, goTo]);

	// Auto-rotate
	useEffect(() => {
		if (dismissed || paused) return;
		const timer = setInterval(goNext, ROTATION_INTERVAL);
		return () => clearInterval(timer);
	}, [dismissed, paused, goNext]);

	if (dismissed) return null;

	const ad = ADS[currentIndex];
	const AdIcon = ad.icon;

	return (
		<div
			className={`ad-banner ad-banner--${ad.theme}`}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			role="banner"
			aria-label="Advertisement banner"
		>
			{/* Animated background orbs */}
			<div className="ad-banner__orb ad-banner__orb--1" aria-hidden="true" />
			<div className="ad-banner__orb ad-banner__orb--2" aria-hidden="true" />

			{/* Left Nav */}
			<button
				className="ad-banner__nav ad-banner__nav--prev"
				onClick={goPrev}
				aria-label="Previous ad"
			>
				<ChevronLeft size={14} />
			</button>

			{/* Content */}
			<div className={`ad-banner__content ${animating ? `ad-banner__content--exit-${direction}` : "ad-banner__content--enter"}`}>
				{/* Icon badge */}
				<div className="ad-banner__icon-wrap" aria-hidden="true">
					<AdIcon size={14} />
				</div>

				{/* Tag */}
				<span className="ad-banner__tag">{ad.tag}</span>

				{/* Divider */}
				<span className="ad-banner__divider" aria-hidden="true">|</span>

				{/* Headline */}
				<span className="ad-banner__headline">{ad.headline}</span>

				{/* Sub */}
				<span className="ad-banner__sub">{ad.sub}</span>

				{/* CTA */}
				<a
					href={ad.ctaLink}
					className="ad-banner__cta"
					aria-label={`${ad.cta} — ${ad.headline}`}
				>
					{ad.cta} <ExternalLink size={11} />
				</a>
			</div>

			{/* Right Nav */}
			<button
				className="ad-banner__nav ad-banner__nav--next"
				onClick={goNext}
				aria-label="Next ad"
			>
				<ChevronRight size={14} />
			</button>

			{/* Dots */}
			<div className="ad-banner__dots" role="tablist" aria-label="Ad navigation">
				{ADS.map((a, i) => (
					<button
						key={a.id}
						className={`ad-banner__dot ${i === currentIndex ? "ad-banner__dot--active" : ""}`}
						onClick={() => goTo(i, i > currentIndex ? "next" : "prev")}
						role="tab"
						aria-selected={i === currentIndex}
						aria-label={`Ad ${i + 1}`}
					/>
				))}
			</div>

			{/* Progress bar */}
			{!paused && (
				<div className="ad-banner__progress" key={`${currentIndex}-${paused}`}>
					<div className="ad-banner__progress-bar" />
				</div>
			)}

			{/* Close button */}
			<button
				className="ad-banner__close"
				onClick={() => setDismissed(true)}
				aria-label="Close advertisement banner"
			>
				<X size={13} />
			</button>
		</div>
	);
}
