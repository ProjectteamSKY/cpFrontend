// import { useEffect, useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { Card } from "../ui/card";
// import { CustomTable } from "../common/CustomTable";
// import {
//   getAllOrders,
//   updateOrderStatus,
// } from "../../service/orderApiService";
// import { Order, OrderStatus } from "../../types/order";
// import { OrderStatusForm } from "../forms/OrderStatusForm";

// export function OrderManagement() {
//   const [orders, setOrders] = useState<Order[]>([]);

//   const fetchOrders = async () => {
//     const data = await getAllOrders();
//     setOrders(data);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (
//     order: Order,
//     newStatus: OrderStatus
//   ) => {
//     await updateOrderStatus(order.id, order.status, newStatus);
//     fetchOrders();
//   };

//   const columns: ColumnDef<Order>[] = [
//     {
//       header: "Order ID",
//       accessorKey: "id",
//     },
//     {
//       header: "Customer",
//       cell: ({ row }) => (
//         <div>
//           <p className="font-medium">
//             {row.original.user.username}
//           </p>
//           <p className="text-sm text-gray-500">
//             {row.original.user.email}
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: "Total",
//       cell: ({ row }) => (
//         <span className="font-semibold">
//           ₹{row.original.total_amount}
//         </span>
//       ),
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
//       header: "Update Status",
//       cell: ({ row }) => (
//         <OrderStatusForm
//           currentStatus={row.original.status}
//           onChange={(status) =>
//             handleStatusChange(row.original, status)
//           }
//         />
//       ),
//     },
//     {
//       header: "Created At",
//       cell: ({ row }) => (
//         <span>
//           {new Date(
//             row.original.created_at
//           ).toLocaleDateString()}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold mb-2">
//           Order Management
//         </h1>
//         <p className="text-gray-600">
//           Track and update order workflow
//         </p>
//       </div>

//       <Card className="bg-white shadow-sm border-0">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold">
//             All Orders
//           </h2>
//         </div>

//         <div className="p-6">
//           <CustomTable
//             data={orders}
//             columns={columns}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../service/orderApiService";
import {
  createShiprocketOrder,
  getAvailableCouriers,
  generateAWB,
  downloadLabel,
} from "../../service/shippingApiService";
import { Order, OrderStatus } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";
import { Button } from "../ui/button";

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);
  const [couriers, setCouriers] =
    useState<any[]>([]);
  const [loadingCouriers, setLoadingCouriers] =
    useState(false);

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 Handle Status Change
  const handleStatusChange = async (
    order: Order,
    newStatus: OrderStatus
  ) => {
    if (newStatus === "shipment") {
      await handleShipmentFlow(order);
      return;
    }

    await updateOrderStatus(
      order.id,
      order.status,
      newStatus
    );

    fetchOrders();
  };

  // 🚚 Shipment Flow
  const handleShipmentFlow = async (
    order: Order
  ) => {
    try {
      setSelectedOrder(order);
      setLoadingCouriers(true);

      await createShiprocketOrder(order.id);

      const courierData =
        await getAvailableCouriers(order.id);

      setCouriers(courierData);
    } catch (error) {
      alert("Failed to fetch couriers");
    } finally {
      setLoadingCouriers(false);
    }
  };

  // 📦 Select Courier
  const handleCourierSelect = async (
    courierId: number
  ) => {
    if (!selectedOrder) return;

    try {
      await generateAWB(
        selectedOrder.id,
        courierId
      );

      await updateOrderStatus(
        selectedOrder.id,
        selectedOrder.status,
        "shipment"
      );

      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      alert("AWB generation failed");
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
    },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.user.username}
          </p>
          <p className="text-sm text-gray-500">
            {row.original.user.email}
          </p>
        </div>
      ),
    },
    {
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹{row.original.total_amount}
        </span>
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
      cell: ({ row }) =>
        row.original.shipment ? (
          <Button
            size="sm"
            onClick={() =>
              downloadLabel(row.original.id)
            }
          >
            Download Label
          </Button>
        ) : (
          "-"
        ),
    },
    {
      header: "Update Status",
      cell: ({ row }) => (
        <OrderStatusForm
          currentStatus={row.original.status}
          onChange={(status) =>
            handleStatusChange(
              row.original,
              status
            )
          }
        />
      ),
    },
    {
      header: "Created At",
      cell: ({ row }) =>
        new Date(
          row.original.created_at
        ).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Order Management
      </h1>

      <Card>
        <div className="p-6">
          <CustomTable
            data={orders}
            columns={columns}
          />
        </div>
      </Card>

      {/* Courier Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Select Courier
            </h2>

            {loadingCouriers ? (
              <p>Loading couriers...</p>
            ) : (
              <div className="space-y-3">
                {couriers.map((courier) => (
                  <div
                    key={courier.courier_id}
                    className="border p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {courier.courier_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{courier.rate} •{" "}
                        {
                          courier.estimated_days
                        }{" "}
                        days
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleCourierSelect(
                          courier.courier_id
                        )
                      }
                    >
                      Choose
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                setSelectedOrder(null)
              }
              className="mt-4 text-sm text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}