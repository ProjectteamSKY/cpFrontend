import { useState } from "react";
import { OrderStatus } from "../../types/order";

interface Props {
  currentStatus: OrderStatus;
  onChange: (status: OrderStatus) => Promise<void>;
  loading?: boolean;
}

const STATUS_FLOW: Record<string, OrderStatus[]> = {
  pending: ["process"],
  process: ["printing"],
  printing: ["packed"],
  packed: ["shipment"],
  shipment: ["delivery"],
  pickup_scheduled: ["delivery"],
  delivery: [],
  cancelled: [],
  refunded: [],
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  process: "Processing",
  printing: "Printing",
  packed: "Packed",
  shipment: "Shipped",
  pickup_scheduled: "Pickup Scheduled",
  delivery: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderStatusForm({
  currentStatus,
  onChange,
  loading = false,
}: Props) {
  const nextStatuses = STATUS_FLOW[currentStatus] ?? [];
  const [selected, setSelected] = useState<OrderStatus | "">("");
  const [updating, setUpdating] = useState(false);

  if (
    currentStatus === "delivery" ||
    currentStatus === "cancelled" ||
    currentStatus === "refunded"
  ) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
        No actions
      </span>
    );
  }

  if (nextStatuses.length === 0) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
        No transitions
      </span>
    );
  }

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      setUpdating(true);
      await onChange(selected as OrderStatus);
      setSelected("");
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const isLoading = loading || updating;

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as OrderStatus)}
        disabled={isLoading}
        className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4863]/20 focus:border-[#2d4863] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">Move to…</option>
        {nextStatuses.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status] ?? status}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={!selected || isLoading}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
          ${
            !selected || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-[#D73D32] hover:bg-[#b83229] text-white shadow-sm hover:shadow-md cursor-pointer border border-[#D73D32]"
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            Updating…
          </>
        ) : (
          "Update"
        )}
      </button>
    </div>
  );
}