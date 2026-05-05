// types/shiprocket.ts

export interface PickupLocation {
  id: number;
  pickup_location: string;
  address_type: string;
  address: string;
  address_2: string;
  updated_address: boolean;
  old_address: string;
  old_address2: string;
  tag: string;
  tag_value: string;
  instruction: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  email: string;
  is_first_mile_pickup: number;
  phone: string;
  name: string;
  company_id: number;
  gstin: string | null;
  vendor_name: string | null;
  status: number;
  phone_verified: number;
  lat: string;
  long: string;
  open_time: string;
  close_time: string;
  warehouse_code: string | null;
  alternate_phone: string;
  rto_address_id: number;
  lat_long_status: number;
  new: number;
  associated_rto_address: string | null;
  is_primary_location: number;
  send_pickup_rto_updates: boolean;
}

export interface PickupLocationsResponse {
  status: string;
  pickup_locations: {
    shipping_address: PickupLocation[];
    allow_more: string;
    is_blackbox_seller: boolean;
    company_name: string;
    recent_addresses: any[];
  };
}

export interface WalletBalanceResponse {
  status: string;
  wallet_balance: number;
}