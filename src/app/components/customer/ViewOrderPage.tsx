// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import { Card } from "../ui/card";
// import { Button } from "../ui/button";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/api";
// const MEDIA_BASE = "http://127.0.0.1:8000/";

// export function ViewOrderPage() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState<any>(null);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrder = async () => {
//     if (!orderId) return;

//     try {
//       // 1️⃣ Fetch order details
//       const orderRes = await axios.get(`${API_BASE}/orders_routes/${orderId}`, { withCredentials: true });
//       setOrder(orderRes.data);

//       // 2️⃣ Fetch order items
//       const itemsRes = await axios.get(`${API_BASE}/order_items_routes/list/${orderId}`, { withCredentials: true });
//       const enrichedItems = await Promise.all(
//         itemsRes.data.items.map(async (item: any) => {
//           const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
//           const variantRes = await axios.get(`${API_BASE}/product_variant/${item.variant_id}`);
//           const product = productRes.data;
//           const variant = variantRes.data;
//           const images = JSON.parse(product.images || "[]");
//           const defaultImage = images.find((img: any) => img.is_default);

//           return {
//             ...item,
//             product_name: product.name,
//             product_image: defaultImage ? MEDIA_BASE + defaultImage.url : null,
//             size_name: variant.size_name,
//             paper_type_name: variant.paper_type_name,
//             print_type_name: variant.print_type_name,
//             cut_type_name: variant.cut_type_name,
//             orientation: variant.orientation,
//           };
//         })
//       );
//       setOrderItems(enrichedItems);
//     } catch (err) {
//       console.error("Failed to fetch order", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [orderId]);

//   if (loading) return <div className="p-10">Loading order...</div>;
//   if (!order) return <div className="p-10">Order not found.</div>;

//   return (
//     <div className="max-w-[1440px] mx-auto px-8 py-8">
//       <h1 className="text-4xl font-bold mb-6">Order Details</h1>

//       <Card className="p-6 mb-6">
//         <p className="font-medium text-lg">Order ID: {order.id}</p>
//         <p>Status: {order.status}</p>
//         <p>Total Amount: ₹{order.total_amount}</p>
//         <p>Placed on: {new Date(order.created_at).toLocaleString()}</p>
//       </Card>

//       <h2 className="text-2xl font-semibold mb-4">Items</h2>
//       {orderItems.map((item) => (
//         <Card key={item.id} className="p-4 mb-4 flex items-center gap-4">
//           <img src={item.product_image || ""} className="w-16 h-16 object-cover rounded" alt={item.product_name} />
//           <div className="flex-1">
//             <p className="font-medium">{item.product_name}</p>
//             <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
//             <p className="text-gray-600 text-sm">Price: ₹{item.price}</p>
//           </div>
//           <p className="font-semibold text-lg">₹{item.total}</p>
//         </Card>
//       ))}

//       <Button className="mt-6 bg-[#D73D32] text-white" onClick={() => navigate("/orders")}>
//         Back to Orders
//       </Button>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import { Card } from "../ui/card";
// import { Button } from "../ui/button";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/api";
// const MEDIA_BASE = "http://127.0.0.1:8000/";

// const ORDER_STEPS = [
//   { key: "pending", label: "Order Placed", icon: "🧾" },
//   { key: "process", label: "Processing", icon: "⚙️" },
//   { key: "printing", label: "Printing", icon: "🖨️" },
//   { key: "packed", label: "Packed", icon: "📦" },
//   { key: "shipment", label: "Shipped", icon: "🚚" },
//   { key: "delivery", label: "Delivered", icon: "✅" },
// ];

// export function ViewOrderPage() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState<any>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       if (!orderId) return;

//       try {
//         const orderRes = await axios.get(
//           `${API_BASE}/orders_routes/${orderId}`
//         );
//         setOrder(orderRes.data);

//         const itemsRes = await axios.get(
//           `${API_BASE}/order_items_routes/list/${orderId}`
//         );
//         setItems(itemsRes.data.items || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   if (loading)
//     return <div className="p-10 text-center">Loading order...</div>;
//   if (!order)
//     return <div className="p-10 text-center">Order not found</div>;

//   const currentIndex = ORDER_STEPS.findIndex(
//     (step) => step.key === order.status
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <h1 className="text-4xl font-bold mb-10">Order Details</h1>

//         {/* Summary Card */}
//         <Card className="p-8 mb-12 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-2xl font-semibold">
//                 Order #{order.id.slice(0, 8)}
//               </p>
//               <p className="text-gray-500 mt-2">
//                 {new Date(order.created_at).toLocaleString()}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="text-3xl font-bold text-[#D73D32]">
//                 ₹{order.total_amount}
//               </p>
//               <p className="text-sm text-gray-500 uppercase mt-1">
//                 {order.status}
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* Premium Timeline */}
//         <div className="relative mb-16">

