import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${API_BASE}/orders_routes/list/${userId}`, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-10">Loading orders...</div>;
  if (orders.length === 0) return <div className="p-10">No orders found.</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Order History</h1>
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 flex justify-between items-center shadow-sm border-0">
            <div>
              <p className="font-medium text-lg">Order ID: {order.id}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <p className="text-gray-600">Total: ₹{order.total_amount}</p>
              <p className="text-gray-400 text-sm">Placed on: {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <Button className="bg-[#D73D32] text-white" onClick={() => navigate(`/viewOrder/${order.id}`)}>
              View Order
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}