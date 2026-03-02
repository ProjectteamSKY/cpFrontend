// export type OrderStatus =
//   | "pending"
//   | "process"
//   | "printing"
//   | "packed"
//   | "shipment"
//   | "delivery";

// export interface OrderItem {
//   id: number;
//   product_id: string;
//   variant_id: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// export interface OrderUser {
//   id: string;
//   username: string;
//   email?: string | null;
//   phone?: string | null;
// }

// export interface OrderAddress {
//   address: string;
//   city?: string | null;
//   state?: string | null;
//   country?: string | null;
//   postal_code?: string | null;
//   phone?: string | null;
// }

// export interface Order {
//   id: string;
//   status: OrderStatus;
//   total_amount: number;
//   created_at: string;
//   updated_at: string;
//   user: OrderUser;
//   address?: OrderAddress | null;
//   items: OrderItem[];
// }


export type OrderStatus =
  | "pending"
  | "process"
  | "printing"
  | "packed"
  | "shipment"
  | "delivery";

export interface OrderItem {
  id: number;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderUser {
  id: string;
  username: string;
  email?: string | null;
  phone?: string | null;
}

export interface OrderAddress {
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  phone?: string | null;
}

/* ✅ ADD THIS */
export interface Shipment {
  id: string;
  courier_name: string;
  awb_code: string;
  tracking_url: string;
  current_status: string;
  created_at: string;
}

/* ✅ UPDATE ORDER */
export interface Order {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user: OrderUser;
  address?: OrderAddress | null;
  items: OrderItem[];

  shipment?: Shipment | null; // ✅ ADD THIS
}