//           <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>

//           <div
//             className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-700"
//             style={{
//               width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%`,
//             }}
//           ></div>

//           <div className="relative flex justify-between">
//             {ORDER_STEPS.map((step, index) => {
//               const isActive = index <= currentIndex;
//               const isCurrent = index === currentIndex;

//               return (
//                 <div key={step.key} className="flex flex-col items-center w-24 text-center">
//                   <div
//                     className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-300
//                     ${
//                       isActive
//                         ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110"
//                         : "bg-white border-2 border-gray-300 text-gray-400"
//                     }
//                     ${isCurrent ? "animate-pulse" : ""}
//                   `}
//                   >
//                     {step.icon}
//                   </div>

//                   <p
//                     className={`mt-4 text-sm font-medium ${
//                       isActive ? "text-gray-800" : "text-gray-400"
//                     }`}
//                   >
//                     {step.label}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Items */}
//         <h2 className="text-2xl font-semibold mb-6">Items</h2>

//         <div className="space-y-5">
//           {items.map((item) => (
//             <Card
//               key={item.id}
//               className="p-6 flex justify-between items-center rounded-xl shadow-md bg-white hover:shadow-lg transition-all"
//             >
//               <div>
//                 <p className="font-semibold text-lg">
//                   Product #{item.product_id}
//                 </p>
//                 <p className="text-gray-500 text-sm mt-1">
//                   Quantity: {item.quantity}
//                 </p>
//               </div>

//               <p className="text-lg font-bold">
//                 ₹{item.total}
//               </p>
//             </Card>
//           ))}
//         </div>

//         <Button
//           className="mt-10 bg-[#D73D32] hover:bg-[#b92e25] text-white px-8 py-3 rounded-xl"
//           onClick={() => navigate("/orders")}
//         >
//           Back to Orders
//         </Button>

//       </div>
//     </div>
//   );
// }


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
  AlertCircle
} from "lucide-react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: ShoppingBag, color: "from-yellow-400 to-yellow-500" },
  { key: "process", label: "Processing", icon: Clock, color: "from-blue-400 to-blue-500" },
  { key: "printing", label: "Printing", icon: Printer, color: "from-purple-400 to-purple-500" },
  { key: "packed", label: "Packed", icon: Package, color: "from-indigo-400 to-indigo-500" },
  { key: "shipment", label: "Shipped", icon: Truck, color: "from-orange-400 to-orange-500" },
  { key: "delivery", label: "Delivered", icon: CheckCircle, color: "from-green-400 to-green-500" },
];

export function ViewOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const [orderRes, itemsRes] = await Promise.all([
          axios.get(`${API_BASE}/orders_routes/${orderId}`),
          axios.get(`${API_BASE}/order_items_routes/list/${orderId}`)
        ]);
        setOrder(orderRes.data);
        setItems(itemsRes.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#D73D32] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/orders")} className="bg-[#D73D32] hover:bg-[#b92e25]">
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.findIndex((step) => step.key === order.status);
  const progressPercentage = (currentIndex / (ORDER_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Background Pattern */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/orders")}
                className="hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Track and manage your order</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Invoice
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 mb-8 bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D73D32] to-[#b92e25] rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {order.payment_method || 'Online Payment'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-[#D73D32]">₹{order.total_amount}</p>
                <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "details"
                ? "text-[#D73D32]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Order Details
            {activeTab === "details" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D73D32]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "tracking"
                ? "text-[#D73D32]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tracking Info
            {activeTab === "tracking" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D73D32]"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "details" ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Items List */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#D73D32]" />
                Ordered Items
              </h2>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Product #{item.product_id}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#D73D32]">
                                ₹{item.total}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ₹{item.price} per item
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Timeline */}
              <Card className="p-8 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-8">Order Timeline</h3>
                
                {/* Progress Bar */}
                <div className="relative mb-12">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                  <motion.div
                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>

                  <div className="relative flex justify-between">
                    {ORDER_STEPS.map((step, index) => {
                      const isActive = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                              ${isActive 
                                ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                              }
                              ${isCurrent ? 'ring-4 ring-green-200' : ''}
                            `}
                            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <p className={`mt-3 text-sm font-medium ${
                            isActive ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-4">
                    <Truck className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.status === 'delivered' 
                          ? 'Delivered on ' + new Date(order.updated_at).toLocaleDateString()
                          : new Date(order.updated_at).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-gray-600">
                      {order.shipping_address || '123 Business Street, Tech Park, Bangalore - 560001'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="px-6 py-3"
          >
            Back to Orders
          </Button>
          
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button
              className="bg-[#D73D32] hover:bg-[#b92e25] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Need Help?
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}