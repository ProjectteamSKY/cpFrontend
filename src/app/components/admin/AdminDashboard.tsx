import { Package, DollarSign, Truck, FileCheck, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const stats = [
    { 
      title: "Total Orders", 
      value: "1,234", 
      change: "+12.5%", 
      trend: "up",
      icon: Package,
      color: "bg-blue-500"
    },
    { 
      title: "Total Revenue", 
      value: "₹8,45,320", 
      change: "+18.2%", 
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500"
    },
    { 
      title: "Pending Shipments", 
      value: "47", 
      change: "-5.3%", 
      trend: "down",
      icon: Truck,
      color: "bg-orange-500"
    },
    { 
      title: "File Review Pending", 
      value: "23", 
      change: "+2.1%", 
      trend: "up",
      icon: FileCheck,
      color: "bg-purple-500"
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 72000 },
    { month: "Aug", revenue: 68000 },
    { month: "Sep", revenue: 75000 },
    { month: "Oct", revenue: 82000 },
    { month: "Nov", revenue: 78000 },
    { month: "Dec", revenue: 84532 },
  ];

  const topProducts = [
    { name: "Business Cards", orders: 456, revenue: 182400 },
    { name: "Brochures", orders: 234, revenue: 116766 },
    { name: "Banners", orders: 189, revenue: 150911 },
    { name: "Flyers", orders: 167, revenue: 33233 },
    { name: "Posters", orders: 143, revenue: 49907 },
  ];

  const recentOrders = [
    { id: "ORD-2024-156", customer: "Rahul Sharma", amount: 4500, status: "Processing" },
    { id: "ORD-2024-155", customer: "Priya Patel", amount: 7800, status: "Shipped" },
    { id: "ORD-2024-154", customer: "Amit Kumar", amount: 2340, status: "Delivered" },
    { id: "ORD-2024-153", customer: "Sneha Gupta", amount: 5600, status: "Processing" },
    { id: "ORD-2024-152", customer: "Vijay Singh", amount: 9200, status: "Quality Check" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white p-6 shadow-sm border-0">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white p-6 shadow-sm border-0">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#D73D32" 
                strokeWidth={3}
                dot={{ fill: '#D73D32', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card className="bg-white p-6 shadow-sm border-0">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="orders" fill="#1A1A1A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFEFEF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#D73D32]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{order.customer}</td>
                  <td className="px-6 py-4 font-semibold text-[#1A1A1A]">₹{order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" 
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
