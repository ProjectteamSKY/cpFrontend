import { useEffect, useState } from "react";
import { Package, Truck, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "10px 16px",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
      }}>
        <p style={{ color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#D73D32", fontWeight: 700, fontSize: 16 }}>
          {payload[0].name === "revenue" || payload[0].name === "orders"
            ? `₹${payload[0].value?.toLocaleString()}`
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "#FEF9EC", text: "#B45309", dot: "#F59E0B" },
  processing: { bg: "#EEF2FF", text: "#4338CA", dot: "#818CF8" },
  shipped: { bg: "#F0FDF4", text: "#166534", dot: "#4ADE80" },
  delivered: { bg: "#F0FDF4", text: "#166534", dot: "#4ADE80" },
  cancelled: { bg: "#FEF2F2", text: "#B91C1C", dot: "#F87171" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const key = status?.toLowerCase() ?? "pending";
  const cfg = statusConfig[key] ?? statusConfig.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 999,
      background: cfg.bg, color: cfg.text,
      fontSize: 11, fontWeight: 600,
      letterSpacing: "0.05em", textTransform: "uppercase"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, accent, change }: any) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #F1F3F5",
      borderRadius: 20,
      padding: "26px 24px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.10)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
    }}
  >
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 3, background: accent, borderRadius: "20px 20px 0 0"
    }} />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}14`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={20} color={accent} />
      </div>
      {change !== undefined && (
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 12, fontWeight: 600,
          color: change >= 0 ? "#16A34A" : "#DC2626",
          background: change >= 0 ? "#F0FDF4" : "#FEF2F2",
          padding: "3px 8px", borderRadius: 999
        }}>
          {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </span>
      )}
    </div>

    <p style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 5 }}>
      {value?.toLocaleString() ?? 0}
    </p>
    <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{title}</p>
  </div>
);

// ── Section Card wrapper ──────────────────────────────────────────────────────
const SectionCard = ({ children, style = {} }: any) => (
  <div style={{
    background: "#fff",
    border: "1px solid #F1F3F5",
    borderRadius: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    overflow: "hidden",
    ...style
  }}>
    {children}
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    summary: true,
    revenue: true,
    products: true,
    orders: true
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch summary
    fetch("https://api.citizenprintz.in/api/orders_routes/summary")
      .then(r => r.json())
      .then(data => {
        setSummary(data);
        setLoading(prev => ({ ...prev, summary: false }));
      })
      .catch(err => {
        console.error("Error fetching summary:", err);
        setLoading(prev => ({ ...prev, summary: false }));
        setError("Failed to load summary data");
      });

    // Fetch revenue data
    fetch("https://api.citizenprintz.in/api/orders_routes/revenue/monthly")
      .then(r => r.json())
      .then(data => {
        // Ensure data is an array and has the correct structure
        const formattedData = Array.isArray(data) ? data.map(item => ({
          month: item.month || item.name || "",
          revenue: item.revenue || item.amount || item.total || 0
        })) : [];
        setRevenueData(formattedData);
        setLoading(prev => ({ ...prev, revenue: false }));
      })
      .catch(err => {
        console.error("Error fetching revenue:", err);
        setLoading(prev => ({ ...prev, revenue: false }));
        setError("Failed to load revenue data");
      });

    // Fetch top products
    fetch("https://api.citizenprintz.in/api/orders_routes/top-products")
      .then(r => r.json())
      .then(data => {
        // Transform data to match expected format
        let products = [];
        
        if (Array.isArray(data)) {
          products = data.map(item => ({
            name: item.name || item.product_name || item.title || "Unknown",
            orders: item.orders || item.count || item.total_orders || item.sales || 0
          }));
        } else if (data && typeof data === 'object') {
          // Handle case where API returns an object
          products = Object.entries(data).map(([key, value]: [string, any]) => ({
            name: key,
            orders: value.orders || value.count || value || 0
          }));
        }
        
        // Sort by orders descending and take top 5
        products = products.sort((a, b) => b.orders - a.orders).slice(0, 5);
        
        setTopProducts(products);
        setLoading(prev => ({ ...prev, products: false }));
      })
      .catch(err => {
        console.error("Error fetching top products:", err);
        setLoading(prev => ({ ...prev, products: false }));
        setError("Failed to load top products data");
      });

    // Fetch recent orders
    fetch("https://api.citizenprintz.in/api/orders_routes/recent-orders")
      .then(r => r.json())
      .then(data => {
        const orders = Array.isArray(data) ? data.map(order => ({
          id: order.id,
          order_number: order.order_number || order.order_id || `#${order.id}`,
          customer: order.customer || order.customer_name || "Unknown",
          amount: order.amount || order.total_amount || 0,
          status: order.status || "pending"
        })) : [];
        setRecentOrders(orders);
        setLoading(prev => ({ ...prev, orders: false }));
      })
      .catch(err => {
        console.error("Error fetching recent orders:", err);
        setLoading(prev => ({ ...prev, orders: false }));
        setError("Failed to load recent orders");
      });
  }, []);

  const stats = [
    { title: "Total Orders", value: summary?.total_orders, icon: ShoppingBag, accent: "#F59E0B", change: 12 },
    { title: "Pending", value: summary?.pending_orders, icon: Clock, accent: "#F59E0B", change: -3 },
    { title: "Processing", value: summary?.process_orders, icon: Package, accent: "#F59E0B", change: 8 },
    { title: "Shipped", value: summary?.shipment_orders, icon: Truck, accent: "#F59E0B", change: 21 },
  ];

  // Check if top products data is empty
  const hasTopProducts = topProducts.length > 0;

  return (
    <div style={{minHeight: "100vh" }}>

      {error && (
        <div style={{
          background: "white",
          border: "1px solid #FEE2E2",
          borderRadius: 12,
          padding: "12px 20px",
          marginBottom: 24,
          color: "#991B1B",
          fontSize: 14
        }}>
           {error}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#111827" }}>
            Dashboard Overview
          </h1>
          <p style={{ color: "#24457e", fontSize: 14, marginTop: 6, fontWeight: 500 }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Charts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 24 }}>

        {/* Revenue */}
        <SectionCard>
          <div style={{ padding: "24px 28px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Analytics</p>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Monthly Revenue</h2>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600, color: "#16A34A",
                background: "#F0FDF4", padding: "5px 10px", borderRadius: 999
              }}>
                <TrendingUp size={13} />
              </div>
            </div>
          </div>
          <div style={{ padding: "0 12px 24px" }}>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D73D32" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#D73D32" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#D73D32" strokeWidth={2.5}
                    fill="url(#revGrad)" dot={false}
                    activeDot={{ r: 5, fill: "#D73D32", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                {loading.revenue ? "Loading revenue data..." : "No revenue data available"}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Top Products */}
        <SectionCard>
          <div style={{ padding: "24px 28px 0" }}>
            <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Products</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 20 }}>Top Sellers</h2>
          </div>
          <div style={{ padding: "0 12px 24px" }}>
            {hasTopProducts ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                  data={topProducts} 
                  layout="vertical"
                  margin={{ left: 20, right: 30, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fill: "#9CA3AF", fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fill: "#9CA3AF", fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="orders" 
                    fill="#D73D32" 
                    radius={[0, 6, 6, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#9CA3AF" }}>
                {loading.products ? (
                  "Loading top products..."
                ) : (
                  <>
                    <ShoppingBag size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                    "No product data available"
                  </>
                )}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── Recent Orders ── */}
      <SectionCard>
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Orders</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Recent Activity</h2>
          </div>
          <button
            style={{
              background: "#FEF2F0", border: "1px solid #FECDCA",
              color: "#D73D32", borderRadius: 10, padding: "8px 16px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s"
            }}
            onClick={() => navigate("/admin/order")}
            onMouseEnter={e => (e.currentTarget.style.background = "#FCE3E0")}
            onMouseLeave={e => (e.currentTarget.style.background = "#FEF2F0")}
          >
            View All →
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAFA" }}>
              {["Order ID", "Customer", "Amount", "Status"].map(h => (
                <th key={h} style={{
                  padding: "12px 28px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "#9CA3AF",
                  letterSpacing: "0.07em", textTransform: "uppercase"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} style={{ borderTop: "1px solid #F9FAFB" }}>
                <td style={{ padding: "15px 28px" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12, color: "#D73D32", fontWeight: 500,
                    background: "#FEF2F0", padding: "3px 10px", borderRadius: 6
                  }}>
                    {order.order_number}
                  </span>
                </td>
                <td style={{ padding: "15px 28px", fontSize: 14, fontWeight: 500, color: "#374151" }}>
                  {order.customer}
                </td>
                <td style={{ padding: "15px 28px", fontSize: 14, fontWeight: 700, color: "#111827" }}>
                  ₹{order.amount?.toLocaleString()}
                </td>
                <td style={{ padding: "15px 28px" }}>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recentOrders.length === 0 && !loading.orders && (
          <div style={{ padding: "48px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
            No recent orders found.
          </div>
        )}

        {loading.orders && (
          <div style={{ padding: "48px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
            Loading orders...
          </div>
        )}
      </SectionCard>
    </div>
  );
}