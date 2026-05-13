import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ReceiptText,
  User,
  Phone,
  Home,
  BadgeCheck,
} from "lucide-react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000";

const ORDER_STEPS = [
  {
    key: "pending",
    label: "Placed",
    icon: ShoppingBag,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
  {
    key: "process",
    label: "Processing",
    icon: Clock,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
  {
    key: "printing",
    label: "Printing",
    icon: Printer,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
  {
    key: "packed",
    label: "Packed",
    icon: Package,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
  {
    key: "shipment",
    label: "Shipped",
    icon: Truck,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
  {
    key: "delivery",
    label: "Delivered",
    icon: CheckCircle,
    doneBg: "bg-[#EC7063]",
    ring: "ring-[#EC7063]",
    activeText: "text-[#EC7063]",
    activeBorder: "border-[#EC7063]",
  },
];

const STATUS_MAP: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
    ring: string;
    label: string;
  }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    ring: "ring-amber-200",
    label: "Pending",
  },
  process: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    ring: "ring-blue-200",
    label: "Processing",
  },
  printing: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
    ring: "ring-violet-200",
    label: "Printing",
  },
  packed: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    ring: "ring-teal-200",
    label: "Packed",
  },
  shipment: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
    ring: "ring-orange-200",
    label: "Shipped",
  },
  delivery: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    label: "Delivered",
  },
};

interface Address {
  last_name: string;
  first_name: string;
  id?: string;
  full_name?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  address_line1?: string;
  address_line2?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postal_code?: string;
  landmark?: string;
  address_type?: string;
  type?: string;
  is_default?: boolean;
}

