import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNavigate } from "react-router-dom";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../service/orderApiService";
import {
  createShiprocketOrder,
  getAvailableCouriers,
  downloadLabel,
  cancelOrder,
  refundOrder,
  handlePrintLabel,
  downloadManifestLabel,
  generateInvoice,
} from "../../service/shippingApiService";
import { Order, OrderStatus, OrderItem } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";
import { Button } from "../ui/button";
import { 
  Eye, 
  RefreshCw, 
  Package, 
  Truck, 
  DollarSign, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  FileText,
  Download,
  Printer,
  File as FileIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Receipt
} from "lucide-react";

// Status display configuration
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: JSX.Element }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
  process: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: <RefreshCw className="w-3 h-3" /> },
  printing: { label: "Printing", color: "bg-purple-100 text-purple-700", icon: <Printer className="w-3 h-3" /> },
  packed: { label: "Packed", color: "bg-indigo-100 text-indigo-700", icon: <Package className="w-3 h-3" /> },
  shipment: { label: "Shipped", color: "bg-cyan-100 text-cyan-700", icon: <Truck className="w-3 h-3" /> },
  delivery: { label: "Delivered", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-700", icon: <DollarSign className="w-3 h-3" /> },
};

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingShipment, setLoadingShipment] = useState<string | null>(null);
  const [loadingManifest, setLoadingManifest] = useState<string | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Change
  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (order.status === "cancelled" || order.status === "refunded") {
      toast.error("Cannot update cancelled or refunded orders");
      return;
    }

    if (newStatus === "shipment") {
      await handleShipmentFlow(order);
      return;
    }

    try {
      await updateOrderStatus(order.id, order.status, newStatus);
      toast.success(`Order status updated to ${STATUS_CONFIG[newStatus].label}!`);
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to update order status");
    }
  };

  // Auto Shipment Flow
  const handleShipmentFlow = async (order: Order) => {
    try {
      setLoadingShipment(order.id);
      toast.info("Creating shipment...");

      // Step 1: Create Shiprocket Order
      await createShiprocketOrder(order.id);
      toast.info("Shipment created, finding best courier...");

      // Step 2: Auto assign best courier
      const res = await getAvailableCouriers(order.id);

      if (!res?.best_courier) {
        throw new Error("No courier available for this order");
      }

      // Step 3: Update status
      await updateOrderStatus(order.id, order.status, "shipment");

      toast.success(
        `✅ Shipment created! Courier: ${res.best_courier.courier_name} (₹${res.best_courier.freight_charge || res.best_courier.total_cost})`
      );

      fetchOrders();
    } catch (error: any) {
      console.error("Shipment error:", error);
      toast.error(error.message || "Shipment failed. Please try again.");
    } finally {
      setLoadingShipment(null);
    }
  };

  // Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  // Refund Order
  const handleRefundOrder = async (orderId: string) => {
    if (!confirm("Do you want to refund this order?")) return;

    try {
      await refundOrder(orderId);
      toast.success("Order refunded successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to refund order");
    }
  };

  // Handle Download Label
  const handleDownloadLabel = async (orderId: string) => {
    try {
      toast.info("Generating label...");
      await downloadLabel(orderId);
      toast.success("Label downloaded successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to download label");
    }
  };

  // Handle Download Manifest Label
  const handleDownloadManifest = async (orderId: string) => {
    try {
      setLoadingManifest(orderId);
      toast.info("Generating manifest label...");
      await downloadManifestLabel(orderId);
      toast.success("Manifest label downloaded successfully!");
    } catch (error: any) {
      console.error("Manifest download error:", error);
      toast.error(error.message || "Failed to download manifest label");
    } finally {
      setLoadingManifest(null);
    }
  };

  // Handle Generate Invoice
  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setLoadingInvoice(orderId);
      toast.info("Generating invoice...");
      await generateInvoice(orderId);
      toast.success("Invoice generated and downloaded successfully!");
    } catch (error: any) {
      console.error("Invoice generation error:", error);
      toast.error(error.message || "Failed to generate invoice");
    } finally {
      setLoadingInvoice(null);
    }
  };

  const navigate = useNavigate();

  // Calculate Statistics
  const statistics = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "process").length,
    shipped: orders.filter(o => o.status === "shipment").length,
    delivered: orders.filter(o => o.status === "delivery").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: ColumnDef<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="group">
          <span className="font-mono text-xs font-medium bg-gray-100 px-2 py-1 rounded group-hover:bg-gray-200 transition">
            {row.original.id.slice(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-gray-400" />
            <p className="font-medium text-sm">{row.original.user?.username || "N/A"}</p>
          </div>
          <p className="text-xs text-gray-500">{row.original.user?.email || "N/A"}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Truck className="w-3 h-3" />
            {row.original.address?.phone || "No phone"}
          </div>
        </div>
      ),
    },
    {
      header: "Order Items",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-sm">{row.original.items?.length || 0} item(s)</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {row.original.items?.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-xs text-gray-600 truncate">
                {item.quantity}x {item.product_name?.slice(0, 25)}
              </p>
            ))}
            {row.original.items && row.original.items.length > 2 && (
              <p className="text-xs text-blue-500 font-medium">
                +{row.original.items.length - 2} more items
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Total",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span className="font-bold text-lg text-green-600">₹{row.original.total_amount?.toFixed(2) || 0}</span>
          </div>
          {row.original.delivery_charge > 0 && (
            <p className="text-xs text-gray-500">+ ₹{row.original.delivery_charge} delivery</p>
          )}
        </div>
      ),
    },
    {
      header: "Payment",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium">{row.original.payment_method}</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
            row.original.payment_status === "paid" 
              ? "bg-green-100 text-green-700" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {row.original.payment_status === "paid" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {row.original.payment_status === "paid" ? "Paid" : "Pending"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[row.original.status]?.color || "bg-gray-100"}`}>
          {STATUS_CONFIG[row.original.status]?.icon}
          {STATUS_CONFIG[row.original.status]?.label || row.original.status}
        </span>
      ),
    },
    {
      header: "Shipment",
      cell: ({ row }) => {
        const shipment = row.original.shipment;

        if (!shipment) return <span className="text-gray-400 text-sm">-</span>;

        return (
          <div className="space-y-1 text-xs">
            {shipment.awb_code && (
              <p className="font-mono font-medium bg-gray-50 px-1 py-0.5 rounded">
                {shipment.awb_code}
              </p>
            )}
            {shipment.courier_name && (
              <p className="text-gray-600 truncate max-w-[150px]">{shipment.courier_name}</p>
            )}
            {shipment.freight_charges > 0 && (
              <p className="text-green-600 font-medium">₹{shipment.freight_charges.toFixed(2)}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Documents",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        const labelUrl = shipment?.label_url;
        const status = row.original.status;

        return (
          <div className="flex gap-2 flex-wrap">
            {/* Generate/Download Individual Label */}
            {status === "shipment" && !labelUrl && shipment?.awb_code && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => handleDownloadLabel(row.original.id)}
                disabled={loadingShipment === row.original.id}
              >
                {loadingShipment === row.original.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Printer className="w-3 h-3" />
                )}
                <span className="ml-1">Label</span>
              </Button>
            )}

            {/* Print Individual Label */}
            {labelUrl && (
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handlePrintLabel(labelUrl)}
              >
                <Printer className="w-3 h-3 mr-1" />
                Print
              </Button>
            )}

            {/* Download Manifest Label */}
            {status === "shipment" && shipment?.awb_code && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
                onClick={() => handleDownloadManifest(row.original.id)}
                disabled={loadingManifest === row.original.id}
              >
                {loadingManifest === row.original.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                <span className="ml-1">Manifest</span>
              </Button>
            )}

            {/* Generate Invoice - Always available for non-cancelled orders */}
            {status !== "cancelled" && status !== "refunded" && (
              <Button
                size="sm"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={() => handleGenerateInvoice(row.original.id)}
                disabled={loadingInvoice === row.original.id}
              >
                {loadingInvoice === row.original.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Receipt className="w-3 h-3" />
                )}
                <span className="ml-1">Invoice</span>
              </Button>
            )}
          </div>
        );
      },
    },
    {
      header: "Update Status",
      cell: ({ row }) => (
        <OrderStatusForm
          currentStatus={row.original.status}
          onChange={(status) => handleStatusChange(row.original, status)}
          loading={loadingShipment === row.original.id}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status;
        const canCancel = status !== "cancelled" && status !== "refunded" && status !== "delivery";
        const canRefund = status !== "refunded" && status !== "cancelled" && status !== "pending";

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => navigate(`/admin/orders/${row.original.id}`, {
                state: { order: row.original }
              })}
              title="View Order Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => handleCancelOrder(row.original.id)}
              >
                Cancel
              </Button>
            )}
            {canRefund && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => handleRefundOrder(row.original.id)}
              >
                Refund
              </Button>
            )}
          </div>
        );
      },
    },
    {
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            {new Date(row.original.created_at).toLocaleDateString()}
          </div>
          <p className="text-gray-400 mt-1">
            {new Date(row.original.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <Button 
          onClick={fetchOrders} 
          variant="outline" 
          className="gap-2 border-gray-300 hover:border-blue-500 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Orders" 
          value={statistics.total} 
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <SummaryCard 
          title="Pending Orders" 
          value={statistics.pending} 
          icon={Clock}
          color="bg-yellow-500"
        />
        <SummaryCard 
          title="Shipped Orders" 
          value={statistics.shipped} 
          icon={Truck}
          color="bg-cyan-500"
        />
        <SummaryCard 
          title="Total Revenue" 
          value={`₹${statistics.totalRevenue.toFixed(2)}`} 
          icon={DollarSign}
          color="bg-green-500"
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="gap-2"
            >
              All ({statistics.total})
            </Button>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = orders.filter(o => o.status === status).length;
              if (count === 0) return null;
              return (
                <Button
                  key={status}
                  size="sm"
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status as OrderStatus)}
                  className="gap-2"
                >
                  {config.icon}
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300" />
              <p className="text-gray-500 mt-4">No orders found</p>
              {(filterStatus !== "all" || searchTerm) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilterStatus("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <CustomTable data={filteredOrders} columns={columns} />
            </div>
          )}
        </div>
      </Card>

      <Toaster />
    </div>
  );
}