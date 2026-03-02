import { OrderStatus } from "../types/order";

export const statusOptions: OrderStatus[] = [
  "pending",
  "process",
  "printing",
  "packed",
  "shipment",
  "delivery",
];