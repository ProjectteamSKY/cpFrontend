import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNavigate } from "react-router-dom";

import { getAllOrders, updateOrderStatus } from "../../service/orderApiService";
import {
  createShiprocketOrder,
  downloadLabel,
  cancelOrder,
  handlePrintLabel,
  downloadManifestLabel,
  generateInvoice,
  generatePickup,
} from "../../service/shippingApiService";
import { Order, OrderStatus, OrderItem } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";
import {
  Eye, RefreshCw, Package, Truck, DollarSign, Calendar,
  FileText, Printer, AlertCircle, CheckCircle, Clock,
  XCircle, ShoppingBag, Receipt, CalendarDays, X,
  Filter, Search, TrendingUp,
} from "lucide-react";

// ─── Shipped-family statuses (for document/pickup button logic) ───────────────
const SHIPPED_STATUSES = ["shipment", "pickup_scheduled"] as const;
type ShippedStatus = typeof SHIPPED_STATUSES[number];
const isShippedFamily = (s: string): s is ShippedStatus =>
  SHIPPED_STATUSES.includes(s as ShippedStatus);

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: JSX.Element }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400", icon: <Clock className="w-3 h-3" /> },
  process: { label: "Processing", color: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500", icon: <RefreshCw className="w-3 h-3" /> },
  printing: { label: "Printing", color: "bg-violet-50 text-violet-700 border border-violet-200", dot: "bg-violet-500", icon: <Printer className="w-3 h-3" /> },
  packed: { label: "Packed", color: "bg-indigo-50 text-indigo-700 border border-indigo-200", dot: "bg-indigo-500", icon: <Package className="w-3 h-3" /> },
  shipment: { label: "Shipped", color: "bg-sky-50 text-sky-700 border border-sky-200", dot: "bg-sky-500", icon: <Truck className="w-3 h-3" /> },
  pickup_scheduled: { label: "Pickup Scheduled", color: "bg-orange-50 text-orange-700 border border-orange-200", dot: "bg-orange-500", icon: <CalendarDays className="w-3 h-3" /> },
  delivery: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500", icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: "Refunded", color: "bg-slate-50 text-slate-600 border border-slate-200", dot: "bg-slate-400", icon: <DollarSign className="w-3 h-3" /> },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, accent, sub }: any) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    style={{ background: "linear-gradient(135deg, #fff 60%, #f8faff)" }}
  >
    <div className="flex items-start justify-between">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: accent }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <TrendingUp className="w-4 h-4 text-gray-300" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {status}
    </span>
  );
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingShipment, setLoadingShipment] = useState<string | null>(null);
  const [loadingManifest, setLoadingManifest] = useState<string | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);
  const [loadingPickup, setLoadingPickup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupScheduleData, setPickupScheduleData] = useState<any>(null);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

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
      toast.success(`Order status updated to ${STATUS_CONFIG[newStatus]?.label ?? newStatus}!`);
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleShipmentFlow = async (order: Order) => {
    try {
      setLoadingShipment(order.id);
      toast.success("Creating shipment...");
      const res = await createShiprocketOrder(order.id);
      toast.success(
        `Shipment created successfully${res?.courier_name ? ` with ${res.courier_name}` : ""}${res?.awb_code ? ` | AWB: ${res.awb_code}` : ""}`,
        { id: "shipment-flow" }
      );
      await fetchOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || error?.message || "Shipment failed. Please try again.",
        { id: "shipment-flow" }
      );
    } finally {
      setLoadingShipment(null);
    }
  };

  const handleSchedulePickup = async (orderId: string) => {
    try {
      setLoadingPickup(orderId);
      toast.success("Scheduling pickup...");
      const response = await generatePickup(orderId);
      if (response?.pickup_scheduled) {
        toast.success(`Pickup scheduled successfully for ${response.pickup_date || "today"}!`);
        setPickupScheduleData(response);
        setShowPickupModal(true);
        await fetchOrders();
      } else {
        toast.error(response?.message || "Failed to schedule pickup");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to schedule pickup");
    } finally {
      setLoadingPickup(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelLoading(true);

      toast.info("Cancelling order...");

      await cancelOrder(orderId);

      toast.success("Order cancelled successfully!");

      await fetchOrders();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

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

  const handleDownloadManifest = async (orderId: string) => {
    try {
      setLoadingManifest(orderId);
      toast.info("Generating manifest label...");
      await downloadManifestLabel(orderId);
      toast.success("Manifest label downloaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to download manifest label");
    } finally {
      setLoadingManifest(null);
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setLoadingInvoice(orderId);
      toast.info("Generating invoice...");
      await generateInvoice(orderId);
      toast.success("Invoice generated and downloaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invoice");
    } finally {
      setLoadingInvoice(null);
    }
  };

  const statistics = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "process").length,
    shipped: orders.filter(o => isShippedFamily(o.status)).length,
    delivered: orders.filter(o => o.status === "delivery").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = new Date(order.created_at).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Date.now();
      matchesDate = orderDate >= start && orderDate <= end;
    }
    return matchesStatus && matchesSearch && matchesDate;
  });

  const clearDateFilters = () => { setStartDate(""); setEndDate(""); };
  const hasActiveFilters = filterStatus !== "all" || searchTerm !== "" || startDate !== "" || endDate !== "";

  // ─── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Order>[] = [
    {
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 min-w-[160px]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d4863] to-[#4a7ca8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {(row.original.user?.username || "?")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{row.original.user?.username || "N/A"}</p>
            <p className="text-xs text-gray-400 truncate">{row.original.user?.email || "N/A"}</p>
            {row.original.address?.phone && (
              <p className="text-xs text-gray-400">{row.original.address.phone}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Items",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-[#2d4863]" />
            <span className="text-xs font-semibold text-gray-700">
              {row.original.items?.length || 0} item{row.original.items?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-0.5">
            {row.original.items?.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-xs text-gray-500 truncate max-w-[170px]">
                <span className="font-medium text-gray-600">{item.quantity}×</span> {item.product_name?.slice(0, 22)}
              </p>
            ))}
            {row.original.items && row.original.items.length > 2 && (
              <span className="inline-block text-[10px] font-medium text-[#2d4863] bg-[#2d4863]/8 px-1.5 py-0.5 rounded">
                +{row.original.items.length - 2} more
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: ({ row }) => (
        <div className="min-w-[90px]">
          <p className="text-base font-bold text-gray-900">₹{row.original.total_amount?.toFixed(2) || "0.00"}</p>
          {row.original.delivery_charge > 0 && (
            <p className="text-xs text-gray-400">+₹{row.original.delivery_charge} delivery</p>
          )}
        </div>
      ),
    },
    {
      header: "Payment",
      cell: ({ row }) => (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-600 capitalize">{row.original.payment_method}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${row.original.payment_status === "paid"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
            {row.original.payment_status === "paid" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {row.original.payment_status === "paid" ? "Paid" : "Pending"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: "Shipment",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        if (!shipment) return <span className="text-gray-300 text-xs">—</span>;
        return (
          <div className="space-y-1 text-xs min-w-[140px]">
            {shipment.awb_code && (
              <p className="font-mono font-semibold text-[#2d4863] bg-[#2d4863]/8 px-1.5 py-0.5 rounded text-[11px]">
                {shipment.awb_code}
              </p>
            )}
            {shipment.courier_name && (
              <p className="text-gray-500 truncate max-w-[140px]">{shipment.courier_name}</p>
            )}
            {shipment.freight_charges > 0 && (
              <p className="text-emerald-600 font-semibold">₹{shipment.freight_charges.toFixed(2)}</p>
            )}
            {shipment.pickup_scheduled && shipment.pickup_date && (
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                <CalendarDays className="w-3 h-3 flex-shrink-0" />
                <span>{new Date(shipment.pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Pickup",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        const status = row.original.status;
        // Show schedule button if in shipped-family AND has AWB AND pickup not yet scheduled
        const showPickupButton = isShippedFamily(status) && shipment?.awb_code && !shipment?.pickup_scheduled;
        const isPickupScheduled = shipment?.pickup_scheduled || status === "pickup_scheduled";

        if (!showPickupButton && !isPickupScheduled) return <span className="text-gray-300 text-xs">—</span>;

        if (isPickupScheduled) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              Scheduled
            </span>
          );
        }

        return (
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-60"
            onClick={() => handleSchedulePickup(row.original.id)}
            disabled={loadingPickup === row.original.id}
          >
            {loadingPickup === row.original.id
              ? <RefreshCw className="w-3 h-3 animate-spin" />
              : <CalendarDays className="w-3 h-3" />}
            Schedule
          </button>
        );
      },
    },
    {
      header: "Documents",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        const labelUrl = shipment?.label_url;
        const status = row.original.status;
        // ✅ Key fix: use isShippedFamily so pickup_scheduled also shows Label & Manifest
        const inShippedFamily = isShippedFamily(status);
        const hasAwb = !!shipment?.awb_code;
        const isPickupScheduled = status === "pickup_scheduled";
        const notDone = status !== "cancelled" && status !== "refunded";

        return (
          <div className="flex gap-1.5 flex-wrap">
            {/* Label — show if shipped-family + AWB + no label yet */}
            {inShippedFamily && !labelUrl && hasAwb && (
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 transition disabled:opacity-60"
                onClick={() => handleDownloadLabel(row.original.id)}
                disabled={loadingShipment === row.original.id}
              >
                {loadingShipment === row.original.id
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : <Printer className="w-3 h-3" />}
                Label
              </button>
            )}

            {/* Print — show if label URL exists */}
            {labelUrl && (
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                onClick={() => handlePrintLabel(labelUrl)}
              >
                <Printer className="w-3 h-3" />
                Print
              </button>
            )}

            {/* Manifest — show if shipped-family + AWB */}
            {inShippedFamily && isPickupScheduled && hasAwb && (
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100 transition disabled:opacity-60"
                onClick={() => handleDownloadManifest(row.original.id)}
                disabled={loadingManifest === row.original.id}
              >
                {loadingManifest === row.original.id
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : <FileText className="w-3 h-3" />}
                Manifest
              </button>
            )}

            {/* Invoice — show for all non-cancelled/refunded */}
            {notDone && isPickupScheduled && (
              <button
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-60"
                onClick={() => handleGenerateInvoice(row.original.id)}
                disabled={loadingInvoice === row.original.id}
              >
                {loadingInvoice === row.original.id
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : <Receipt className="w-3 h-3" />}
                Invoice
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Update Status",
      cell: ({ row }) => (
        <OrderStatusForm
          currentStatus={row.original.status as OrderStatus}
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
        return (
          <div className="flex gap-1.5">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#2d4863] hover:text-[#2d4863] hover:bg-[#2d4863]/5 transition"
              onClick={() => navigate(`/admin/orders/${row.original.id}`, { state: { order: row.original } })}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {canCancel && (
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition"
                onClick={() => handleCancelOrder(row.original.id)}
                title="Cancel Order"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/70 p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2d4863] flex items-center justify-center shadow">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-11">
            {statistics.total} total orders · ₹{statistics.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })} revenue
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#2d4863] hover:text-[#2d4863] transition shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={statistics.total} icon={ShoppingBag} accent="linear-gradient(135deg,#2d4863,#4a7ca8)" />
        <StatCard title="Pending" value={statistics.pending} sub={`${statistics.processing} processing`} icon={Clock} accent="linear-gradient(135deg,#f59e0b,#fbbf24)" />
        <StatCard title="Shipped" value={statistics.shipped} sub={`${statistics.delivered} delivered`} icon={Truck} accent="linear-gradient(135deg,#0ea5e9,#38bdf8)" />
        <StatCard title="Revenue" value={`₹${(statistics.totalRevenue / 1000).toFixed(1)}k`} sub={`${statistics.cancelled} cancelled`} icon={DollarSign} accent="linear-gradient(135deg,#10b981,#34d399)" />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Status pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${filterStatus === "all"
                  ? "bg-[#2d4863] text-white border-[#2d4863] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#2d4863] hover:text-[#2d4863]"
                }`}
            >
              All <span className="ml-1 opacity-70">({statistics.total})</span>
            </button>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = orders.filter(o => o.status === status).length;
              if (count === 0) return null;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${filterStatus === status
                      ? "bg-[#2d4863] text-white border-[#2d4863] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#2d4863] hover:text-[#2d4863]"
                    }`}
                >
                  {config.icon}
                  {config.label}
                  <span className="ml-0.5 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, name, email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4863]/20 focus:border-[#2d4863] transition"
            />
          </div>
        </div>

        {/* Date row */}
        <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Calendar className="w-4 h-4 text-[#2d4863]" />
            <span className="text-xs font-semibold text-gray-700">Date Range</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4863]/20 focus:border-[#2d4863] transition"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4863]/20 focus:border-[#2d4863] transition"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={clearDateFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition self-end"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table / States ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading || cancelLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#2d4863]/20 border-t-[#2d4863] animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading orders…</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
            {hasActiveFilters && (
              <button
                className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#2d4863] border border-[#2d4863]/30 hover:bg-[#2d4863]/5 transition"
                onClick={() => { setFilterStatus("all"); setSearchTerm(""); clearDateFilters(); }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                {filteredOrders.length}{" "}
                <span className="font-normal text-gray-400">
                  order{filteredOrders.length !== 1 ? "s" : ""} {hasActiveFilters ? "matched" : "total"}
                </span>
              </p>
              {hasActiveFilters && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2d4863] bg-[#2d4863]/8 px-2 py-0.5 rounded-full">
                  <Filter className="w-3 h-3" />
                  Filtered
                </span>
              )}
            </div>
            <CustomTable data={filteredOrders} columns={columns} />
          </div>
        )}
      </div>

      {/* ── Pickup Modal ── */}
      <Dialog open={showPickupModal} onOpenChange={setShowPickupModal}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#2d4863]">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
              </div>
              Pickup Scheduled!
            </DialogTitle>
          </DialogHeader>
          {pickupScheduleData && (
            <div className="space-y-4 mt-2">
              <div className="bg-[#2d4863]/5 border border-[#2d4863]/15 rounded-xl p-4 space-y-3">
                {[
                  { label: "Pickup ID", value: pickupScheduleData.pickup_id || "N/A" },
                  { label: "Date", value: pickupScheduleData.pickup_date ? new Date(pickupScheduleData.pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Today" },
                  { label: "Time", value: pickupScheduleData.pickup_time || "9:00 AM – 6:00 PM" },
                  { label: "Status", value: "Confirmed" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-100 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700 leading-relaxed">
                  Please ensure all packages are ready and labelled before the pickup window.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowPickupModal(false)}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#2d4863] hover:bg-[#1f3447] transition shadow-sm"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}