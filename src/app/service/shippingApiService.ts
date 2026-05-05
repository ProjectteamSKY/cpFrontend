import axios from "axios";
import api from "./api";

const API_BASE_URL = "http://127.0.0.1:8000/api/shipping";

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
export const downloadLabel = async (orderId: string) => {
  const res = await api.get(`/shipping/label/${orderId}`);

  const url = res.data?.label_url;

  if (!url) return;

  const link = document.createElement("a");
  link.href = url;
  link.download = `label-${orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handlePrintLabel = (labelUrl: string) => {
  const printWindow = window.open(labelUrl, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const cancelOrder = async (orderId: string) => {
  const res = await api.post(`/shipping/cancel-order/${orderId}`);
  return res.data;
};

export const refundOrder = async (orderId: string) => {
  const res = await api.post(`/shipping/refund-order/${orderId}`);
  return res.data;
};


export const getPickupLocations = async () => {
  const response = await api.get('/shipping/pickup-locations');
  return response.data;
};  

// Get wallet balance
export const getWalletBalance = async () => {
  const response = await api.get('/shipping/wallet-balance');
  return response.data;
};