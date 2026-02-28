// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { Card } from "../ui/card";
// import { Button } from "../ui/button";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/api";

// export function OrderHistoryPage() {
//   const navigate = useNavigate();
//   const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     if (!userId) return;

//     try {
//       const res = await axios.get(`${API_BASE}/orders_routes/list/${userId}`, { withCredentials: true });
//       setOrders(res.data.orders || []);
//     } catch (err) {
//       console.error("Failed to fetch orders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) return <div className="p-10">Loading orders...</div>;
//   if (orders.length === 0) return <div className="p-10">No orders found.</div>;

//   return (
//     <div className="max-w-[1440px] mx-auto px-8 py-8">
//       <h1 className="text-4xl font-bold mb-8">Order History</h1>
//       <div className="grid grid-cols-1 gap-6">
//         {orders.map((order) => (
//           <Card key={order.id} className="p-6 flex justify-between items-center shadow-sm border-0">
//             <div>
//               <p className="font-medium text-lg">Order ID: {order.id}</p>
//               <p className="text-gray-600">Status: {order.status}</p>
//               <p className="text-gray-600">Total: ₹{order.total_amount}</p>
//               <p className="text-gray-400 text-sm">Placed on: {new Date(order.created_at).toLocaleString()}</p>
//             </div>
//             <Button className="bg-[#D73D32] text-white" onClick={() => navigate(`/viewOrder/${order.id}`)}>
//               View Order
//             </Button>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { Card } from "../ui/card";
// import { Button } from "../ui/button";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/api";

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "pending":
//       return "bg-yellow-100 text-yellow-700";
//     case "process":
//     case "printing":
//       return "bg-blue-100 text-blue-700";
//     case "packed":
//       return "bg-purple-100 text-purple-700";
//     case "shipment":
//       return "bg-orange-100 text-orange-700";
//     case "delivery":
//       return "bg-green-100 text-green-700";
//     default:
//       return "bg-gray-100 text-gray-600";
//   }
// };

// export function OrderHistoryPage() {
//   const navigate = useNavigate();
//   const userId =
//     sessionStorage.getItem("user_id") ||
//     localStorage.getItem("user_id");

//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!userId) return;

//       try {
//         const res = await axios.get(
//           `${API_BASE}/orders_routes/list/${userId}`,
//           { withCredentials: true }
//         );
//         setOrders(res.data.orders || []);
//       } catch (err) {
//         console.error("Failed to fetch orders", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading)
//     return <div className="p-10 text-center">Loading orders...</div>;

//   if (orders.length === 0)
//     return <div className="p-10 text-center">No orders found.</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold mb-10">My Orders</h1>

//         <div className="space-y-6">
//           {orders.map((order) => (
//             <Card
//               key={order.id}
//               className="p-6 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center"
//             >
//               <div>
//                 <p className="text-xl font-semibold">
//                   Order #{order.id.slice(0, 8)}
//                 </p>

//                 <span
//                   className={`inline-block mt-3 px-4 py-1 text-xs rounded-full font-medium ${getStatusColor(
//                     order.status
//                   )}`}
//                 >
//                   {order.status.toUpperCase()}
//                 </span>

//                 <p className="mt-3 text-gray-600">
//                   ₹{order.total_amount}
//                 </p>

//                 <p className="text-sm text-gray-400">
//                   {new Date(order.created_at).toLocaleDateString()}
//                 </p>
//               </div>

//               <Button
//                 className="mt-4 md:mt-0 bg-[#D73D32] hover:bg-[#b92e25] text-white px-6 py-2 rounded-xl"
//                 onClick={() =>
//                   navigate(`/viewOrder/${order.id}`)
//                 }
//               >
//                 View Details
//               </Button>
//             </Card>
//           ))}
//         </div>
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




// Order History Page with Enhanced UI
export function OrderHistoryPage() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE}/orders_routes/list/${userId}`, {
          withCredentials: true
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#D73D32] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-xl text-gray-600">Track and manage your order history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['all', 'pending', 'processing', 'delivered'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(status)}
              className={`p-4 rounded-xl text-left transition-all ${
                filter === status
                  ? 'bg-[#D73D32] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <p className="text-sm font-medium mb-1 capitalize">
                {status === 'all' ? 'All Orders' : status}
              </p>
              <p className="text-2xl font-bold">
                {status === 'all' ? orders.length : statusCounts[status] || 0}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="p-16 text-center bg-white/80 backdrop-blur-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filter} orders found`}
            </p>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-[#D73D32] hover:bg-[#b92e25] text-white px-8 py-3 rounded-xl"
            >
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <StatusIcon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                Order #{order.id.slice(0, 8)}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                              <span className="font-medium text-gray-900">
                                ₹{order.total_amount}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => navigate(`/viewOrder/${order.id}`)}
                          className="bg-[#D73D32] hover:bg-[#b92e25] text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Progress Preview */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">In Progress</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}