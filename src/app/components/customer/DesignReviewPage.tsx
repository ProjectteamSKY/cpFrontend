
import { useState, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  FileCheck, ShoppingBag, ArrowLeft, CheckCircle, Package,
  Layers, Scissors, Printer, ChevronRight, Shield, Truck,
  RotateCcw, Info, AlertCircle, BadgeCheck, Sparkles, ArrowRight,
  FileImage, Clock,
} from "lucide-react";
import api from "../../service/api";

// ─── Styles ──────────────────────────────────────────────────────────────────────

const STYLES = `

  .drp-root {
    font-family: 'DM Sans', sans-serif;
    --red: #C8352A;
    --red-light: #fdf2f1;
    --red-mid: rgba(200,53,42,0.12);
    --gray-50: #FAFAFA;
    --gray-100: #F4F4F5;
    --gray-200: #E4E4E7;
    --gray-400: #A1A1AA;
    --gray-600: #52525B;
    --gray-800: #27272A;
    --gray-900: #18181B;
    --green: #16A34A;
    --green-light: #F0FDF4;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06);
    --radius: 14px;
    --radius-sm: 8px;
    --radius-lg: 20px;
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--gray-50);
    min-height: 100vh;
  }

  .drp-serif { font-family: 'Playfair Display', serif; }

  @keyframes drp-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drp-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes drp-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }
  @keyframes drp-check-in {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }

  .drp-animate-up   { animation: drp-fade-up 0.5s ease both; }
  .drp-animate-up-d1 { animation-delay: 0.05s; }
  .drp-animate-up-d2 { animation-delay: 0.10s; }
  .drp-animate-up-d3 { animation-delay: 0.15s; }

  .drp-card {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-sm);
  }

  .drp-cta-btn {
    background: linear-gradient(135deg, var(--red) 0%, #e84c40 100%);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: all var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(200,53,42,0.28);
    font-family: 'DM Sans', sans-serif;
  }
  .drp-cta-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(200,53,42,0.35);
  }
  .drp-cta-btn:active:not(:disabled) { transform: translateY(0); }
  .drp-cta-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    background: var(--gray-400);
  }

  .drp-outline-btn {
    background: white;
    color: var(--gray-700);
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
  }
  .drp-outline-btn:hover {
    border-color: var(--gray-400);
    background: var(--gray-50);
  }

  .drp-spec-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    font-size: 13px;
    border-bottom: 1px solid var(--gray-100);
  }
  .drp-spec-row:last-child { border-bottom: none; }

  .drp-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 8px 0;
  }

  .drp-toast {
    animation: drp-fade-up 0.3s ease both;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-800);
    max-width: 320px;
  }

  .drp-design-preview {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--gray-200);
    transition: box-shadow var(--transition);
  }
  .drp-design-preview:hover {
    box-shadow: var(--shadow-md);
  }

  .drp-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .drp-step-done {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--green);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    animation: drp-check-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
`;

let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLES;
  document.head.appendChild(el);
  _stylesInjected = true;
}

// ─── Helper components ────────────────────────────────────────────────────────────

function Divider({ margin = 16 }: { margin?: number }) {
  return <div style={{ height: 1, background: "var(--gray-100)", margin: `${margin}px 0` }} />;
}

// ─── Main component ────────────────────────────────────────────────────────────────

