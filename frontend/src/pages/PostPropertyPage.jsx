import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { propertyAPI, uploadAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Upload, X, MapPin, Home, FileText, Star,
  ChevronRight, ChevronLeft, Check, Building2,
  Bed, Bath, Layers, UtensilsCrossed, Car, Plus, Minus,
  Sparkles, ArrowRight,
} from "lucide-react";
import styles from "./PostPropertyPage.module.css";

/* ─────────────────────────── constants ─────────────────────────── */
const TYPES = ["house", "apartment", "plot", "commercial", "villa", "farmhouse", "room", "office", "shop", "warehouse"];
const AREA_UNITS = ["marla", "kanal", "sqft", "sqm", "sqyd"];
const CITIES = ["Peshawar", "Islamabad", "Lahore", "Karachi", "Rawalpindi", "Mardan", "Abbottabad", "Nowshera"];
const PRICE_TYPES = ["fixed", "negotiable", "per_month", "per_year"];
const FEATURES_LIST = [
  "mainRoads", "electricityBackup", "centralAc", "security", "gym", "swimmingPool",
  "garden", "mosque", "community", "doubleGlazedWindows", "sewerage", "cornerPlot",
  "facingPark", "boundaryWall", "servantQuarters", "laundryRoom", "storeRoom",
];
const TYPE_ICONS = {
  house: Home,
  apartment: Building2,
  plot: MapPin,
  commercial: Building2,
  villa: Home,
  farmhouse: Home,
  room: Bed,
  office: FileText,
  shop: Building2,
  warehouse: Layers
};
const STEPS = [
  { label: "Basic Info", short: "Info", icon: FileText },
  { label: "Details", short: "Details", icon: Building2 },
  { label: "Location", short: "Location", icon: MapPin },
  { label: "Images", short: "Images", icon: Upload },
  { label: "Features", short: "Features", icon: Star },
];
const FEATURE_ICONS = {
  mainRoads: "🛣️", electricityBackup: "⚡", centralAc: "❄️", security: "🔒",
  gym: "🏋️", swimmingPool: "🏊", garden: "🌿", mosque: "🕌", community: "🏘️",
  doubleGlazedWindows: "🪟", sewerage: "🔧", cornerPlot: "📐", facingPark: "🌳",
  boundaryWall: "🧱", servantQuarters: "🏠", laundryRoom: "🧺", storeRoom: "📦",
};
const featureLabel = (k) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

