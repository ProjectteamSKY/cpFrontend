import api from "./api";
import { Order, OrderStatus } from "../types/order";

/* =========================
   Status Flow (Frontend Guard)
========================= */

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  confirmed: ["pending"],
  pending: ["process"],
  process: ["printing"],
  printing: ["packed"],
  packed: ["shipment"],
  shipment: ["delivery"],
  delivery: [],
  cancelled: [],
  refunded: [],
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
  currentStatus: OrderStatus | string,
  newStatus: OrderStatus
): Promise<void> => {
  // ✅ SAFE fallback
  const allowed =
    typeof currentStatus === "string" && currentStatus in STATUS_FLOW
      ? STATUS_FLOW[currentStatus as OrderStatus]
      : [];

  // ✅ Debug (very important)
  console.log("STATUS CHECK: - orderApiService.ts:44", {
    currentStatus,
    newStatus,
    allowed,
  });

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}`
    );
  }

  // ✅ API CALL (will now trigger)
  await api.put(`/orders_routes/orders/${orderId}/status`, {
    status: newStatus,
  });
};


