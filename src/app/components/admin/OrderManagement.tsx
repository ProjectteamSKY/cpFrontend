import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../service/orderApiService";
import { Order, OrderStatus } from "../../types/order";
import { OrderStatusForm } from "../forms/OrderStatusForm";

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    order: Order,
    newStatus: OrderStatus
  ) => {
    await updateOrderStatus(order.id, order.status, newStatus);
    fetchOrders();
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
      header: "Update Status",
      cell: ({ row }) => (
        <OrderStatusForm
          currentStatus={row.original.status}
          onChange={(status) =>
            handleStatusChange(row.original, status)
          }
        />
      ),
    },
    {
      header: "Created At",
      cell: ({ row }) => (
        <span>
          {new Date(
            row.original.created_at
          ).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Order Management
        </h1>
        <p className="text-gray-600">
          Track and update order workflow
        </p>
      </div>

      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            All Orders
          </h2>
        </div>

        <div className="p-6">
          <CustomTable
            data={orders}
            columns={columns}
          />
        </div>
      </Card>
    </div>
  );
}