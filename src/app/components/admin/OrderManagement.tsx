
// import { useEffect, useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { Card } from "../ui/card";
// import { CustomTable } from "../common/CustomTable";
// import { toast } from "react-toastify";
// import { Toaster } from "../ui/toaster";
// import {
//   getAllOrders,
//   updateOrderStatus,
// } from "../../service/orderApiService";
// import {
//   createShiprocketOrder,
//   getAvailableCouriers,
//   generateAWB,
//   downloadLabel,
//   cancelOrder,
//   refundOrder,
//   handlePrintLabel,
// } from "../../service/shippingApiService";
// import { Order, OrderStatus } from "../../types/order";
// import { OrderStatusForm } from "../forms/OrderStatusForm";
// import { Button } from "../ui/button";

// export function OrderManagement() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [couriers, setCouriers] = useState<any[]>([]);
//   const [loadingCouriers, setLoadingCouriers] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const data = await getAllOrders();
//       setOrders(data);
//     } catch (error: any) {
//       toast.error("Failed to fetch orders");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // 🔥 Handle Status Change
//   const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
//     if (order.status === "cancelled") return;

//     if (newStatus === "shipment") {
//       await handleShipmentFlow(order);
//       return;
//     }

//     try {
//       await updateOrderStatus(order.id, order.status, newStatus);
//       toast.success("Order status updated successfully!");
//       fetchOrders();
//     } catch (error: any) {
//       toast.error("Failed to update order status");
//     }
//   };

//   // 🚚 Shipment Flow
//   const handleShipmentFlow = async (order: Order) => {
//     try {
//       setSelectedOrder(order);
//       setLoadingCouriers(true);

//       await createShiprocketOrder(order.id);
//       const courierData = await getAvailableCouriers(order.id);

//       setCouriers(courierData);
//     } catch (error: any) {
//       toast.error("Failed to fetch couriers");
//     } finally {
//       setLoadingCouriers(false);
//     }
//   };

//   // 📦 Select Courier
//   const handleCourierSelect = async (courierId: number) => {
//     if (!selectedOrder) return;

//     try {
//       await generateAWB(selectedOrder.id, courierId);
//       await updateOrderStatus(selectedOrder.id, selectedOrder.status, "shipment");
//       toast.success("Shipment created successfully!");
//       setSelectedOrder(null);
//       fetchOrders();
//     } catch (error: any) {
//       toast.error("AWB generation failed");
//     }
//   };

//   // ❌ Cancel Order
//   const handleCancelOrder = async (orderId: string) => {
//     if (!confirm("Are you sure you want to cancel this order?")) return;

//     try {
//       await cancelOrder(orderId);
//       toast.success("Order cancelled successfully!");
//       fetchOrders();
//     } catch (error: any) {
//       toast.error("Failed to cancel order");
//     }
//   };

//   // 💰 Refund Order
//   const handleRefundOrder = async (orderId: string) => {
//     if (!confirm("Do you want to refund this order?")) return;

//     try {
//       await refundOrder(orderId);
//       toast.success("Order refunded successfully!");
//       fetchOrders();
//     } catch (error: any) {
//       toast.error("Failed to refund order");
//     }
//   };

//   const columns: ColumnDef<Order>[] = [
//     { header: "Order ID", accessorKey: "id" },
//     {
//       header: "Customer",
//       cell: ({ row }) => (
//         <div>
//           <p className="font-medium">{row.original.user.username}</p>
//           <p className="text-sm text-gray-500">{row.original.user.email}</p>
//         </div>
//       ),
//     },
//     {
//       header: "Total",
//       cell: ({ row }) => <span className="font-semibold">₹{row.original.total_amount}</span>,
//     },
//     {
//       header: "Status",
//       cell: ({ row }) => (
//         <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200">
//           {row.original.status}
//         </span>
//       ),
//     },
//     {
//       header: "Shipment",
//       cell: ({ row }) => {
//         const shipment = row.original.shipment;
//         const labelUrl = shipment?.label_url;
        
//         // Case 1: Shipment created but label not downloaded
//         if (row.original.status === "shipment" && !labelUrl) {
//           return (
//             <Button
//               size="sm"
//               className="bg-blue-600 text-white"
//               onClick={() => downloadLabel(row.original.id)}
//             >
//               Download Label
//             </Button>
//           );
//         }

//         // Case 2: Label already exists → Print
//         if (labelUrl) {
//           return (
//             <Button
//               size="sm"
//               className="bg-green-600 text-white"
//               onClick={() => handlePrintLabel(labelUrl)}
//             >
//               Print Label
//             </Button>
//           );
//         }

