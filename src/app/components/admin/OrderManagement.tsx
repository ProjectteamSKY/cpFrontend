import { useState } from "react";
import { Search, Download, Eye, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = [
    {
      id: "ORD-2024-156",
      customer: "Rahul Sharma",
      email: "rahul@example.com",
      product: "Business Cards",
      quantity: 100,
      amount: 4500,
      paymentStatus: "Paid",
      shippingStatus: "Processing",
      date: "Feb 13, 2026",
    },
    {
      id: "ORD-2024-155",
      customer: "Priya Patel",
      email: "priya@example.com",
      product: "Brochures",
      quantity: 50,
      amount: 7800,
      paymentStatus: "Paid",
      shippingStatus: "Shipped",
      date: "Feb 12, 2026",
    },
    {
      id: "ORD-2024-154",
      customer: "Amit Kumar",
      email: "amit@example.com",
      product: "Banners",
      quantity: 2,
      amount: 2340,
      paymentStatus: "Paid",
      shippingStatus: "Delivered",
      date: "Feb 11, 2026",
    },
    {
      id: "ORD-2024-153",
      customer: "Sneha Gupta",
      email: "sneha@example.com",
      product: "Flyers",
      quantity: 200,
      amount: 5600,
      paymentStatus: "Pending",
      shippingStatus: "Processing",
      date: "Feb 10, 2026",
    },
    {
      id: "ORD-2024-152",
      customer: "Vijay Singh",
      email: "vijay@example.com",
      product: "Posters",
      quantity: 25,
      amount: 9200,
      paymentStatus: "Paid",
      shippingStatus: "Quality Check",
      date: "Feb 10, 2026",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <Card className="bg-white p-6 shadow-sm border-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="quality-check">Quality Check</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">All Orders</h2>
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-[#1A1A1A]">{orders.length}</span> orders
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFEFEF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Shipping Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#D73D32]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-[#1A1A1A]">{order.customer}</div>
                      <div className="text-sm text-gray-600">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{order.product}</td>
                  <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                  <td className="px-6 py-4 font-semibold text-[#1A1A1A]">₹{order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Select defaultValue={order.shippingStatus.toLowerCase().replace(' ', '-')}>
                      <SelectTrigger className="w-40 bg-white border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="printing">Printing</SelectItem>
                        <SelectItem value="quality-check">Quality Check</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Eye className="w-4 h-4 text-[#D73D32]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-green-50">
                        <Download className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing 1 to {orders.length} of {orders.length} orders
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-200" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 bg-[#D73D32] text-white">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              2
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