export function ViewOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "tracking">(
    "details"
  );

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

        const formattedItems = (iRes.data.items || []).map((item: any) => {
          let images: any[] = [];

          try {
            images = JSON.parse(item.product_images || "[]");
          } catch (e) {
            console.error("Image parse error", e);
          }

          let attributes: any[] = [];

          try {
            attributes = JSON.parse(item.selected_attributes || "[]");
          } catch (e) {
            console.error("Attribute parse error", e);
          }

          return {
            ...item,
            images,
            attributes,
            image:
              images?.[0]?.mobile?.url ||
              images?.[0]?.thumbnail?.url ||
              images?.[0]?.original?.url ||
              "",
          };
        });

        setItems(formattedItems);

        const addressId =
          orderData.address_id || orderData.shipping_address_id;

        if (addressId) {
          try {
            const aRes = await axios.get(
              `${API_BASE}/user_address/${addressId}`
            );
            setAddress(aRes.data);
          } catch {}
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50/30 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-red-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const currentIdx = ORDER_STEPS.findIndex(
    (s) => s.key === order.status
  );

  const progressPercent = Math.max(
    0,
    Math.round(
      (currentIdx / (ORDER_STEPS.length - 1)) * 100
    )
  );

  const statusCfg =
    STATUS_MAP[order.status] || STATUS_MAP.pending;

  const estimatedDate = new Date(
    new Date(order.created_at).getTime() + 7 * 86400000
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}

      <header className="sticky top-0 z-30 bg-white border-b border-orange-100">
        <div className="px-4 py-4 flex items-center gap-3">

          <button
            onClick={() => navigate("/MyProfile")}
            className="w-10 h-10 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-red-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="font-bold text-gray-800">
              Order Details
            </h1>

            <p className="text-xs text-gray-400">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-5">

        {/* HERO CARD */}

        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">

          <div className="h-1  bg-[#D73D32]" />

          <div className="p-5">

            <div className="flex justify-between gap-4 flex-wrap">

              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200">
                  <Package className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">

                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 ${statusCfg.bg} ${statusCfg.text}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex gap-4 mt-2 flex-wrap">

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {items.length} Items
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">
                  Total
                </p>

                <p className="text-3xl font-extrabold text-red-600">
                  ₹{order.total_amount?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="inline-flex bg-white border border-orange-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              activeTab === "details"
                ? "bg-red-50 text-red-600"
                : "text-gray-500"
            }`}
          >
            Details
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              activeTab === "tracking"
                ? "bg-red-50 text-red-600"
                : "text-gray-500"
            }`}
          >
            Tracking
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* DETAILS */}

          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >

              {/* ITEMS */}

              <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">

                <div className="flex items-center justify-between mb-5">

                  <h3 className="font-bold text-gray-800">
                    Ordered Items
                  </h3>

                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {items.length} Items
                  </span>
                </div>

                <div className="space-y-4">

                  {items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-orange-50/50 border border-orange-100 rounded-2xl p-4 hover:shadow-md transition-all"
                    >

                      <div className="flex gap-4">

                        {/* IMAGE */}

                        <button
                          onClick={() =>
                            navigate(`/product/${item.product_id}`)
                          }
                          className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-orange-100 flex-shrink-0"
                        >
                          {item.image ? (
                            <img
                              src={`${MEDIA_BASE}${item.image}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-red-300" />
                            </div>
                          )}
                        </button>

                        {/* CONTENT */}

                        <div className="flex-1 min-w-0">

                          <button
                            onClick={() =>
                              navigate(`/product/${item.product_id}`)
                            }
                            className="text-left"
                          >
                            <h4 className="text-base font-bold text-gray-800 hover:text-red-600 transition-colors">
                              {item.product_name}
                            </h4>
                          </button>

                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {item.product_description}
                          </p>

                          {/* ATTRIBUTES */}

                          {item.attributes?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">

                              {item.attributes.map(
                                (attr: any, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg bg-white border border-orange-100 text-xs font-medium text-gray-600"
                                  >
                                    {attr.attribute_name}:{" "}
                                    {attr.attribute_value_name}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          {/* FOOTER */}

                          <div className="flex items-end justify-between mt-4">

                            <div>
                              <p className="text-xs text-gray-400">
                                Qty: {item.quantity}
                              </p>

                              {/* <p className="text-xs text-gray-400">
                                ₹{item.unit_price} × {item.quantity}
                              </p> */}
                            </div>

                            {/* <div className="text-right">

                              <p className="text-2xl font-bold text-red-600">
                                ₹
                                {Number(
                                  item.total_price
                                ).toLocaleString("en-IN")}
                              </p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* PRICE BREAKDOWN */}

              <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">

                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <h3 className="font-bold text-gray-800">
                    Price Breakdown
                  </h3>
                </div>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      ₹{order.total_amount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-orange-100 pt-4 flex justify-between">

                    <span className="font-bold text-gray-800">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-red-600">
                      ₹{order.total_amount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TRACKING */}

          {activeTab === "tracking" && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >

              <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">

                <div className="flex justify-between mb-8">

                  <h3 className="font-bold text-gray-800">
                    Shipment Timeline
                  </h3>

                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {progressPercent}% Complete
                  </span>
                </div>

                <div className="overflow-x-auto">

                  <div className="relative flex justify-between min-w-[450px]">

                    <div className="absolute top-5 left-8 right-8 h-1 bg-green-100 rounded-full" />

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          currentIdx <= 0
                            ? "0%"
                            : `calc(${progressPercent}% - 36px)`,
                      }}
                      transition={{ duration: 1 }}
                      className="absolute top-5 left-8 h-1 bg-green-500 rounded-full"
                    />

                    {ORDER_STEPS.map((step, idx) => {
                      const Icon = step.icon;

                      const done = idx < currentIdx;

                      const current = idx === currentIdx;

                      return (
                        <div
                          key={step.key}
                          className="relative z-10 flex flex-col items-center flex-1"
                        >

                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              done
                                ? `${step.doneBg} border-transparent`
                                : current
                                ? `${step.activeBorder} bg-white`
                                : "bg-orange-50 border-orange-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                done
                                  ? "text-white"
                                  : current
                                  ? step.activeText
                                  : "text-orange-200"
                              }`}
                            />
                          </div>

                          <p
                            className={`text-[10px] mt-2 font-bold uppercase ${
                              current
                                ? "text-red-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">

                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-orange-100">
                    <Truck className="w-4 h-4 text-red-500" />
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">
                      Estimated Delivery
                    </p>

                    <p className="font-semibold text-gray-800">
                      {estimatedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}

              <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">

                <div className="flex items-center gap-2 mb-5">

                  <MapPin className="w-4 h-4 text-red-500" />

                  <h3 className="font-bold text-gray-800">
                    Shipping Address
                  </h3>
                </div>

                {address ? (
                  <div className="space-y-4">

                    <div className="flex gap-3">

                      <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-red-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Full Name
                        </p>

                        <p className="font-semibold text-gray-800">
                          {address.first_name + " " + address.last_name || address.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">

                      <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-red-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="font-semibold text-gray-800">
                          {address.phone || address.mobile}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">

                      <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <Home className="w-4 h-4 text-red-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Address
                        </p>

                        <p className="font-semibold text-gray-800 leading-relaxed">
                          {[
                            address.address_line1 ||
                              address.address,
                            address.address_line2,
                            address.city,
                            address.state,
                            address.pincode ||
                              address.postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Address not available
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}