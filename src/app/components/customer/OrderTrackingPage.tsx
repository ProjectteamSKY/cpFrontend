import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
  ArrowRight,
  Layers,
  Star,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

const API_BASE = "http://54.206.3.97/api";

const STATUS_CONFIG: Record<
  string,
  {
    icon: any;
    label: string;
    bg: string;
    text: string;
    dot: string;
    border: string;
    progress: number;
  }
> = {
  pending: { icon: ShoppingBag, label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200", progress: 10 },
  process: { icon: Clock, label: "Processing", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400", border: "border-sky-200", progress: 25 },
  printing: { icon: Printer, label: "Printing", bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400", border: "border-violet-200", progress: 45 },
  packed: { icon: Package, label: "Packed", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400", border: "border-teal-200", progress: 65 },
  shipment: { icon: Truck, label: "Shipped", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400", border: "border-orange-200", progress: 82 },
  delivery: { icon: CheckCircle, label: "Out for Delivery", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", border: "border-emerald-200", progress: 100 },
};

const FILTER_TABS = [
  { id: "all", label: "All Orders", icon: Layers },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "printing", label: "Printing", icon: Printer },
  { id: "shipment", label: "Shipped", icon: Truck },
];

/* ─────────────────────────────────────────────────────────────────────
   ReviewFormModal — standalone functional component
───────────────────────────────────────────────────────────────────── */
interface ReviewFormProps {
  order: any;
  userId: string;
  customerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewFormModal({ order, userId, customerName, onClose, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const productId = order?.products?.[0]?.product_id || "";
  const productName = order?.product_name || order?.items?.[0]?.product_name || `Order #${order?.id?.slice(-8).toUpperCase()}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("product_id", productId);
      form.append("user_id", userId);
      form.append("customer_name", customerName);
      form.append("rating", String(rating));
      form.append("comment", comment);
      form.append("is_active", "true");
      if (image) form.append("image", image);

      await axios.post(`${API_BASE}/review/create`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Review submitted! Thank you.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rate & Review</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px]">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${star <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 fill-gray-200"
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 self-center text-sm text-gray-500">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Photo <span className="text-gray-400 font-normal">(optional)</span></label>
            {preview ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">Click to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   OrderHistoryPage
───────────────────────────────────────────────────────────────────── */
export function OrderHistoryPage() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || "";
  const customerName = sessionStorage.getItem("customer_name") || localStorage.getItem("customer_name") || "Customer";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

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

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = orders.reduce((acc: any, o: any) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  /* ─── Loading ──────────────────────────────────────────────────── */
  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center space-y-4">
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 animate-spin" />
        </div>
        <p className="text-xs text-gray-400 tracking-widest uppercase">Loading orders</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen px-4 py-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h2>
          <span className="text-xs text-gray-400 tracking-widest uppercase mb-1">{orders.length} total</span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
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
              className={`p-4 text-left rounded-2xl border transition-all duration-200 ${isActive
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-white border-gray-100 hover:border-red-300 hover:shadow-md"
                }`}
            >
              <Icon className={`w-4 h-4 mb-3 ${isActive ? "text-white/80" : "text-red-500"}`} />
              <p className={`text-2xl font-bold mb-0.5 ${isActive ? "text-white" : "text-gray-800"}`}>{count}</p>
              <p className={`text-xs uppercase tracking-wider ${isActive ? "text-white/70" : "text-gray-400"}`}>{label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-200 ${filter === key
                ? "bg-red-500 border-red-500 text-white shadow-sm shadow-red-200"
                : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filter === key ? "bg-white/70" : cfg.dot}`} />
            {cfg.label}
          </button>
        ))}
        <button
          onClick={() => setFilter("all")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-200 ${filter === "all"
              ? "bg-red-500 border-red-500 text-white shadow-sm shadow-red-200"
              : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
            }`}
        >
          All
        </button>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50"
        >
          <Package className="w-10 h-10 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-1">
            {filter === "all" ? "No orders yet" : `No ${STATUS_CONFIG[filter]?.label ?? filter} orders`}
          </h3>
          <p className="text-sm text-gray-400 mb-8">
            {filter === "all"
              ? "When you place an order, it will appear here."
              : "Try selecting a different filter above."}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
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
              const isDelivered = order.status === "delivery";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                      {/* Left — icon + info */}
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 flex-shrink-0 rounded-2xl ${cfg.bg} ${cfg.border} border flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${cfg.text}`} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="font-semibold text-gray-800 text-base">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
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

                      {/* Right — actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Rate & Review button — only show for delivered orders */}
                        {isDelivered && (
                          <button
                            onClick={() => setReviewOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            Rate &amp; Review
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => navigate(`/viewOrder/${order.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-red-100 bg-white text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md transition-all duration-200"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {!isDelivered && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${cfg.progress}%` }}
                              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{cfg.label}</span>
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

      {/* Review Modal */}
      <AnimatePresence>
        {reviewOrder && (
          <ReviewFormModal
            order={reviewOrder}
            userId={userId}
            customerName={customerName}
            onClose={() => setReviewOrder(null)}
            onSuccess={() => setReviewOrder(null)}
          />
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}