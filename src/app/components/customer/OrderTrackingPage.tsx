import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
  Calendar,
  CreditCard,
  AlertCircle,
  Filter,
  ArrowRight,
  Layers
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

const API_BASE = "http://54.206.3.97/api";

const STATUS_CONFIG: Record<string, {
  icon: any;
  label: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
}> = {
  pending:  { icon: ShoppingBag, label: "Pending",          bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  border: "border-amber-200" },
  process:  { icon: Clock,       label: "Processing",       bg: "bg-sky-50",     text: "text-sky-700",    dot: "bg-sky-400",    border: "border-sky-200" },
  printing: { icon: Printer,     label: "Printing",         bg: "bg-violet-50",  text: "text-violet-700", dot: "bg-violet-400", border: "border-violet-200" },
  packed:   { icon: Package,     label: "Packed",           bg: "bg-teal-50",    text: "text-teal-700",   dot: "bg-teal-400",   border: "border-teal-200" },
  shipment: { icon: Truck,       label: "Shipped",          bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400", border: "border-orange-200" },
  delivery: { icon: CheckCircle, label: "Out for Delivery", bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-400",border: "border-emerald-200" },
};

const FILTER_TABS = [
  { id: "all",      label: "All Orders",  icon: Layers },
  { id: "pending",  label: "Pending",     icon: Clock },
  { id: "printing", label: "Printing",    icon: Printer },
  { id: "shipment", label: "Shipped",     icon: Truck },
];

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    (async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const res = await axios.get(`${API_BASE}/orders_routes/list/${userId}`);
        setOrders(res.data);
      } catch {
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = orders.reduce((acc: any, o: any) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  /* ─── Loading ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="flex items-center justify-center py-32" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@600;700&display=swap');`}</style>
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#f0e8e8]" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#D73D32] animate-spin" />
        </div>
        <p className="text-sm text-[#9c7c7c] tracking-widest uppercase">Loading orders</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "transparent" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');

        .order-card {
          background: #fff;
          border: 1px solid #f0ebe5;
          border-radius: 20px;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 12px rgba(180,120,100,0.06);
        }
        .order-card:hover {
          box-shadow: 0 12px 40px rgba(180,100,80,0.12);
          transform: translateY(-3px);
        }

        .filter-pill {
          border: 1.5px solid #f0e8e5;
          background: #fffaf9;
          color: #9c7070;
          border-radius: 999px;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
        }
        .filter-pill:hover {
          border-color: #D73D32;
          color: #D73D32;
          background: #fff5f4;
        }
        .filter-pill.active {
          background: #D73D32;
          border-color: #D73D32;
          color: #fff;
          box-shadow: 0 4px 16px rgba(215,61,50,0.3);
        }

        .stat-tile {
          background: #fff;
          border: 1px solid #f0ebe5;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(180,100,80,0.05);
        }
        .stat-tile:hover {
          border-color: #D73D32;
          box-shadow: 0 6px 24px rgba(215,61,50,0.1);
          transform: translateY(-2px);
        }
        .stat-tile.active {
          background: linear-gradient(135deg, #D73D32 0%, #c4352a 100%);
          border-color: #D73D32;
          color: #fff;
          box-shadow: 0 8px 28px rgba(215,61,50,0.35);
        }

        .view-btn {
          background: #fff;
          border: 1.5px solid #f0e0dc;
          color: #D73D32;
          border-radius: 12px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .view-btn:hover {
          background: #D73D32;
          color: #fff;
          border-color: #D73D32;
          box-shadow: 0 4px 16px rgba(215,61,50,0.3);
          gap: 10px;
        }

        .progress-track {
          background: #f5eeeb;
          border-radius: 999px;
          height: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D73D32, #ff6b5e);
          border-radius: 999px;
        }

        .empty-state {
          border: 2px dashed #f0e0dc;
          border-radius: 24px;
          background: #fffaf9;
        }

        .section-rule {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f0e0dc 20%, #f0e0dc 80%, transparent);
          margin: 0;
        }
      `}</style>

      {/* Section heading */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-1">
          <h2
            className="text-4xl text-gray-900"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            My Orders
          </h2>
          <span className="text-sm text-[#b89090] mb-1 tracking-widest uppercase">
            {orders.length} total
          </span>
        </div>
        <hr className="section-rule" />
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {FILTER_TABS.map(({ id, label, icon: Icon }, i) => {
          const count = id === "all" ? orders.length : counts[id] || 0;
          const isActive = filter === id;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setFilter(id)}
              className={`stat-tile ${isActive ? "active" : ""} p-4 text-left`}
            >
              <Icon className={`w-4 h-4 mb-3 ${isActive ? "opacity-80" : "text-[#D73D32]"}`} />
              <p className={`text-2xl font-bold mb-0.5 ${isActive ? "text-white" : "text-gray-800"}`}>{count}</p>
              <p className={`text-xs uppercase tracking-wider ${isActive ? "text-white/70" : "text-[#b89090]"}`}>{label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Filter pills (mobile-friendly scrollable row) */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`filter-pill flex items-center gap-1.5 px-4 py-1.5 whitespace-nowrap ${filter === key ? "active" : ""}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filter === key ? "bg-white/80" : cfg.dot}`}></span>
            {cfg.label}
          </button>
        ))}
        <button
          onClick={() => setFilter("all")}
          className={`filter-pill flex items-center gap-1.5 px-4 py-1.5 whitespace-nowrap ${filter === "all" ? "active" : ""}`}
        >
          All
        </button>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state p-16 text-center"
        >
          <Package className="w-10 h-10 text-[#dcc8c4] mx-auto mb-4" />
          <h3
            className="text-2xl text-gray-700 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {filter === "all" ? "No orders yet" : `No ${STATUS_CONFIG[filter]?.label ?? filter} orders`}
          </h3>
          <p className="text-sm text-[#b89090] mb-8">
            {filter === "all"
              ? "When you place an order, it will appear here."
              : "Try selecting a different filter above."}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="view-btn mx-auto"
          >
            Browse Shop <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredOrders.map((order: any, i: number) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="order-card p-5 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                      {/* Left — icon + info */}
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 flex-shrink-0 rounded-2xl ${cfg.bg} ${cfg.border} border flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${cfg.text}`} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className="font-semibold text-gray-800 text-base"
                              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                            >
                              Order #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#9c7070]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5" />
                              {order.payment_method || "Online"}
                            </span>
                            <span className="font-semibold text-gray-700">
                              ₹{order.total_amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right — action */}
                      <button
                        onClick={() => navigate(`/viewOrder/${order.id}`)}
                        className="view-btn flex-shrink-0"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress bar (not delivered) */}
                    {order.status !== "delivery" && (
                      <div className="mt-4 pt-4 border-t border-[#f5eeea]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 progress-track">
                            <motion.div
                              className="progress-fill"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(["pending","process","printing","packed","shipment","delivery"]
                                  .indexOf(order.status) / 5) * 100}%`
                              }}
                              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-xs text-[#b89090] whitespace-nowrap">
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Toaster />
    </div>
  );
}