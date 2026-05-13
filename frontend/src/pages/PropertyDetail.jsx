import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { propertyAPI, inquiryAPI } from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import {
  MapPin, Bed, Bath, Square, Phone, Mail, MessageCircle,
  Calendar, CheckCircle2, Share2, Heart, ShieldCheck, Info,
  ChevronLeft, ChevronRight, Images, Building2, Home,
  School, Hospital, ShoppingBag, Utensils, Bus, Shield,
  TrendingUp, BarChart2, Eye, X
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Fallback Agent ── */
const FALLBACK_AGENT = {
  name: "Zarak Khan",
  role: "Executive Partner",
  phone: "+92 300 8585123",
  email: "zarak.khan@bskgroups.com",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256"
};

const formatPrice = (price) => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price?.toLocaleString();
};

/* ── Inline price chart (SVG) ── */
function PriceChart({ data }) {
  if (!data || data.length === 0) return null;
  const W = 560, H = 160, PAD = 30;
  const vals = data.map(d => d.price);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (d.price - min) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const areaPath = `M${pts[0]} L${pts.join(" L")} L${PAD + (W - PAD * 2)},${H - PAD} L${PAD},${H - PAD} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      <defs>
        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A45A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C8A45A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#priceGrad)" />
      <polyline points={polyline} fill="none" stroke="#C8A45A" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pts[i].split(",");
        return <circle key={i} cx={x} cy={y} r="4" fill="#C8A45A" />;
      })}
    </svg>
  );
}

/* ── Lightbox ── */
function Lightbox({ images, activeIdx, onClose, onChange }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((activeIdx + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((activeIdx - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIdx, images.length]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
        <X size={32} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onChange((activeIdx - 1 + images.length) % images.length); }}
        style={{ position: "absolute", left: 16, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", padding: "10px 14px" }}>
        <ChevronLeft size={28} />
      </button>
      <img
        src={images[activeIdx]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain" }}
      />
      <button onClick={(e) => { e.stopPropagation(); onChange((activeIdx + 1) % images.length); }}
        style={{ position: "absolute", right: 16, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", padding: "10px 14px" }}>
        <ChevronRight size={28} />
      </button>
      <div style={{ position: "absolute", bottom: 20, color: "#ccc", fontSize: 14 }}>{activeIdx + 1} / {images.length}</div>
    </div>
  );
}

/* ── Tab: Overview ── */
function OverviewTab({ property }) {
  return (
    <div>
      {/* Details Table */}
      <div style={card}>
        <h2 style={sectionTitle}>Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Type", property.type?.charAt(0).toUpperCase() + property.type?.slice(1)],
              ["Purpose", property.purpose === "sale" ? "For Sale" : "For Rent"],
              ["Price", `PKR ${formatPrice(property.price)}`],
              ["Bedroom(s)", property.bedrooms],
              ["Bath(s)", property.bathrooms],
              ["Area", `${property.area?.value} ${property.area?.unit}`],
              ["Added", new Date(property.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })],
              ["Location", `${property.location?.area || property.location?.society || ""}, ${property.location?.city || ""}`],
            ].map(([label, val], i) => val && (
              <tr key={label} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#64748b", fontWeight: 600, width: "35%", borderBottom: "1px solid #f1f5f9" }}>{label}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>{val}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#64748b", fontWeight: 600, width: "35%", borderBottom: "1px solid #f1f5f9" }}></td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description */}
      <div style={card}>
        <h2 style={sectionTitle}>Description</h2>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{property.description}</p>
      </div>

      {/* Amenities */}
      {property.features && Object.values(property.features).some(v => v === true) && (
        <div style={card}>
          <h2 style={sectionTitle}>Amenities & Features</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 8 }}>
            {Object.entries(property.features).map(([key, val]) => val && (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569" }}>
                <span style={{ color: "#C8A45A" }}>
                  {key === "security" ? <Shield size={18} /> : 
                   key === "swimmingPool" ? <CheckCircle2 size={18} /> :
                   key === "garden" ? <Home size={18} /> :
                   key === "gym" ? <TrendingUp size={18} /> :
                   <CheckCircle2 size={18} />}
                </span> 
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab: Location ── */
function LocationTab({ property }) {
  const q = encodeURIComponent(`${property.location?.address}, ${property.location?.city}, Pakistan`);
  return (
    <div style={card}>
      <h2 style={sectionTitle}>Location & Nearby</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
        <MapPin size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, color: "#C8A45A" }} />
        {property.location?.address}, {property.location?.city}
      </p>
      <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <iframe
          title="map"
          width="100%"
          height="340"
          style={{ display: "block", border: "none" }}
          src={`https://maps.google.com/maps?q=${q}&output=embed`}
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ── Tab: Price Index ── */
function PriceIndexTab({ property }) {
  // Generate mock historical data based on property price
  const base = property.price || 10000000;
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const mockData = months.map((m, i) => ({
    month: m,
    price: Math.round(base * (0.72 + i * 0.025 + Math.sin(i) * 0.015))
  }));
  const current = mockData[mockData.length - 1].price;
  const prev = mockData[0].price;
  const change = (((current - prev) / prev) * 100).toFixed(1);

  return (
    <div style={card}>
      <h2 style={sectionTitle}>Price Index — {property.area?.value} {property.area?.unit} in {property.location?.area || property.location?.city}</h2>
      <div style={{ display: "flex", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Current Price</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>PKR {formatPrice(current)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Change (12 months)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#16a34a" }}>+PKR {formatPrice(current - prev)} ({change}%)</div>
        </div>
        {[["6 months ago", mockData[6].price], ["12 months ago", mockData[3].price], ["24 months ago", mockData[0].price]].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#475569" }}>PKR {formatPrice(val)}</div>
          </div>
        ))}
      </div>
      <PriceChart data={mockData} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {["6 Months", "1 Year", "Max"].map((t) => (
          <button key={t} style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer", background: t === "Max" ? "#C8A45A" : "#fff", color: t === "Max" ? "#fff" : "#64748b" }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

/* ── Tab: Trends ── */
function TrendsTab({ property }) {
  const trends = [
    { rank: 1, locality: "DHA Defence Phase 2", pct: 65, perf: "No Change" },
    { rank: 2, locality: "DHA Defence Phase 1", pct: 14.4, perf: "No Change" },
    { rank: 3, locality: "DHA Defence Phase 5", pct: 12.2, perf: "No Change" },
    { rank: 4, locality: "DHA Defence Phase 3", pct: 3.6, perf: "+1" },
    { rank: 5, locality: "DHA Valley", pct: 3.3, perf: "-1" },
    { rank: 6, locality: "DHA Defence Phase 4", pct: 1.3, perf: "No Change" },
    { rank: 7, locality: "DHA Defence Phase 7", pct: 0.4, perf: "No Change" },
    { rank: 8, locality: "DHA Defence Phase 6", pct: 0.1, perf: "No Change" },
  ];

  return (
    <div style={card}>
      <h2 style={sectionTitle}>Trends — Most Searched Locations in {property.location?.area || "DHA"}</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Rank", "Locality", "% of Total Searches", "Performance"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "2px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trends.map((t, i) => (
              <tr key={t.rank} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b", fontWeight: 700 }}>{t.rank}</td>
                <td style={{ padding: "10px 14px", color: "#1e293b" }}>{t.locality}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 8, maxWidth: 200 }}>
                      <div style={{ width: `${(t.pct / 65) * 100}%`, background: "#16a34a", borderRadius: 4, height: "100%" }} />
                    </div>
                    <span style={{ color: "#475569", minWidth: 36 }}>{t.pct}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 14px", color: t.perf === "No Change" ? "#94a3b8" : t.perf.startsWith("+") ? "#16a34a" : "#ef4444" }}>{t.perf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Shared styles ── */
const card = {
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  padding: "24px 28px",
  marginBottom: 20,
};
const sectionTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: 18,
  paddingBottom: 12,
  borderBottom: "1px solid #f1f5f9",
};

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [mainImg, setMainImg] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "I would like to inquire about this property. Please contact me at your earliest convenience.", role: "buyer" });
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => propertyAPI.getBySlug(slug).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid #C8A45A", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const property = data?.property;
  const similar = data?.similar || [];

  if (!property) return <div style={{ padding: 80, textAlign: "center", color: "#64748b" }}>Property not found.</div>;

  const displayAgent = (property.agent && property.agent.role !== "admin")
    ? property.agent
    : (property.postedBy && property.postedBy.role !== "admin")
      ? property.postedBy
      : FALLBACK_AGENT;

  // Resolve image URLs (handles both string[] and {url, isMain}[])
  const allImages = (property.images || []).map(img => (typeof img === "string" ? img : img?.url)).filter(Boolean);
  const fallbacks = [
    "https://images.unsplash.com/photo-1600585154340-be6199f7c009?auto=format&fit=crop&w=1200&h=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1600607687940-477a284e68c6?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&h=400",
  ];
  const images = allImages.length > 0 ? allImages : fallbacks;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiryAPI.create({
        propertyId: property._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || `I would like to inquire about ${property.title}. Please contact me at your earliest convenience.`,
        role: formData.role,
      });
      toast.success("Message sent! The agent will contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "", role: "buyer" });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "location", label: "Location & Nearby" },
    { id: "priceindex", label: "Price Index" },
    { id: "trends", label: "Trends" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Helmet>
        <title>{property.title} | BSK Groups</title>
        <meta name="description" content={property.description?.substring(0, 160)} />
      </Helmet>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox images={images} activeIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} onChange={setLightboxIdx} />
      )}

      {/* ── Gallery ── */}
      <div style={{ background: "#000", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "260px 260px", gap: 3 }}>
          {/* Main image */}
          <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => setLightboxIdx(0)}>
            <img src={images[mainImg] || images[0]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
          </div>
          {/* Side images */}
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => setLightboxIdx(i)}>
              <img src={images[i] || images[0]} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              {i === 3 && images.length > 4 && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, flexDirection: "column", gap: 6 }}>
                  <Images size={28} />
                  +{images.length - 4} Photos
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Badge */}
        <div style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)" }}>
          <Images size={14} /> {images.length} Photos
        </div>
      </div>

      {/* ── Quick Stats Bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 24, height: 52, flexWrap: "wrap" }}>
          {property.bedrooms > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#475569" }}>
              <Bed size={16} style={{ color: "#C8A45A" }} /> <strong>{property.bedrooms}</strong> Beds
            </div>
          )}
          {property.bathrooms > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#475569" }}>
              <Bath size={16} style={{ color: "#C8A45A" }} /> <strong>{property.bathrooms}</strong> Baths
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#475569" }}>
            <Square size={16} style={{ color: "#C8A45A" }} /> <strong>{property.area?.value}</strong> {property.area?.unit}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <button onClick={handleShare} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ── Title + Price ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[property.purpose === "sale" ? "For Sale" : "For Rent", property.type].map(b => b && (
                <span key={b} style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>{b}</span>
              ))}
              {property.isVerified && (
                <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={11} /> Verified
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>{property.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 14 }}>
              <MapPin size={14} style={{ color: "#C8A45A" }} />
              {property.location?.address}, {property.location?.city}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Asking Price</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#C8A45A" }}>PKR {formatPrice(property.price)}</div>
            {property.purpose === "rent" && <div style={{ fontSize: 12, color: "#94a3b8" }}>per month</div>}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 22px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                color: activeTab === tab.id ? "#C8A45A" : "#64748b",
                borderBottom: activeTab === tab.id ? "2px solid #C8A45A" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>

        {/* Left: Tab content */}
        <div>
          {activeTab === "overview" && <OverviewTab property={property} />}
          {activeTab === "location" && <LocationTab property={property} />}
          {activeTab === "priceindex" && <PriceIndexTab property={property} />}
          {activeTab === "trends" && <TrendsTab property={property} />}
        </div>

        {/* Right: Sidebar */}
        <aside style={{ position: "sticky", top: 60 }}>
          {/* Price + Quick Actions */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#C8A45A", marginBottom: 14 }}>PKR {formatPrice(property.price)}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://wa.me/${displayAgent.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#25D366", color: "#fff", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href={`tel:${displayAgent.phone}`}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#C8A45A", color: "#fff", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                <Phone size={16} /> Call
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "24px" }}>
            <form onSubmit={handleInquiry}>
              <input placeholder="Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                style={inputStyle} />
              <input placeholder="Email *" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required
                style={inputStyle} />
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRight: "none", borderRadius: "8px 0 0 8px", padding: "10px 12px", fontSize: 13, color: "#64748b" }}>🇵🇰 +92</span>
                <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 0, borderRadius: "0 8px 8px 0", flex: 1 }} />
              </div>
              <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              {/* Role selector */}
              <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 13 }}>
                {["buyer", "agent", "other"].map(r => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#475569" }}>
                    <input type="radio" name="role" value={r} checked={formData.role === r} onChange={() => setFormData({ ...formData, role: r })} style={{ accentColor: "#C8A45A" }} />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </label>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", marginBottom: 14, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#C8A45A" }} />
                Keep me informed about similar properties.
              </label>
              <button type="submit" disabled={submitting}
                style={{ width: "100%", background: "#C8A45A", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Sending..." : "✉ Send Email"}
              </button>
            </form>

            {/* Agency */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>BSK GROUPS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={displayAgent.avatar || `https://ui-avatars.com/api/?name=${displayAgent.name}&background=C8A45A&color=fff`}
                  alt={displayAgent.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{displayAgent.name}</div>
                  <div style={{ fontSize: 12, color: "#C8A45A", fontWeight: 600 }}>{displayAgent.role || "Property Expert"}</div>
                </div>
                <span style={{ marginLeft: "auto", background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Secure transaction note */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
            <ShieldCheck size={14} style={{ color: "#C8A45A" }} /> BSK Secure Transaction
          </div>
        </aside>
      </div>

      {/* ── Similar Properties ── */}
      {similar.length > 0 && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Similar Listings</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {similar.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      )}

      {/* ── Safety Tips ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Safety Tips for Property Transactions</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>For your safety and protection when buying, selling, or renting property through BSK Groups:</p>
          <ul style={{ paddingLeft: 20, color: "#64748b", fontSize: 13, lineHeight: 2 }}>
            <li>Always meet in a safe, public location during daylight hours.</li>
            <li>Do not make any payment before proper verification of the property and completion of all legal formalities.</li>
            <li>Inspect the property thoroughly and ensure all details match the advertisement.</li>
            <li>Verify ownership documents through relevant authorities before finalizing any deal.</li>
          </ul>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: 1fr !important; grid-template-rows: 220px !important; }
          .gallery-grid > div:not(:first-child) { display: none; }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  marginBottom: 10,
  outline: "none",
  boxSizing: "border-box",
  color: "#1e293b",
  fontFamily: "inherit",
};