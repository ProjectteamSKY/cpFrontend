import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  Share2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ReceiptText
} from "lucide-react";
import axios from "axios";

const API_BASE  = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

const ORDER_STEPS = [
  { key: "pending",  label: "Order Placed", icon: ShoppingBag, accent: "#f59e0b" },
  { key: "process",  label: "Processing",   icon: Clock,       accent: "#3b82f6" },
  { key: "printing", label: "Printing",     icon: Printer,     accent: "#8b5cf6" },
  { key: "packed",   label: "Packed",       icon: Package,     accent: "#14b8a6" },
  { key: "shipment", label: "Shipped",      icon: Truck,       accent: "#f97316" },
  { key: "delivery", label: "Delivered",    icon: CheckCircle, accent: "#10b981" },
];

export function ViewOrderPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order,     setOrder]     = useState<any>(null);
  const [items,     setItems]     = useState<any[]>([]);
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
        setOrder(oRes.data);
        setItems(iRes.data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  /* ─── Loading ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@600;700&display=swap');`}</style>
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#f0e4e0]" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#D73D32] animate-spin" />
        </div>
        <p className="text-xs text-[#b89090] tracking-widest uppercase">Loading order</p>
      </div>
    </div>
  );

  /* ─── Not found ────────────────────────────────────────────────────── */
  if (!order) return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@600;700&display=swap');`}</style>
      <div className="text-center max-w-sm">
        <AlertCircle className="w-12 h-12 text-[#dcc0bc] mx-auto mb-5" />
        <h2 className="text-3xl text-gray-800 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Not Found</h2>
        <p className="text-sm text-[#b89090] mb-8">This order doesn't exist or may have been removed.</p>
        <button onClick={() => navigate("/orders")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D73D32] text-white text-sm font-semibold shadow-md hover:bg-[#c0342a] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>
    </div>
  );

  const currentIdx       = ORDER_STEPS.findIndex(s => s.key === order.status);
  const progressPercent  = Math.round((currentIdx / (ORDER_STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-[#fdfaf7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');

        body { background: #fdfaf7; }

        /* ── shared ─────────────────────────────────────── */
        .warm-card {
          background: #ffffff;
          border: 1px solid #f0e8e2;
          border-radius: 22px;
          box-shadow: 0 2px 16px rgba(180,100,80,0.06);
        }

        /* ── header ─────────────────────────────────────── */
        .page-header {
          background: #fff;
          border-bottom: 1px solid #f0e8e2;
        }

        .icon-btn {
          border: 1.5px solid #f0e0dc;
          background: #fffaf9;
          border-radius: 12px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #9c7070;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .icon-btn:hover {
          border-color: #D73D32;
          color: #D73D32;
          background: #fff5f4;
        }

        /* ── hero card ───────────────────────────────────── */
        .hero-accent-bar {
          height: 4px;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(90deg, #D73D32 0%, #ff7a6e 60%, #ffd4cf 100%);
        }

        .amount-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: #D73D32;
        }

        /* ── tabs ────────────────────────────────────────── */
        .tab-btn {
          position: relative;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #b89090;
          border-radius: 12px;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }
        .tab-btn.active {
          color: #D73D32;
          background: #fff5f4;
        }
        .tab-underline {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 2.5px;
          border-radius: 2px;
          background: #D73D32;
        }

        /* ── items ───────────────────────────────────────── */
        .item-card {
          background: #fffaf9;
          border: 1px solid #f5ece7;
          border-radius: 18px;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .item-card:hover {
          box-shadow: 0 8px 28px rgba(215,61,50,0.08);
          transform: translateY(-2px);
        }

        .item-thumb {
          background: linear-gradient(135deg, #f5ece7 0%, #fce4df 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── tracking timeline ────────────────────────────── */
        .timeline-step-label {
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          margin-top: 10px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #c5a8a0;
        }
        .timeline-step-label.done {
          color: #5a5a5a;
        }
        .timeline-step-label.current {
          color: #D73D32;
        }

        .step-node {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #f0e4e0;
          background: #fdfaf7;
          color: #d4b4ae;
          transition: all 0.4s ease;
          position: relative;
        }
        .step-node.done {
          border-color: transparent;
          color: white;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }
        .step-node.current {
          border-color: #D73D32;
          color: #D73D32;
          box-shadow: 0 0 0 6px rgba(215,61,50,0.1);
        }

        .track-bar-bg {
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 3px;
          background: #f0e4e0;
          z-index: 0;
        }
        .track-bar-fill {
          position: absolute;
          top: 24px;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #D73D32, #ff7a6e);
          z-index: 1;
          border-radius: 999px;
        }

        /* ── delivery info box ───────────────────────────── */
        .delivery-box {
          background: linear-gradient(135deg, #fff5f3 0%, #fff8f0 100%);
          border: 1px solid #f0dcd6;
          border-radius: 18px;
        }

        /* ── address box ─────────────────────────────────── */
        .address-box {
          background: #fff;
          border: 1px solid #f0e8e2;
          border-radius: 18px;
        }

        /* ── price summary ───────────────────────────────── */
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f5ecea;
          font-size: 14px;
        }
        .summary-row:last-child {
          border-bottom: none;
        }

        /* ── footer actions ──────────────────────────────── */
        .btn-ghost {
          border: 1.5px solid #f0e0dc;
          background: transparent;
          color: #9c7070;
          border-radius: 14px;
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          border-color: #D73D32;
          color: #D73D32;
          background: #fff5f4;
        }

        .btn-red {
          background: linear-gradient(135deg, #D73D32, #c0342a);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 10px 28px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 20px rgba(215,61,50,0.3);
          transition: all 0.2s ease;
        }
        .btn-red:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(215,61,50,0.4);
        }

        .section-rule {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f0e4e0 20%, #f0e4e0 80%, transparent);
          margin: 0;
        }
      `}</style>

      {/* ═══ PAGE HEADER ═══════════════════════════════════════════════ */}
      <div className="page-header sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="icon-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Orders
            </button>
            <div>
              <h1
                className="text-2xl text-gray-800"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                Order Details
              </h1>
              <p className="text-xs text-[#b89090] -mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="icon-btn">
              <Download className="w-3.5 h-3.5" /> Invoice
            </button>
            <button className="icon-btn">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ═══ HERO ORDER CARD ════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="warm-card overflow-hidden"
        >
          <div className="hero-accent-bar" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Left */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D73D32] to-[#ff7a6e] flex items-center justify-center shadow-lg shadow-red-200/60 flex-shrink-0">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2
                      className="text-xl text-gray-800"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                    >
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex flex-wrap gap-5 text-sm text-[#9c7070]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D73D32]" />
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#D73D32]" />
                      {order.payment_method || "Online Payment"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[#b89090] uppercase tracking-widest mb-1">Total Amount</p>
                <p className="amount-display" style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                  ₹{order.total_amount?.toLocaleString()}
                </p>
                <p className="text-xs text-[#c5a8a0] mt-1">Incl. all taxes</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ TABS ════════════════════════════════════════════════════ */}
        <div className="flex gap-1 bg-white border border-[#f0e8e2] rounded-2xl p-1.5 shadow-sm w-fit">
          {(["details", "tracking"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab === "details" ? (
                <span className="flex items-center gap-2"><ReceiptText className="w-3.5 h-3.5" /> Order Details</span>
              ) : (
                <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> Tracking</span>
              )}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="tab-underline" />
              )}
            </button>
          ))}
        </div>

        {/* ═══ TAB CONTENT ════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ── Details tab ─────────────────────────────────────────── */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Items heading */}
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-[#D73D32]" />
                <h3
                  className="text-xl text-gray-800"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                >
                  Ordered Items
                </h3>
                <span className="ml-auto text-xs text-[#b89090]">{items.length} item{items.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="item-card p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="item-thumb w-16 h-16 flex-shrink-0">
                        {item.image
                          ? <img src={`${MEDIA_BASE}${item.image}`} alt="" className="w-full h-full object-cover rounded-[14px]" />
                          : <Package className="w-7 h-7 text-[#D73D32]/40" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {item.product_name || `Product #${item.product_id}`}
                        </p>
                        <p className="text-xs text-[#b89090] mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className="font-bold text-[#D73D32]"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem" }}
                        >
                          ₹{item.total?.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#b89090]">₹{item.price} × {item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Price summary */}
              <div className="warm-card p-6">
                <h4 className="text-xs uppercase tracking-widest text-[#b89090] mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D73D32]" /> Price Summary
                </h4>
                <div>
                  {[
                    { label: "Subtotal", value: `₹${(order.total_amount * 0.82).toFixed(0)}` },
                    { label: "GST (18%)", value: `₹${(order.total_amount * 0.18).toFixed(0)}` },
                    { label: "Delivery", value: "Free" },
                  ].map(row => (
                    <div key={row.label} className="summary-row">
                      <span className="text-[#9c7070]">{row.label}</span>
                      <span className="text-gray-700 font-medium">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-1">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span
                      className="text-[#D73D32] font-bold"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}
                    >
                      ₹{order.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Tracking tab ────────────────────────────────────────── */}
          {activeTab === "tracking" && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Timeline card */}
              <div className="warm-card p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3
                    className="text-xl text-gray-800"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                  >
                    Order Timeline
                  </h3>
                  <span className="text-xs text-[#b89090] uppercase tracking-widest">
                    {progressPercent}% complete
                  </span>
                </div>

                {/* Step nodes */}
                <div className="relative px-6 overflow-x-auto">
                  {/* Track bar bg */}
                  <div className="track-bar-bg" style={{ left: "40px", right: "40px" }} />
                  {/* Track bar fill */}
                  <motion.div
                    className="track-bar-fill"
                    style={{ left: "40px" }}
                    initial={{ width: 0 }}
                    animate={{ width: `calc(${progressPercent}% - 40px)` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  />

                  <div className="relative flex justify-between gap-0">
                    {ORDER_STEPS.map((step, idx) => {
                      const isDone    = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      const Icon      = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center" style={{ minWidth: 72 }}>
                          <motion.div
                            className={`step-node z-10 ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                            style={isDone ? { background: step.accent, borderColor: step.accent } : {}}
                            animate={isCurrent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                            transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.8 }}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <p className={`timeline-step-label ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1.5 text-[10px] font-semibold text-[#D73D32] bg-red-50 border border-red-100 rounded-full px-2 py-0.5"
                            >
                              Now
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
                  transition={{ delay: 0.6 }}
                  className="delivery-box mt-8 p-5 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-red-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[#D73D32]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#b89090] uppercase tracking-wider">Estimated Delivery</p>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {order.status === "delivery"
                        ? `Delivered on ${new Date(order.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`
                        : new Date(
                            new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      }
                    </p>
                  </div>
                  {order.status === "delivery" && (
                    <CheckCircle className="ml-auto w-5 h-5 text-emerald-500" />
                  )}
                </motion.div>
              </div>

              {/* Shipping address */}
              <div className="address-box p-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#D73D32]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#b89090] mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {order.shipping_address || "123 Business Street, Tech Park, Bengaluru — 560001"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ FOOTER ACTIONS ════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <button onClick={() => navigate("/orders")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>

          {order.status !== "delivery" && order.status !== "cancelled" && (
            <button className="btn-red">
              Need Help? <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Tiny helpers ─────────────────────────────────────────────────────── */
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending:  { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  label: "Pending" },
    process:  { bg: "bg-sky-50",     text: "text-sky-700",    dot: "bg-sky-400",    label: "Processing" },
    printing: { bg: "bg-violet-50",  text: "text-violet-700", dot: "bg-violet-400", label: "Printing" },
    packed:   { bg: "bg-teal-50",    text: "text-teal-700",   dot: "bg-teal-400",   label: "Packed" },
    shipment: { bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400", label: "Shipped" },
    delivery: { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-400",label: "Delivered" },
    cancelled:{ bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400",    label: "Cancelled" },
  };
  const c = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border border-current/20`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}