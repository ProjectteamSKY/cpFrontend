import { useState, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  FileCheck, ShoppingBag, ArrowLeft, CheckCircle, Package,
  Layers, Scissors, Printer, ChevronRight, Shield, Truck,
  RotateCcw, Info, AlertCircle, BadgeCheck, Sparkles, ArrowRight,
  FileImage, Clock,
} from "lucide-react";
import api from "../../service/api";

// ─── Main component ────────────────────────────────────────────────────────────────

export function DesignReviewPage() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} color="#C8352A" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Design Data Found</h2>
          <p className="text-gray-400 mb-6 text-sm">Please configure your product and upload a design first.</p>
          <button 
            className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mx-auto" 
            onClick={() => navigate(-1)}
          >
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
  const total = +(subtotal + gst).toFixed(2);

  // ─── Render ───────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-11 flex items-center gap-1.5 text-xs text-gray-400">
          <button onClick={() => navigate("/")} className="bg-none border-none cursor-pointer text-gray-600 font-medium text-xs p-0">Home</button>
          <ChevronRight size={12} color="#D4D4D8" />
          <button onClick={() => navigate("/products")} className="bg-none border-none cursor-pointer text-gray-600 font-medium text-xs p-0">Products</button>
          <ChevronRight size={12} color="#D4D4D8" />
          <button onClick={() => navigate(-1)} className="bg-none border-none cursor-pointer text-gray-600 font-medium text-xs p-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">{product?.name}</button>
          <ChevronRight size={12} color="#D4D4D8" />
          <span className="text-gray-900 font-semibold">Design Review</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-16 bg-white">

        {/* Header */}
        <div className="animate-[fade-up_0.5s_ease_both] mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg py-1.5 px-3 cursor-pointer text-xs font-semibold text-gray-600 transition-all duration-200">
                  <ArrowLeft size={13} /> Back
                </button>
              </div>
              <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 m-0 leading-tight">
                Review Your Order
              </h1>
              <p className="text-sm text-gray-400 mt-1.5">
                Confirm your design and specifications before adding to cart.
              </p>
            </div>

          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">

          {/* Left */}
          <div className="flex flex-col gap-5">

            {/* Design Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 animate-[fade-up_0.5s_ease_both]">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} color="#C8352A" />
                <h2 className="text-base font-bold text-gray-900 m-0">Design Preview</h2>
              </div>

              <div className="flex gap-5 flex-wrap">
                {/* Front */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Front Side</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 transition-shadow duration-200 hover:shadow-md w-36 h-36 md:w-44 md:h-44 bg-gray-50">
                    {frontPreview ? (
                      <img src={frontPreview} alt="Front" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <FileImage size={28} color="#D4D4D8" />
                        <span className="text-[11px] text-gray-400">No preview</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                    <span className="text-[11px] text-green-600 font-semibold">File Ready</span>
                  </div>
                </div>

                {/* Back */}
                {sides === "2" && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Back Side</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 transition-shadow duration-200 hover:shadow-md w-36 h-36 md:w-44 md:h-44 bg-gray-50">
                      {backPreview ? (
                        <img src={backPreview} alt="Back" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <FileImage size={28} color="#D4D4D8" />
                          <span className="text-[11px] text-gray-400">No preview</span>
                        </div>
                      )}
                    </div>
                    {backPreview && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                        <span className="text-[11px] text-green-600 font-semibold">File Ready</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Product info */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Product</p>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-1.5 leading-tight">{product.name}</h3>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wide py-0.5 px-2 rounded-md bg-red-50 text-red-600 border border-red-100/80">
                      {variant.size?.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                      {sides === "1" ? "Single-Sided" : "Double-Sided"}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3.5">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-400 font-medium">Unit price</span>
                      <span className="text-xl font-extrabold text-red-600">₹{price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-400 font-medium">Quantity</span>
                      <span className="text-sm font-bold text-gray-800">{quantityNumber.toLocaleString()} pieces</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 animate-[fade-up_0.5s_ease_both] bg-gradient-to-b from-white to-gray-50 border-opacity-50 shadow-md"
            >
              <h2
                className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <Package size={16} color="#C8352A" />
                Product Specifications
              </h2>

              <div
                className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-gray-200"
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
                    className={`
                      flex items-center gap-3 p-3.5 px-4
                      ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      ${i < 4 ? 'border-b border-gray-200' : ''}
                      ${i % 2 === 0 ? 'border-r border-gray-200' : ''}
                      transition-all duration-200
                    `}
                  >
                    <div
                      className="p-2 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={14} color={color} />
                    </div>

                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5"
                      >
                        {label}
                      </p>

                      <p
                        className="text-[13px] font-semibold text-gray-900"
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-[fade-up_0.5s_ease_both]">
              {[
                { icon: Truck, title: "Delivery", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF" },
                { icon: Clock, title: "Processing", desc: "Same-day dispatch", color: "#D97706", bg: "#FFFBEB" },
                { icon: Shield, title: "Quality", desc: "100% guaranteed", color: "#16A34A", bg: "#F0FDF4" },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3.5 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 mb-0.5">{title}</p>
                    <p className="text-[11px] text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3.5 pl-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <AlertCircle size={15} color="#DC2626" className="shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-16">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-[fade-up_0.5s_ease_both]">

              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={16} color="#C8352A" />
                <h2 className="text-base font-bold text-gray-900 m-0">Order Summary</h2>
              </div>

              {/* Price breakdown */}
              <div>
                <div className="flex justify-between items-center text-[13px] py-2">
                  <span className="text-gray-500 font-medium">
                    {quantityNumber.toLocaleString()} pcs × ₹{price.toFixed(2)}
                  </span>
                  <span className="text-gray-800 font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] py-2">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    GST (18%)
                    <span title="Goods and Services Tax" className="cursor-help">
                      <Info size={11} color="#A1A1AA" />
                    </span>
                  </span>
                  <span className="text-gray-800 font-semibold">₹{gst.toLocaleString()}</span>
                </div>

              </div>

              <div className="h-px bg-gray-100 my-4" />

              <div className="flex justify-between items-baseline">
                <span className="text-[15px] font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <p className="text-[28px] font-extrabold text-red-600 leading-none m-0">
                    ₹{total.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-5" />

              {/* GST Invoice note */}
              <div className="p-2.5 pl-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 mb-4 text-xs text-green-600 font-medium">
                <BadgeCheck size={14} color="#16A34A" className="shrink-0" />
                GST invoice will be provided with your order
              </div>

              {/* CTA */}
              <button
                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-400"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
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

              <div className="mt-3">
                <Link to="/products" className="no-underline">
                  <button className="w-full py-3 px-6 bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                    <RotateCcw size={14} />
                    Continue Shopping
                  </button>
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              {/* Trust */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: Shield, text: "256-bit SSL encrypted checkout" },
                  { icon: FileCheck, text: "Proofing available on request" },
                  { icon: RotateCcw, text: "Hassle-free reorder with saved design" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Icon size={12} color="#A1A1AA" className="shrink-0" />
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
        <div className="fixed bottom-6 right-6 z-[999] animate-[fade-up_0.3s_ease_both]">
          <div className="bg-white rounded-xl shadow-lg p-3 px-4 flex items-center gap-2.5 text-[13px] font-medium text-gray-800 max-w-xs">
            <div className={`
              w-2 h-2 rounded-full shrink-0
              ${toastMsg.type === "success" ? "bg-green-600" : toastMsg.type === "error" ? "bg-red-600" : "bg-blue-600"}
            `} />
            {toastMsg.text}
          </div>
        </div>
      )}

      {/* Add keyframe animations to the page */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}