export function DesignReviewPage() {
  injectStyles();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Safety check
  if (!state || !state.frontDesign) {
    return (
      <div className="drp-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--red-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AlertCircle size={28} color="var(--red)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>No Design Data Found</h2>
          <p style={{ color: "var(--gray-400)", marginBottom: 24, fontSize: 14 }}>Please configure your product and upload a design first.</p>
          <button className="drp-cta-btn" onClick={() => navigate(-1)} style={{ padding: "11px 28px", margin: "0 auto" }}>
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    product, variant, quantity: selectedQuantity, priceId,
    selected_options, frontDesign, backDesign,
    frontPreview, backPreview, sides,
  } = state;

  const accessToken = sessionStorage.getItem("access_token");

  // ── Helpers ─────────────────────────────────────────────────────────────────────

  const getCartId = async (userId: string): Promise<string> => {
    try {
      const response = await api.get(`/cart/carts/user/${userId}`);
      const carts = response.data;
      if (Array.isArray(carts) && carts.length > 0) return String(carts[0].id);
      const createResponse = await api.post("/cart/carts", {
        user_id: userId, status: "active", total_amount: 0, total_discount: 0,
      });
      return String(createResponse.data.id);
    } catch (err: any) {
      if (err.response?.status === 404) {
        const createResponse = await api.post("/cart/carts", {
          user_id: userId, status: "active", total_amount: 0, total_discount: 0,
        });
        return String(createResponse.data.id);
      }
      throw err;
    }
  };

  // ── Add to cart ──────────────────────────────────────────────────────────────────

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
    if (!userId) {
      showToast("info", "Please log in to continue");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      showToast("info", "Processing your order…");

      const cartId = await getCartId(userId);
      const quantityNumber = Number(selectedQuantity || variant.prices?.[0]?.min_qty || 1);

      const formData = new FormData();
      formData.append("cart_id", String(cartId));
      formData.append("product_id", String(product.id));
      formData.append("variant_id", String(variant.id));
      formData.append("quantity", String(quantityNumber));
      formData.append("product_variant_price_id", String(priceId));
      formData.append("customize_qty", String(quantityNumber));
      formData.append("selected_options", JSON.stringify(selected_options || {}));

      if (frontDesign) formData.append("front_file", frontDesign);
      if (sides === "2" && backDesign) formData.append("back_file", backDesign);

      await api.post("/cartitems/cart-items/with-files", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` },
      });

      showToast("success", "Item added to cart!");
      navigate("/cart");
    } catch (err: any) {
      const msg = err?.response?.data?.detail
        ? typeof err.response.data.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response.data.detail, null, 2)
        : err?.message || "Failed to add item to cart";

      showToast("error", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Price calc ────────────────────────────────────────────────────────────────────

  const quantityNumber = Number(selectedQuantity || variant?.prices?.[0]?.min_qty || 1);
  const price = variant?.prices?.find((p: any) => String(p.id) === String(priceId))?.price || 0;
  const subtotal = price;
  const gst = +(subtotal * 0.18).toFixed(2);
  // const deliveryCharge = 100;
  const total = +(subtotal + gst).toFixed(2);

  const completedSteps = [
    { label: "Product Selected", done: !!product },
    { label: "Options Configured", done: !!variant },
    { label: "Quantity Set", done: !!selectedQuantity },
    { label: "Design Uploaded", done: !!frontDesign },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────────

  return (
    <div className="drp-root bg-white!">

      {/* Breadcrumb */}
      <div style={{
        background: "white",
        borderBottom: "1px solid var(--gray-100)",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--gray-400)" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-600)", fontWeight: 500, fontSize: 12, fontFamily: "inherit", padding: 0 }}>Home</button>
          <ChevronRight size={12} color="var(--gray-300)" />
          <button onClick={() => navigate("/products")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-600)", fontWeight: 500, fontSize: 12, fontFamily: "inherit", padding: 0 }}>Products</button>
          <ChevronRight size={12} color="var(--gray-300)" />
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-600)", fontWeight: 500, fontSize: 12, fontFamily: "inherit", padding: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{product?.name}</button>
          <ChevronRight size={12} color="var(--gray-300)" />
          <span style={{ color: "var(--gray-900)", fontWeight: 600 }}>Design Review</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" ,background: "white"}}>

        {/* Header */}
        <div className="drp-animate-up" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <button onClick={() => navigate(-1)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "white", border: "1px solid var(--gray-200)",
                  borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "var(--gray-600)",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  <ArrowLeft size={13} /> Back
                </button>
              </div>
              <h1 className="drp-serif" style={{ fontSize: 32, fontWeight: 700, color: "var(--gray-900)", margin: 0, lineHeight: 1.2 }}>
                Review Your Order
              </h1>
              <p style={{ fontSize: 14, color: "var(--gray-400)", marginTop: 6 }}>
                Confirm your design and specifications before adding to cart.
              </p>
            </div>

          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Design Preview */}
            <div className="drp-card drp-animate-up" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                <Sparkles size={16} color="var(--red)" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", margin: 0 }}>Design Preview</h2>
              </div>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {/* Front */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray-400)", marginBottom: 8 }}>Front Side</p>
                  <div className="drp-design-preview" style={{ width: 180, height: 180, background: "var(--gray-50)" }}>
                    {frontPreview ? (
                      <img src={frontPreview} alt="Front" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <FileImage size={28} color="var(--gray-300)" />
                        <span style={{ fontSize: 11, color: "var(--gray-400)" }}>No preview</span>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>File Ready</span>
                  </div>
                </div>

                {/* Back */}
                {sides === "2" && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray-400)", marginBottom: 8 }}>Back Side</p>
                    <div className="drp-design-preview" style={{ width: 180, height: 180, background: "var(--gray-50)" }}>
                      {backPreview ? (
                        <img src={backPreview} alt="Back" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <FileImage size={28} color="var(--gray-300)" />
                          <span style={{ fontSize: 11, color: "var(--gray-400)" }}>No preview</span>
                        </div>
                      )}
                    </div>
                    {backPreview && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>File Ready</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Product info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray-400)", marginBottom: 8 }}>Product</p>
                  <h3 className="drp-serif" style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h3>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    <span className="drp-badge" style={{ background: "var(--red-light)", color: "var(--red)", border: "1px solid rgba(200,53,42,0.15)" }}>
                      {variant.size?.name}
                    </span>
                    <span className="drp-badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)", border: "1px solid var(--gray-200)" }}>
                      {sides === "1" ? "Single-Sided" : "Double-Sided"}
                    </span>
                  </div>
                  <div style={{ background: "var(--gray-50)", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 500 }}>Unit price</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "var(--red)" }}>₹{price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 500 }}>Quantity</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)" }}>{quantityNumber.toLocaleString()} pieces</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div
              className="drp-card drp-animate-up drp-animate-up-d1"
              style={{
                padding: 28,
                background: "linear-gradient(180deg,#ffffff 0%,#fafafa 100%)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--gray-900)",
                  margin: "0 0 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <Package size={16} color="var(--red)" />
                Product Specifications
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid var(--gray-200)"
                }}
              >
                {[
                  { Icon: Layers, label: "Size", value: variant.size?.name, color: "#6366F1" },
                  { Icon: Package, label: "Paper", value: variant.paperType?.name, color: "#10B981" },
                  { Icon: Printer, label: "Lamination", value: selected_options?.lamination || "Standard", color: "#F59E0B" },
                  { Icon: Scissors, label: "Cut Type", value: variant.cutType?.name, color: "#EC4899" },
                  { Icon: FileCheck, label: "Printing Sides", value: sides === "1" ? "Single Sided" : "Double Sided", color: "#2563EB" },
                  { Icon: Package, label: "Quantity", value: `${quantityNumber.toLocaleString()} pcs`, color: "#EF4444" },
                ].map(({ Icon, label, value, color }, i) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                      borderBottom: i < 4 ? "1px solid var(--gray-200)" : "none",
                      borderRight: i % 2 === 0 ? "1px solid var(--gray-200)" : "none",
                      transition: "all .2s ease"
                    }}
                  >
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 10,
                        background: `${color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Icon size={14} color={color} />
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--gray-400)",
                          marginBottom: 3
                        }}
                      >
                        {label}
                      </p>

                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--gray-900)"
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Info */}
            <div className="drp-animate-up drp-animate-up-d2" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
            }}>
              {[
                { icon: Truck, title: "Delivery", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF" },
                { icon: Clock, title: "Processing", desc: "Same-day dispatch", color: "#D97706", bg: "#FFFBEB" },
                { icon: Shield, title: "Quality", desc: "100% guaranteed", color: "#16A34A", bg: "#F0FDF4" },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="drp-card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-800)", marginBottom: 2 }}>{title}</p>
                    <p style={{ fontSize: 11, color: "var(--gray-400)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "14px 18px", borderRadius: 12,
                background: "#FEF2F2", border: "1px solid #FECACA",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5 }}>{error}</p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: "sticky", top: 64 }}>
            <div className="drp-card drp-animate-up" style={{ padding: 24 }}>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <ShoppingBag size={16} color="var(--red)" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", margin: 0 }}>Order Summary</h2>
              </div>

              {/* Price breakdown */}
              <div>
                <div className="drp-price-row">
                  <span style={{ color: "var(--gray-500)", fontWeight: 500 }}>
                    {quantityNumber.toLocaleString()} pcs × ₹{price.toFixed(2)}
                  </span>
                  <span style={{ color: "var(--gray-800)", fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="drp-price-row">
                  <span style={{ color: "var(--gray-500)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                    GST (18%)
                    <span title="Goods and Services Tax" style={{ cursor: "help" }}>
                      <Info size={11} color="var(--gray-400)" />
                    </span>
                  </span>
                  <span style={{ color: "var(--gray-800)", fontWeight: 600 }}>₹{gst.toLocaleString()}</span>
                </div>

              </div>

              <Divider />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "var(--red)", lineHeight: 1, margin: 0 }}>
                    ₹{total.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--gray-400)", marginTop: 3 }}>Inclusive of all taxes</p>
                </div>
              </div>

              <Divider margin={20} />

              {/* GST Invoice note */}
              <div style={{
                padding: "10px 12px", borderRadius: 10,
                background: "var(--green-light)", border: "1px solid #BBF7D0",
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 16, fontSize: 12, color: "var(--green)",
                fontWeight: 500,
              }}>
                <BadgeCheck size={14} color="var(--green)" style={{ flexShrink: 0 }} />
                GST invoice will be provided with your order
              </div>

              {/* CTA */}
              <button
                className="drp-cta-btn"
                onClick={handleAddToCart}
                disabled={loading}
                style={{ width: "100%", padding: "15px 24px" }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "drp-spin 0.8s linear infinite", flexShrink: 0 }} />
                    Processing…
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div style={{ marginTop: 12 }}>
                <Link to="/products" style={{ textDecoration: "none" }}>
                  <button className="drp-outline-btn" style={{ width: "100%", padding: "12px 24px" }}>
                    <RotateCcw size={14} />
                    Continue Shopping
                  </button>
                </Link>
              </div>

              <Divider margin={16} />

              {/* Trust */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: Shield, text: "256-bit SSL encrypted checkout" },
                  { icon: FileCheck, text: "Proofing available on request" },
                  { icon: RotateCcw, text: "Hassle-free reorder with saved design" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--gray-500)" }}>
                    <Icon size={12} color="var(--gray-400)" style={{ flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
          <div className="drp-toast">
            <div style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: toastMsg.type === "success" ? "var(--green)" : toastMsg.type === "error" ? "#DC2626" : "#2563EB",
            }} />
            {toastMsg.text}
          </div>
        </div>
      )}
    </div>
  );
}