//         return "-";
//       },
//     },
//     {
//       header: "Update Status",
//       cell: ({ row }) => (
//         <OrderStatusForm
//           currentStatus={row.original.status}
//           onChange={(status) => handleStatusChange(row.original, status)}
//         />
//       ),
//     },
//     {
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           {row.original.status !== "cancelled" && (
//             <>
//               <Button
//                 size="sm"
//                 className="bg-red-600 text-white"
//                 onClick={() => handleCancelOrder(row.original.id)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 className="bg-blue-600 text-white"
//                 onClick={() => handleRefundOrder(row.original.id)}
//               >
//                 Refund
//               </Button>
//             </>
//           )}
//         </div>
//       ),
//     },
//     {
//       header: "Created At",
//       cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold">Order Management</h1>

//       <Card>
//         <div className="p-6">
//           <CustomTable data={orders} columns={columns} />
//         </div>
//       </Card>

//       {/* Courier Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
//             <h2 className="text-lg font-semibold mb-4">Select Courier</h2>

//             {loadingCouriers ? (
//               <p>Loading couriers...</p>
//             ) : (
//               <div className="space-y-3">
//                 {couriers.map((courier) => (
//                   <div
//                     key={courier.courier_id}
//                     className="border p-4 rounded flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="font-medium">{courier.courier_name}</p>
//                       <p className="text-sm text-gray-500">
//                         ₹{courier.rate} • {courier.estimated_days} days
//                       </p>
//                     </div>
//                     <Button size="sm" onClick={() => handleCourierSelect(courier.courier_id)}>
//                       Choose
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <button 
//               onClick={() => setSelectedOrder(null)} 
//               className="mt-4 text-sm text-gray-500 hover:text-gray-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <Toaster />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../service/orderApiService";
import {
  createShiprocketOrder,
  getAvailableCouriers, // ✅ now used as AUTO ASSIGN API
  downloadLabel,
  cancelOrder,
  refundOrder,
  handlePrintLabel,
} from "../../service/shippingApiService";
import { Order, OrderStatus } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";
import { Button } from "../ui/button";

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingShipment, setLoadingShipment] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 Handle Status Change
  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (order.status === "cancelled") return;

    if (newStatus === "shipment") {
      await handleShipmentFlow(order);
      return;
    }

    try {
      await updateOrderStatus(order.id, order.status, newStatus);
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to update order status");
    }
  };

  // 🚚 AUTO Shipment Flow (NO MODAL)
  const handleShipmentFlow = async (order: Order) => {
    try {
      setLoadingShipment(order.id);

      // Step 1: Create Shiprocket Order
      await createShiprocketOrder(order.id);

      // Step 2: AUTO assign best courier (your backend handles everything)
      const res = await getAvailableCouriers(order.id);

      if (!res?.best_courier) {
        throw new Error("No courier available");
      }

      // Step 3: Update status
      await updateOrderStatus(order.id, order.status, "shipment");

      toast.success(
        `Courier Assigned: ${res.best_courier.courier_name} (₹${res.best_courier.total_cost})`
      );

      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Shipment failed");
    } finally {
      setLoadingShipment(null);
    }
  };

  // ❌ Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to cancel order");
    }
  };

  // 💰 Refund Order
  const handleRefundOrder = async (orderId: string) => {
    if (!confirm("Do you want to refund this order?")) return;

    try {
      await refundOrder(orderId);
      toast.success("Order refunded successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to refund order");
    }
  };

  const columns: ColumnDef<Order>[] = [
    { header: "Order ID", accessorKey: "id" },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user.username}</p>
          <p className="text-sm text-gray-500">{row.original.user.email}</p>
        </div>
      ),
    },
    {
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold">₹{row.original.total_amount}</span>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200">
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Shipment",
      cell: ({ row }) => {
        const shipment = row.original.shipment;
        const labelUrl = shipment?.label_url;

        if (row.original.status === "shipment" && !labelUrl) {
          return (
            <Button
              size="sm"
              className="bg-blue-600 text-white"
              onClick={() => downloadLabel(row.original.id)}
            >
              Download Label
            </Button>
          );
        }

        if (labelUrl) {
          return (
            <Button
              size="sm"
              className="bg-green-600 text-white"
              onClick={() => handlePrintLabel(labelUrl)}
            >
              Print Label
            </Button>
          );
        }

        return "-";
      },
    },
    {
      header: "Update Status",
      cell: ({ row }) => (
        <OrderStatusForm
          currentStatus={row.original.status}
          onChange={(status) =>
            handleStatusChange(row.original, status)
          }
          loading={loadingShipment === row.original.id} // optional spinner support
        />
      ),
    },

{
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status !== "cancelled" && (
            <>
              <Button
                size="sm"
                className="bg-red-600 text-white"
                onClick={() => handleCancelOrder(row.original.id)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 text-white"
                onClick={() => handleRefundOrder(row.original.id)}
              >
                Refund
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <Card>
        <div className="p-6">
          <CustomTable data={orders} columns={columns} />
        </div>
      </Card>

      <Toaster />
    </div>
  );
}