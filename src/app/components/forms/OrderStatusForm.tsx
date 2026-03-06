import { useState } from "react";
import { OrderStatus } from "../../types/order";
import { Button } from "../ui/button";

interface Props {
  currentStatus: OrderStatus;
  onChange: (status: OrderStatus) => Promise<void>;
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
}: Props) {
  const nextStatuses = STATUS_FLOW[currentStatus];
  const [selected, setSelected] = useState<OrderStatus | "">("");

  if (currentStatus === "delivery") {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        Completed
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
      >
        <option value="">Select status</option>
        {nextStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <Button
        size="sm"
        disabled={!selected}
        className="bg-[#D73D32] text-white"
        onClick={async () => {
          if (!selected) return;
          await onChange(selected);
          setSelected("");
        }}
      >
        Update
      </Button>
    </div>
  );
}