import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

export function ViewOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      // 1️⃣ Fetch order details
      const orderRes = await axios.get(`${API_BASE}/orders_routes/${orderId}`, { withCredentials: true });
      setOrder(orderRes.data);

      // 2️⃣ Fetch order items
      const itemsRes = await axios.get(`${API_BASE}/order_items_routes/list/${orderId}`, { withCredentials: true });
      const enrichedItems = await Promise.all(
        itemsRes.data.items.map(async (item: any) => {
          const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
          const variantRes = await axios.get(`${API_BASE}/product_variant/${item.variant_id}`);
          const product = productRes.data;
          const variant = variantRes.data;
          const images = JSON.parse(product.images || "[]");
          const defaultImage = images.find((img: any) => img.is_default);

          return {
            ...item,
            product_name: product.name,
            product_image: defaultImage ? MEDIA_BASE + defaultImage.url : null,
            size_name: variant.size_name,
            paper_type_name: variant.paper_type_name,
            print_type_name: variant.print_type_name,
            cut_type_name: variant.cut_type_name,
            orientation: variant.orientation,
          };
        })
      );
      setOrderItems(enrichedItems);
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-10">Loading order...</div>;
  if (!order) return <div className="p-10">Order not found.</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-6">Order Details</h1>

      <Card className="p-6 mb-6">
        <p className="font-medium text-lg">Order ID: {order.id}</p>
        <p>Status: {order.status}</p>
        <p>Total Amount: ₹{order.total_amount}</p>
        <p>Placed on: {new Date(order.created_at).toLocaleString()}</p>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Items</h2>
      {orderItems.map((item) => (
        <Card key={item.id} className="p-4 mb-4 flex items-center gap-4">
          <img src={item.product_image || ""} className="w-16 h-16 object-cover rounded" alt={item.product_name} />
          <div className="flex-1">
            <p className="font-medium">{item.product_name}</p>
            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
            <p className="text-gray-600 text-sm">Price: ₹{item.price}</p>
          </div>
          <p className="font-semibold text-lg">₹{item.total}</p>
        </Card>
      ))}

      <Button className="mt-6 bg-[#D73D32] text-white" onClick={() => navigate("/orders")}>
        Back to Orders
      </Button>
    </div>
  );
}