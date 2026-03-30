import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Package, Truck, CheckCircle, Clock, Printer,
  ChevronRight, MapPin, Calendar, CreditCard, Download, Share2,
  AlertCircle, ArrowLeft, Sparkles, ReceiptText, User, Phone, Home, BadgeCheck,
} from "lucide-react";
import axios from "axios";

const API_BASE   = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

const ORDER_STEPS = [
  { key: "pending",  label: "Placed",     icon: ShoppingBag, doneBg: "bg-amber-400",   ring: "ring-amber-200",   activeText: "text-amber-500",   activeBorder: "border-amber-400"   },
  { key: "process",  label: "Processing", icon: Clock,       doneBg: "bg-blue-400",    ring: "ring-blue-200",    activeText: "text-blue-500",    activeBorder: "border-blue-400"    },
  { key: "printing", label: "Printing",   icon: Printer,     doneBg: "bg-violet-400",  ring: "ring-violet-200",  activeText: "text-violet-500",  activeBorder: "border-violet-400"  },
  { key: "packed",   label: "Packed",     icon: Package,     doneBg: "bg-teal-400",    ring: "ring-teal-200",    activeText: "text-teal-500",    activeBorder: "border-teal-400"    },
  { key: "shipment", label: "Shipped",    icon: Truck,       doneBg: "bg-orange-400",  ring: "ring-orange-200",  activeText: "text-orange-500",  activeBorder: "border-orange-400"  },
  { key: "delivery", label: "Delivered",  icon: CheckCircle, doneBg: "bg-emerald-500", ring: "ring-emerald-200", activeText: "text-emerald-500", activeBorder: "border-emerald-400" },
];

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; ring: string; label: string }> = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   ring: "ring-amber-200",   label: "Pending"    },
  process:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    ring: "ring-blue-200",    label: "Processing" },
  printing: { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-400",  ring: "ring-violet-200",  label: "Printing"   },
  packed:   { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-400",    ring: "ring-teal-200",    label: "Packed"     },
  shipment: { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400",  ring: "ring-orange-200",  label: "Shipped"    },
  delivery: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-200", label: "Delivered"  },
  cancelled:{ bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     ring: "ring-red-200",     label: "Cancelled"  },
};

interface Address {
  id?: string;
  full_name?: string;   name?: string;
  phone?: string;       mobile?: string;
  address_line1?: string; address_line2?: string; address?: string;
  city?: string;        state?: string;
  pincode?: string;     postal_code?: string;
  landmark?: string;
  address_type?: string; type?: string;
  is_default?: boolean;
}

/* ══════════════════════════════════════════════════════════════════ */
export function ViewOrderPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order,     setOrder]     = useState<any>(null);
  const [items,     setItems]     = useState<any[]>([]);
  const [address,   setAddress]   = useState<Address | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const [oRes, iRes] = await Promise.all([
          axios.get(`${API_BASE}/orders_routes/${orderId}`),
          axios.get(`${API_BASE}/order_items_routes/list/${orderId}`),
        ]);
        const orderData = oRes.data;
        setOrder(orderData);
        setItems(iRes.data.items || []);

        const addressId = orderData.address_id || orderData.shipping_address_id;
        if (addressId) {
          try {
            const aRes = await axios.get(`${API_BASE}/user_address/${addressId}`);
            setAddress(aRes.data);
          } catch { /* silently ignore address fetch failure */ }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  /* ── Loading ──────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen w-full bg-orange-50/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-[3px] border-orange-100" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-600 animate-spin" />
        </div>
        <p className="text-[11px] tracking-widest uppercase text-orange-300 font-semibold">Loading your order</p>
      </div>
    </div>
  );

  /* ── Not found ────────────────────────────────────────────────── */
  if (!order) return (
    <div className="min-h-screen w-full bg-orange-50/30 flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-400 mb-7 leading-relaxed">This order doesn't exist or may have been removed.</p>
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>
    </div>
  );

  const currentIdx      = ORDER_STEPS.findIndex(s => s.key === order.status);
  const progressPercent = Math.max(0, Math.round((currentIdx / (ORDER_STEPS.length - 1)) * 100));
  const statusCfg       = STATUS_MAP[order.status] || STATUS_MAP.pending;

  const addrName     = address?.full_name     || address?.name     || "";
  const addrPhone    = address?.phone         || address?.mobile   || "";
  const addrLine1    = address?.address_line1 || address?.address  || "";
  const addrLine2    = address?.address_line2 || "";
  const addrCity     = address?.city          || "";
  const addrState    = address?.state         || "";
  const addrPin      = address?.pincode       || address?.postal_code || "";
  const addrLandmark = address?.landmark      || "";
  const addrType     = address?.address_type  || address?.type     || "";

  const estimatedDate = new Date(new Date(order.created_at).getTime() + 7 * 86400000)
    .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen w-full bg-orange-50/20">

      {/* ══ STICKY HEADER ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/orders")}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-100 bg-white text-xs font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>
            <div className="w-px h-7 bg-orange-100 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-800 leading-tight truncate">Order Details</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-100 bg-white text-xs font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Invoice</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-100 bg-white text-xs font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══ PAGE BODY ══════════════════════════════════════════════ */}
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── HERO ORDER CARD ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden"
        >
          {/* Top gradient stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">

              {/* Left – icon + meta */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200/60">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3 text-red-400" />
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <CreditCard className="w-3 h-3 text-red-400" />
                      {order.payment_method || "Online Payment"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <ShoppingBag className="w-3 h-3 text-red-400" />
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right – total amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Order Total</p>
                <p className="text-4xl font-extrabold text-red-600 leading-none tracking-tight">
                  ₹{order.total_amount?.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-gray-300 mt-1">Incl. all taxes</p>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="mt-5 pt-4 border-t border-orange-50 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <Truck className="w-3.5 h-3.5 text-red-400" />
                {order.status === "delivery"
                  ? `Delivered · ${new Date(order.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                  : `Est. delivery by ${estimatedDate}`}
              </span>
              {order.status === "delivery" && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <BadgeCheck className="w-3.5 h-3.5" /> Delivered
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <div className="inline-flex gap-1 bg-white border border-orange-100 rounded-2xl p-1.5 shadow-sm">
          {(["details", "tracking"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-red-50 text-red-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "details"
                ? <><ReceiptText className="w-3.5 h-3.5" /> Order Details</>
                : <><Truck className="w-3.5 h-3.5" /> Tracking</>}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-[12%] right-[12%] h-0.5 rounded-full bg-red-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── TAB PANELS ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ══ DETAILS TAB ════════════════════════════════════ */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="w-full space-y-4"
            >
              {/* Items list */}
              <div className="w-full bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <h3 className="text-base font-bold text-gray-800">Ordered Items</h3>
                  <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-3 py-0.5 rounded-full">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 sm:gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
                        {item.image
                          ? <img src={`${MEDIA_BASE}${item.image}`} alt="" className="w-full h-full object-cover" />
                          : <Package className="w-5 h-5 text-red-300" />}
                      </div>
                      {/* Name + qty */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.product_name || `Product #${item.product_id}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-red-600">
                          ₹{item.total?.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-gray-400">₹{item.price} × {item.quantity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="w-full bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <h3 className="text-base font-bold text-gray-800">Price Breakdown</h3>
                </div>
                <div>
                  {[
                    { label: "Item Subtotal",   value: `₹${Math.round(order.total_amount * 0.82).toLocaleString("en-IN")}`, green: false },
                    { label: "GST (18%)",        value: `₹${Math.round(order.total_amount * 0.18).toLocaleString("en-IN")}`, green: false },
                    { label: "Delivery Charges", value: "FREE",                                                              green: true  },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-3 border-b border-orange-50 last:border-0">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.green ? "text-emerald-600" : "text-gray-700"}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 mt-1 border-t-2 border-dashed border-orange-100">
                    <span className="text-sm font-bold text-gray-800">Order Total</span>
                    <span className="text-2xl font-extrabold text-red-600">
                      ₹{order.total_amount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ TRACKING TAB ═══════════════════════════════════ */}
          {activeTab === "tracking" && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="w-full space-y-4"
            >
              {/* Timeline card */}
              <div className="w-full bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-base font-bold text-gray-800">Shipment Timeline</h3>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-0.5 rounded-full">
                    {progressPercent}% complete
                  </span>
                </div>

                {/* Step nodes */}
                <div className="overflow-x-auto pb-3">
                  <div className="relative flex justify-between min-w-[380px]">

                    {/* Background track */}
                    <div className="absolute top-[22px] left-9 right-9 h-[3px] bg-orange-100 rounded-full z-0" />

                    {/* Progress fill — uses inline width only for the animated value */}
                    <motion.div
                      className="absolute top-[22px] left-9 h-[3px] bg-gradient-to-r from-red-600 to-orange-400 rounded-full z-[1]"
                      initial={{ width: 0 }}
                      animate={{ width: currentIdx <= 0 ? "0%" : `calc(${progressPercent}% - 36px)` }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    />

                    {ORDER_STEPS.map((step, idx) => {
                      const done    = idx < currentIdx;
                      const current = idx === currentIdx;
                      const Icon    = step.icon;

                      return (
                        <div key={step.key} className="relative z-[2] flex flex-col items-center flex-1">
                          <motion.div
                            className={`
                              w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300
                              ${done    ? `${step.doneBg} border-transparent shadow-md`                    : ""}
                              ${current ? `bg-white ${step.activeBorder} ${step.ring} ring-4`             : ""}
                              ${!done && !current ? "bg-orange-50 border-orange-200"                      : ""}
                            `}
                            animate={current ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ repeat: current ? Infinity : 0, duration: 2 }}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                done    ? "text-white"          :
                                current ? step.activeText       :
                                          "text-orange-200"
                              }`}
                            />
                          </motion.div>

                          <p className={`
                            text-[9px] font-bold text-center mt-2 tracking-wider uppercase leading-tight
                            ${done ? "text-gray-500" : current ? "text-red-600" : "text-gray-300"}
                          `}>
                            {step.label}
                          </p>

                          {current && (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1.5 text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5 tracking-wide"
                            >
                              NOW
                            </motion.span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery estimate */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-orange-100 shadow-sm flex items-center justify-center">
                    <Truck className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Estimated Delivery</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.status === "delivery"
                        ? `Delivered on ${new Date(order.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`
                        : estimatedDate}
                    </p>
                  </div>
                  {order.status === "delivery" && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                </motion.div>
              </div>

              {/* ── SHIPPING ADDRESS ─────────────────────────── */}
              <div className="w-full bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <h3 className="text-base font-bold text-gray-800">Shipping Address</h3>
                  {addrType && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                      {addrType}
                    </span>
                  )}
                </div>

                {address ? (
                  <div className="divide-y divide-orange-50">

                    {/* Full Name */}
                    {addrName && (
                      <div className="flex items-start gap-3 py-3 first:pt-0">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mt-0.5">
                          <User className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Full Name</p>
                          <p className="text-sm font-semibold text-gray-800">{addrName}</p>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {addrPhone && (
                      <div className="flex items-start gap-3 py-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Phone</p>
                          <p className="text-sm font-semibold text-gray-800">{addrPhone}</p>
                        </div>
                      </div>
                    )}

                    {/* Address lines */}
                    <div className="flex items-start gap-3 py-3 last:pb-0">
                      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mt-0.5">
                        <Home className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Delivery Address</p>
                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                          {[addrLine1, addrLine2].filter(Boolean).join(", ")}
                          {addrLandmark && (
                            <span className="block text-xs text-gray-400 mt-0.5">Near: {addrLandmark}</span>
                          )}
                          <span className="block">
                            {[addrCity, addrState].filter(Boolean).join(", ")}
                            {addrPin && ` — ${addrPin}`}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fallback */
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mt-0.5">
                      <Home className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {order.shipping_address || "Address not available"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ACTIONS ───────────────────────────────────── */}
        <div className="flex items-center justify-between pb-8 pt-1 w-full">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-100 bg-white text-sm font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>

          {order.status !== "delivery" && order.status !== "cancelled" && (
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold shadow-lg shadow-red-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-300 transition-all duration-200">
              Need Help <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}