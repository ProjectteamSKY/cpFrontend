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
} from "../../service/shippingApiService";
import { Order, OrderStatus, OrderItem } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";
import { Button } from "../ui/button";
import { Eye, RefreshCw, Package, Truck, DollarSign, User, MapPin, Calendar, CreditCard } from "lucide-react";

// Status display configuration
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  process: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  printing: { label: "Printing", color: "bg-purple-100 text-purple-700" },
  packed: { label: "Packed", color: "bg-indigo-100 text-indigo-700" },
  shipment: { label: "Shipped", color: "bg-cyan-100 text-cyan-700" },
  delivery: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
};

// Order Details Modal Component
function OrderDetailsModal({ order, isOpen, onClose }: { order: Order | null; isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"items" | "shipping" | "payment">("items");

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
        </DialogHeader>

        {/* Order Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${STATUS_CONFIG[order.status]?.color}`}>
              {STATUS_CONFIG[order.status]?.label || order.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">₹{order.total_amount?.toFixed(2) || 0}</p>
            {order.delivery_charge > 0 && (
              <p className="text-xs text-gray-500">Delivery: ₹{order.delivery_charge}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium">{order.payment_method}</p>
            <p className={`text-xs ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
              {order.payment_status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery Type</p>
            <p className="font-medium capitalize">{order.delivery_type}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("items")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "items" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Package className="inline-block w-4 h-4 mr-2" />
              Order Items ({order.items?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "shipping" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Truck className="inline-block w-4 h-4 mr-2" />
              Shipping Info
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "payment" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <CreditCard className="inline-block w-4 h-4 mr-2" />
              Payment Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "items" && (
            <div className="space-y-4">
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Unit Price: ₹{item.unit_price}</p>
                      <p className="text-sm font-medium mt-1">Total: ₹{item.total_price}</p>

                      {/* Attributes */}
                      {item.selected_attributes && item.selected_attributes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Specifications:</p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {item.selected_attributes.map((attr, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="text-gray-600">{attr.attribute_name}:</span>
                                <span className="ml-1 font-medium">{attr.attribute_value_name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Files */}
                      {item.files && item.files.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Design Files:</p>
                          {item.files.map((file, idx) => (
                            <div key={idx} className="mt-2">
                              {file.front_side_url && (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={file.front_side_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View Front Design
                                  </a>
                                </div>
                              )}
                              {file.back_side_url && (
                                <div className="flex items-center gap-2 mt-1">
                                  <a
                                    href={file.back_side_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View Back Design
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Preview */}
                    {item.files?.[0]?.front_side_url && (
                      <div className="ml-4">
                        <img
                          src={item.files[0].front_side_url}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              {/* Customer Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{order.user?.username || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{order.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{order.address?.phone || order.user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{order.address?.name || order.user?.username}</p>
                  <p>{order.address?.address}</p>
                  <p>{order.address?.city}, {order.address?.state}</p>
                  <p>PIN Code: {order.address?.postal_code}</p>
                  <p>Country: {order.address?.country}</p>
                  {order.address?.landmark && <p>Landmark: {order.address.landmark}</p>}
                </div>
              </div>

              {/* Shipment Details */}
              {order.shipment && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">AWB Code</p>
                      <p className="font-mono font-medium">{order.shipment.awb_code || "Not generated"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courier</p>
                      <p className="font-medium">{order.shipment.courier_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Freight Charges</p>
                      <p className="font-medium">₹{order.shipment.freight_charges?.toFixed(2) || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium">{order.shipment.current_status || "N/A"}</p>
                    </div>
                    {order.shipment.tracking_url && (
                      <div className="col-span-2">
                        <a
                          href={order.shipment.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Track Shipment →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.total_amount?.toFixed(2) || 0}</span>
                  </div>
                  {order.delivery_charge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span>₹{order.delivery_charge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{order.total_amount?.toFixed(2) || 0}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className={`font-medium ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.payment_status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(order.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingShipment, setLoadingShipment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // View Order Details
  // const handleViewOrder = (order: Order) => {
  //   setSelectedOrder(order);
  //   setIsModalOpen(true);
  // };
  const navigate = useNavigate();

  const columns: ColumnDef<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user?.username || "N/A"}</p>
          <p className="text-sm text-gray-500">{row.original.user?.email || "N/A"}</p>
          <p className="text-xs text-gray-400">{row.original.address?.phone || "No phone"}</p>
        </div>
      ),
    },
    {
      header: "Order Items",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{row.original.items?.length || 0} item(s)</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {row.original.items?.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-xs text-gray-600">
                {item.quantity}x {item.product_name?.slice(0, 30)}
                {item.quantity > 1 && ` (${item.quantity})`}
              </p>
            ))}
            {row.original.items && row.original.items.length > 2 && (
              <p className="text-xs text-gray-400">
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
        <div>
          <span className="font-semibold text-lg">₹{row.original.total_amount?.toFixed(2) || 0}</span>
          {row.original.delivery_charge > 0 && (
            <p className="text-xs text-gray-500">+ ₹{row.original.delivery_charge} delivery</p>
          )}
        </div>
      ),
    },
    {
      header: "Payment",
      cell: ({ row }) => (
        <div>
          <span className="text-sm">{row.original.payment_method}</span>
          <p className={`text-xs font-medium mt-1 ${row.original.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
            }`}>
            {row.original.payment_status === "paid" ? "✓ Paid" : "Pending"}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[row.original.status]?.color || "bg-gray-100"}`}>
          {STATUS_CONFIG[row.original.status]?.label || row.original.status}
        </span>
      ),
    },
    {
      header: "Shipment Info",
      cell: ({ row }) => {
        const shipment = row.original.shipment;

        if (!shipment) return <span className="text-gray-400">-</span>;

        return (
          <div className="text-xs">
            {shipment.awb_code && (
              <p className="font-mono font-medium">{shipment.awb_code}</p>
            )}
            {shipment.courier_name && (
              <p className="text-gray-600 truncate max-w-[150px]">{shipment.courier_name}</p>
            )}
            {shipment.freight_charges > 0 && (
              <p className="text-gray-500">₹{shipment.freight_charges.toFixed(2)}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Label",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        const labelUrl = shipment?.label_url;
        const status = row.original.status;

        if (status === "shipment" && !labelUrl && shipment?.awb_code) {
          return (
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => handleDownloadLabel(row.original.id)}
              disabled={loadingShipment === row.original.id}
            >
              {loadingShipment === row.original.id ? "Generating..." : "Generate Label"}
            </Button>
          );
        }

        if (labelUrl) {
          return (
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => handlePrintLabel(labelUrl)}
            >
              🖨️ Print Label
            </Button>
          );
        }

        return <span className="text-gray-400">-</span>;
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
                state: { order: row.original }  // Pass the entire order object
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
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            {new Date(row.original.created_at).toLocaleDateString()}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(row.original.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-gray-500 mt-2">No orders found</p>
            </div>
          ) : (
            <CustomTable data={orders} columns={columns} />
          )}
        </div>
      </Card>

      <Toaster />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}