/* ───────────────────── CounterField ───────────────────── */
function CounterField({ label, icon: Icon, value, onChange, min = 0 }) {
  return (
    <div className={styles.counterCard}>
      <div className={styles.counterHead}>
        <div className={styles.counterIcon}>
          {Icon && <Icon size={16} />}
        </div>
        <span className={styles.counterLabel}>{label}</span>
      </div>
      <div className={styles.counterControls}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={styles.counterBtn}
        >
          <Minus size={14} />
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className={styles.counterBtn}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─────────────────────────── */
export default function PostPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", purpose: "sale", type: "house",
    price: "", priceType: "fixed", currency: "PKR",
    area: { value: "", unit: "marla" },
    bedrooms: 0, bathrooms: 0, floors: 1, kitchens: 0, garages: 0,
    location: {
      address: "", city: "Peshawar", area: "",
      society: "", province: "Khyber Pakhtunkhwa", country: "Pakistan",
    },
    features: {},
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setNested = (par, k, v) => setForm((p) => ({ ...p, [par]: { ...p[par], [k]: v } }));
  const toggleFeat = (k) => setForm((p) => ({ ...p, features: { ...p.features, [k]: !p.features[k] } }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      const { data } = await uploadAPI.uploadImages(fd);
      setImages((prev) => [
        ...prev,
        ...data.images.map((img, i) => ({ ...img, isMain: prev.length === 0 && i === 0 })),
      ]);
      toast.success(`${data.images.length} image(s) uploaded`);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) =>
    setImages((prev) => {
      const n = prev.filter((_, i) => i !== idx);
      if (n.length && !n.some((i) => i.isMain)) n[0].isMain = true;
      return n;
    });

  const setMainImage = (idx) =>
    setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === idx })));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location.address) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Check if images are present, if not show a warning but allow submission
    if (!images.length) {
      const confirmPost = window.confirm("You haven't uploaded any images. Properties without images get less engagement. Are you sure you want to post?");
      if (!confirmPost) return;
    }

    setSubmitting(true);
    try {
      await propertyAPI.create({
        ...form,
        images,
        area: { value: Number(form.area.value), unit: form.area.unit },
        price: Number(form.price),
      });
      toast.success("Property posted! Pending approval.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post property");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;
  const selectedFeatureCount = Object.values(form.features).filter(Boolean).length;

  return (
    <>
      <Helmet><title>Post Property | BSK Groups</title></Helmet>

      <div className={`${styles.root} ${styles.page}`}>

        {/* ══ Hero ══ */}
        <div className={styles.hero}>
          <div className={styles.heroBgBlob1} />
          <div className={styles.heroBgBlob2} />
          <div className={styles.heroGrid} />
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Premium Listing Service
            </div>
            <h1 className={styles.heroTitle}>
              Post Your <span className={styles.heroAccent}>Property</span>
            </h1>
            <p className={styles.heroSub}>
              Join Pakistan's fastest-growing real estate network. List your
              property in minutes and reach millions.
            </p>
          </div>
        </div>

        {/* ══ Main ══ */}
        <div className={styles.container}>

          {/* ── Stepper ── */}
          <div className={styles.stepperCard}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
            <div className={styles.stepsRow}>
              {STEPS.map(({ label, short, icon: Icon }, i) => {
                const n = i + 1, isActive = n === step, isDone = n < step;
                return (
                  <div key={label} className={styles.stepItem}>
                    <button
                      type="button"
                      onClick={() => isDone && setStep(n)}
                      className={[
                        styles.stepBtn,
                        isActive ? styles.active : "",
                        isDone ? styles.done : "",
                      ].join(" ")}
                    >
                      {isDone ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                      {isActive && <span className={styles.stepPulse} />}
                    </button>
                    <span className={[
                      styles.stepLabel,
                      isActive ? styles.active : "",
                      isDone ? styles.done : "",
                    ].join(" ")}>
                      {short}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form Card ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formCard}>

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardHeaderIcon}>
                    {(() => { const Icon = STEPS[step - 1].icon; return <Icon size={24} />; })()}
                  </div>
                  <div>
                    <h2 className={styles.cardTitle}>{STEPS[step - 1].label}</h2>
                    <p className={styles.cardSub}>Step {step} of {STEPS.length}</p>
                  </div>
                </div>
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  <span className={styles.liveText}>Live Support Active</span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>

                {/* ════ Step 1: Basic Info ════ */}
                {step === 1 && (
                  <div className={styles.step1Grid}>
                    {/* Top Row: Purpose & Type */}
                    <div className={styles.step1Header}>
                      <div className={styles.sidePanel}>
                        <div className={styles.mb3}>
                          <label className={styles.fieldLabel}>Listing Purpose</label>
                          <div className={styles.purposeOptions}>
                            {[["sale", "For Sale"], ["rent", "For Rent"], ["lease", "For Lease"]].map(([val, txt]) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => set("purpose", val)}
                                className={[styles.purposeBtn, form.purpose === val ? styles.selected : ""].join(" ")}
                              >
                                {txt}
                                <div className={styles.purposeCheck}>
                                  {form.purpose === val && <Check size={10} strokeWidth={4} color="white" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={styles.fieldLabel}>Property Type</label>
                          <div className={styles.typeGrid}>
                            {TYPES.map((t) => {
                              const Icon = TYPE_ICONS[t] || Home;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => set("type", t)}
                                  className={[styles.typeBtn, form.type === t ? styles.selected : ""].join(" ")}
                                >
                                  <Icon size={18} />
                                  <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Title & Price */}
                    <div className={styles.step1Main}>
                      <div className={styles.mainFieldsGrid}>
                        <div>
                          <label className={styles.fieldLabel}>
                            Property Title <span className={styles.required}>*</span>
                          </label>
                          <input
                            className={styles.input}
                            placeholder="e.g. Luxury 5 Marla House for Sale in DHA Peshawar"
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            required
                          />
                        </div>

                        <div className={styles.priceSection}>
                          <div className={styles.priceGrid}>
                            <div>
                              <label className={styles.fieldLabel}>
                                Asking Price (PKR) <span className={styles.required}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <span className={styles.inputPrefix}>₨</span>
                                <input
                                  type="number"
                                  className={`${styles.input} ${styles.inputPrefixed}`}
                                  placeholder="e.g. 15,000,000"
                                  value={form.price}
                                  onChange={(e) => set("price", e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className={styles.fieldLabel}>Price Structure</label>
                              <select
                                className={styles.select}
                                value={form.priceType}
                                onChange={(e) => set("priceType", e.target.value)}
                              >
                                {PRICE_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.mt4}>
                        <label className={styles.fieldLabel}>
                          Detailed Description <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrapper}>
                          <textarea
                            className={styles.textarea}
                            placeholder="Describe your property in detail — renovations, neighbourhood vibes, proximity to amenities…"
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            required
                          />
                          <span className={[
                            styles.charCount,
                            form.description.length >= 100 ? styles.charCountMet : "",
                          ].join(" ")}>
                            {form.description.length} / 100+
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ════ Step 2: Details ════ */}
                {step === 2 && (
                  <div>
                    {/* Area panel */}
                    <div className={styles.areaPanel}>
                      <div className={styles.areaPanelGlow} />
                      <div className={styles.areaPanelInner}>
                        <div>
                          <div className={styles.areaBadge}>
                            <Layers size={12} />
                            Dimension Specs
                          </div>
                          <h3 className={styles.areaTitle}>Property Size</h3>
                          <p className={styles.areaDesc}>
                            Enter the exact area of your property. Accurate measurements
                            improve search matching.
                          </p>
                        </div>
                        <div className={styles.areaControls}>
                          <input
                            type="number"
                            className={styles.areaInput}
                            placeholder="0.00"
                            value={form.area.value}
                            onChange={(e) => setNested("area", "value", e.target.value)}
                            required
                          />
                          <div className={styles.unitTabs}>
                            {AREA_UNITS.map((u) => (
                              <button
                                key={u}
                                type="button"
                                onClick={() => setNested("area", "unit", u)}
                                className={[styles.unitTab, form.area.unit === u ? styles.active : ""].join(" ")}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Counters */}
                    <div className={styles.sectionDivider}>
                      <div className={styles.sectionLine} />
                      <span className={styles.sectionTitle}>Interior Configuration</span>
                      <div className={styles.sectionLine} />
                    </div>
                    <div className={styles.countersGrid}>
                      <CounterField label="Floors" icon={Layers} value={form.floors} onChange={(v) => set("floors", v)} min={1} />
                      <CounterField label="Beds" icon={Bed} value={form.bedrooms} onChange={(v) => set("bedrooms", v)} min={0} />
                      <CounterField label="Baths" icon={Bath} value={form.bathrooms} onChange={(v) => set("bathrooms", v)} min={0} />
                      <CounterField label="Kitchens" icon={UtensilsCrossed} value={form.kitchens} onChange={(v) => set("kitchens", v)} min={0} />
                      <CounterField label="Garages" icon={Car} value={form.garages} onChange={(v) => set("garages", v)} min={0} />
                    </div>
                  </div>
                )}

                {/* ════ Step 3: Location ════ */}
                {step === 3 && (
                  <div>
                    <div className={styles.mapPreview}>
                      <div className={styles.mapOverlay}>
                        <div className={styles.mapPin}>
                          <MapPin size={28} strokeWidth={2} />
                        </div>
                        <p className={styles.mapLabel}>Precise Location</p>
                      </div>
                      <span className={styles.mapTag}>Map Preview</span>
                    </div>

                    <div className={styles.locationGrid}>
                      <div className={styles.locationFullCol}>
                        <label className={styles.fieldLabel}>
                          Street Address / House Number <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}><Home size={18} /></span>
                          <input
                            className={`${styles.input} ${styles.inputPadded}`}
                            placeholder="e.g. House #123, Street 4, Sector G-11"
                            value={form.location.address}
                            onChange={(e) => setNested("location", "address", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className={styles.fieldLabel}>
                          Select City <span className={styles.required}>*</span>
                        </label>
                        <select
                          className={styles.select}
                          value={form.location.city}
                          onChange={(e) => setNested("location", "city", e.target.value)}
                        >
                          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className={styles.fieldLabel}>Area / Sector</label>
                        <input
                          className={styles.input}
                          placeholder="e.g. Hayatabad, Phase 7"
                          value={form.location.area}
                          onChange={(e) => setNested("location", "area", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={styles.fieldLabel}>Society / Colony</label>
                        <input
                          className={styles.input}
                          placeholder="e.g. DHA Peshawar"
                          value={form.location.society}
                          onChange={(e) => setNested("location", "society", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={styles.fieldLabel}>Province / State</label>
                        <input
                          className={styles.input}
                          value={form.location.province}
                          onChange={(e) => setNested("location", "province", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ════ Step 4: Images ════ */}
                {step === 4 && (
                  <div>
                    <label className={styles.dropzone}>
                      <div className={styles.dropzoneIcon}>
                        {uploading
                          ? <div className={styles.dropzoneSpinner} />
                          : <Upload size={32} strokeWidth={1.5} />
                        }
                      </div>
                      <h3 className={styles.dropzoneTitle}>
                        {uploading ? "Uploading…" : "Visual Showcase"}
                      </h3>
                      <p className={styles.dropzoneSub}>
                        Properties with great images get <strong>300% more</strong> engagement.
                      </p>
                      {!images.length && (
                        <div className={styles.imageWarning}>
                          ⚠️ No images added yet. You can still post, but we recommend adding at least 3 photos.
                        </div>
                      )}
                      <div className={styles.dropzoneMeta}>
                        {["JPG / PNG / WebP", "Max 10 MB", "Up to 10 Photos"].map((t) => (
                          <span key={t} className={styles.dropzoneMetaItem}>
                            <Check size={12} /> {t}
                          </span>
                        ))}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className={styles.srOnly}
                      />
                    </label>

                    {images.length > 0 && (
                      <div className={styles.imagesGrid}>
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className={[styles.imageItem, img.isMain ? styles.mainImage : ""].join(" ")}
                          >
                            <img loading="lazy" src={img.url} alt={`Property ${i + 1}`} />
                            <div className={styles.imageOverlay}>
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className={styles.removeBtn}
                              >
                                <X size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setMainImage(i)}
                                className={[styles.coverBtn, img.isMain ? styles.active : ""].join(" ")}
                              >
                                {img.isMain ? "Cover Photo ✓" : "Set as Cover"}
                              </button>
                            </div>
                            {img.isMain && <span className={styles.coverBadge}>Cover</span>}
                          </div>
                        ))}
                        {images.length < 10 && (
                          <label className={styles.addMoreBtn}>
                            <div className={styles.addMoreIcon}>
                              <Plus size={20} />
                            </div>
                            <span className={styles.addMoreText}>Add More</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className={styles.srOnly}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ════ Step 5: Features ════ */}
                {step === 5 && (
                  <div>
                    <div className={styles.featuresMeta}>
                      <div className={styles.featuresMetaText}>
                        <h3>Amenities &amp; Features</h3>
                        <p>Select all the facilities available at your property.</p>
                      </div>
                      <div className={styles.featuresCount}>
                        {selectedFeatureCount} Selected
                      </div>
                    </div>

                    <div className={styles.featuresGrid}>
                      {FEATURES_LIST.map((f) => (
                        <label
                          key={f}
                          className={[styles.featureCard, form.features[f] ? styles.selected : ""].join(" ")}
                        >
                          <input
                            type="checkbox"
                            checked={!!form.features[f]}
                            onChange={() => toggleFeat(f)}
                            className={styles.srOnly}
                          />
                          <div className={styles.featureEmoji}>
                            {FEATURE_ICONS[f] ?? "✓"}
                          </div>
                          <span className={styles.featureName}>{featureLabel(f)}</span>
                          {form.features[f] && (
                            <div className={styles.featureCheckmark}>
                              <Check size={12} strokeWidth={3} color="white" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              </div>{/* end cardBody */}
            </div>{/* end formCard */}

            {/* ── Navigation Bar ── */}
            <div className={styles.navBar}>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className={styles.backBtn}
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              ) : (
                <div style={{ width: 40 }} />
              )}

              <div className={styles.navDots}>
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={[
                      styles.navDot,
                      i + 1 === step ? styles.active : "",
                      i + 1 < step ? styles.done : "",
                    ].join(" ")}
                  />
                ))}
              </div>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className={styles.nextBtn}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.submitBtn}
                >
                  <div className={styles.submitShine} />
                  {submitting
                    ? <><div className={styles.submitSpinner} /> Publishing…</>
                    : <><Sparkles size={18} /> Launch Listing <ArrowRight size={18} /></>
                  }
                </button>
              )}
            </div>

            <p className={styles.terms}>
              By publishing, you agree to our{" "}
              <a href="/terms">Terms of Service</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
