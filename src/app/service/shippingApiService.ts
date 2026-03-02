import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/shipping";

// ✅ Create Shipment (Shiprocket Order)
export const createShiprocketOrder = async (
  orderId: string
) => {
  const res = await axios.post(
    `${API_BASE_URL}/create-order/${orderId}`
  );
  return res.data;
};

// ✅ Get Available Couriers
export const getAvailableCouriers = async (
  orderId: string
) => {
  const res = await axios.get(
    `${API_BASE_URL}/couriers/${orderId}`
  );
  return res.data.couriers; // important
};

// ✅ Assign Courier (Generate AWB)
export const generateAWB = async (
  orderId: string,
  courierId: number
) => {
  const res = await axios.post(
    `${API_BASE_URL}/assign-courier/${orderId}`,
    { courier_id: courierId }
  );
  return res.data;
};

// ✅ Download Label
export const downloadLabel = (orderId: string) => {
  window.open(
    `${API_BASE_URL}/label/${orderId}`,
    "_blank"
  );
};