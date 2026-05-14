import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
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
  ImageIcon,
  RotateCw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { getUserId } from "../../utils/authStorage";

const API_BASE = "https://api.citizenprintz.in/api";

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
  pending: {
    icon: ShoppingBag,
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
    progress: 10,
  },
  process: {
    icon: Clock,
    label: "Processing",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
    border: "border-sky-200",
    progress: 25,
  },
  printing: {
    icon: Printer,
    label: "Printing",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
    border: "border-violet-200",
    progress: 45,
  },
  packed: {
    icon: Package,
    label: "Packed",
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    border: "border-teal-200",
    progress: 65,
  },
  shipment: {
    icon: Truck,
    label: "Shipped",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
    border: "border-orange-200",
    progress: 82,
  },
  delivery: {
    icon: CheckCircle,
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
    progress: 100,
  },
  cancelled: {
    icon: X,
    label: "Cancelled",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    border: "border-gray-200",
    progress: 0,
  },
};

const CANCEL_BLOCKED = [
  "printing",
  "packed",
  "shipment",
  "delivery",
  "cancelled",
];

const FILTER_TABS = [
  { id: "all", label: "All Orders", icon: Layers },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "process", label: "Processing", icon: Clock },
  { id: "printing", label: "Printing", icon: Printer },
  { id: "packed", label: "Packed", icon: Package },
  { id: "shipment", label: "Shipped", icon: Truck },
  { id: "delivery", label: "Delivered", icon: CheckCircle },
];

interface ReviewFormProps {
  order: any;
  userId: string;
  customerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewFormModal({
  order,
  userId,
  customerName,
  onClose,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const productId = order?.products?.[0]?.product_id || "";

  const productName =
    order?.product_name ||
    order?.items?.[0]?.product_name ||
    `Order #${order?.id?.slice(-8).toUpperCase()}`;

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Review submitted!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = [
    "",
    "Poor",
    "Fair",
    "Good",
    "Very Good",
    "Excellent",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{
          duration: 0.25,
        }}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Rate & Review
            </h3>

            <p className="text-xs text-gray-400 mt-1 truncate">
              {productName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Rating
            </p>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 fill-gray-100"
                    }`}
                  />
                </button>
              ))}

              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-600">
                  {ratingLabels[rating]}
                </span>
              )}
            </div>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 resize-none focus:outline-none"
          />

          <div>
            {preview ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />

                <span className="text-xs text-gray-400">
                  Upload image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function OrderHistoryPage() {
  const navigate = useNavigate();

  const userId = getUserId();

  const customerName =
    sessionStorage.getItem("customer_name") ||
    localStorage.getItem("customer_name") ||
    "Customer";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/orders_routes/list/${userId}`
      );

      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handleFilterChange = (filterId: string) => {
    if (filterId === filter) return;
    setFilter(filterId);
  };

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;

    return orders.filter(
      (order) =>
        order.status?.toLowerCase() === filter.toLowerCase()
    );
  }, [orders, filter]);

  const counts = useMemo(() => {
    return orders.reduce((acc: any, order: any) => {
      const status = order.status;

      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});
  }, [orders]);

  const cancelOrder = async (orderId: string) => {
    setCancelLoading(orderId);

    try {
      await axios.put(
        `${API_BASE}/orders_routes/${orderId}/cancel`
      );

      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled",
              }
            : o
        )
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Failed to cancel order"
      );
    } finally {
      setCancelLoading(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    toast.success("Orders refreshed!");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-orange-50/10 px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl text-gray-900">
              My Orders
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Track and manage your orders
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-2 rounded-full"
          >
            <RotateCw
              className={`w-3 h-3 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {FILTER_TABS.map(({ id, label, icon: Icon }) => {
          const count =
            id === "all"
              ? orders.length
              : counts[id] || 0;

          const isActive = filter === id;

          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilterChange(id)}
              className={`p-4 text-left rounded-2xl border transition-all ${
                isActive
                  ? "bg-red-500 border-red-500 text-white shadow-lg"
                  : "bg-white border-gray-100 hover:border-red-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 mb-3 ${
                  isActive
                    ? "text-white"
                    : "text-red-400"
                }`}
              />

              <p className="text-2xl font-bold">
                {count}
              </p>

              <p className="text-[10px] uppercase tracking-wider mt-1">
                {label}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ORDERS */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-white">
          <Package className="w-10 h-10 text-gray-300 mb-4" />

          <h3 className="text-xl font-bold text-gray-700">
            No orders found
          </h3>

          <p className="text-sm text-gray-400 mt-2 mb-6">
            Try changing the filter
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold"
          >
            Browse Shop
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredOrders.map((order: any) => {
              const cfg =
                STATUS_CONFIG[order.status] ||
                STATUS_CONFIG.pending;

              const Icon = cfg.icon;

              const isDelivered =
                order.status === "delivery";

              const showProgressBar =
                !isDelivered &&
                order.status !== "cancelled";

              return (
                <motion.div
                  key={`${order.id}-${order.status}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-11 h-11 rounded-2xl ${cfg.bg} ${cfg.border} border flex items-center justify-center`}
                        >
                          <Icon
                            className={`w-5 h-5 ${cfg.text}`}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-bold text-sm">
                              Order #
                              {order.id
                                .slice(-8)
                                .toUpperCase()}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                              />
                              {cfg.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />

                              {new Date(
                                order.created_at
                              ).toLocaleDateString("en-IN")}
                            </span>

                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />

                              {order.payment_method ||
                                "Online"}
                            </span>

                            <span className="font-bold text-gray-700">
                              ₹
                              {order.total_amount?.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">
                        {!CANCEL_BLOCKED.includes(
                          order.status
                        ) && (
                          <button
                            onClick={() =>
                              cancelOrder(order.id)
                            }
                            disabled={
                              cancelLoading === order.id
                            }
                            className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold"
                          >
                            {cancelLoading === order.id
                              ? "Cancelling..."
                              : "Cancel"}
                          </button>
                        )}

                        {isDelivered && (
                          <button
                            onClick={() =>
                              setReviewOrder(order)
                            }
                            className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold"
                          >
                            Rate
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(
                              `/viewOrder/${order.id}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          View
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    {showProgressBar && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-red-400 to-red-500"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${cfg.progress}%`,
                              }}
                              transition={{
                                duration: 0.6,
                              }}
                            />
                          </div>

                          <span className="text-[11px] text-gray-400 font-medium">
                            {cfg.progress}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CANCELLED */}
                    {order.status === "cancelled" && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                        <X className="w-3.5 h-3.5 text-gray-500" />

                        <span className="text-[11px] font-semibold text-gray-500">
                          Order cancelled
                        </span>
                      </div>
                    )}

                    {/* DELIVERED */}
                    {isDelivered && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />

                        <span className="text-[11px] font-semibold text-emerald-600">
                          Delivered successfully
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* REVIEW MODAL */}
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