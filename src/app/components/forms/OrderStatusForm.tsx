import { useState } from "react";
import { OrderStatus } from "../../types/order";
import { Button } from "../ui/button";

interface Props {
  currentStatus: OrderStatus;
  onChange: (status: OrderStatus) => Promise<void>;
  loading?: boolean;
}

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["process"],
  process: ["printing"],
  printing: ["packed"],
  packed: ["shipment"],
  shipment: ["delivery"],
  delivery: [],
  cancelled: [],
  refunded: [],
};

export function OrderStatusForm({
  currentStatus,
  onChange,
  loading = false,
}: Props) {
  // ✅ SAFE fallback (prevents crash)
  const nextStatuses = STATUS_FLOW[currentStatus] ?? [];

  const [selected, setSelected] = useState<OrderStatus | "">("");

  // ✅ Completed / Locked states
  if (
    currentStatus === "delivery" ||
    currentStatus === "cancelled" ||
    currentStatus === "refunded"
  ) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
        No actions
      </span>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={selected}
        onChange={(e) =>
          setSelected(e.target.value as OrderStatus)
        }
        className="border rounded-md px-3 py-1 text-sm"
        disabled={loading || nextStatuses.length === 0}
      >
        <option value="">Select status</option>

        {nextStatuses.length === 0 ? (
          <option disabled>No transitions</option>
        ) : (
          nextStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))
        )}
      </select>

      <Button
        size="sm"
        disabled={!selected || loading}
        className="bg-[#D73D32] text-white disabled:opacity-50"
        onClick={async () => {
          if (!selected) return;

          try {
            await onChange(selected);
            setSelected(""); // reset after success
          } catch (err) {
            console.error("Status update failed:", err);
          }
        }}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}