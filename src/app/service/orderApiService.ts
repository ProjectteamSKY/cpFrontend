import api from "./api";
import { Order, OrderStatus } from "../types/order";

/* =========================
   Status Flow (Frontend Guard)
========================= */

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["process"],
  process: ["printing"],
  printing: ["packed"],
  packed: ["shipment"],
  shipment: ["delivery"],
  delivery: [],
};

/* =========================
   Get All Orders (Tracking)
========================= */

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders_routes/tracking");
  return res.data;
};

/* =========================
   Update Order Status
========================= */

export const updateOrderStatus = async (
  orderId: string,
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): Promise<void> => {
  const allowed = STATUS_FLOW[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}`
    );
  }

  await api.put(`/orders_routes/orders/${orderId}/status`, {
    status: newStatus,
  });
};


