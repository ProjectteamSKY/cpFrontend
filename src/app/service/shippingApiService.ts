import axios from "axios";
import api from "./api";

const API_BASE_URL = "https://api.citizenprintz.in/api/shipping";

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


// Add this function to your existing shippingApiService.ts file

// Download Manifest Label
export const downloadManifestLabel = async (orderId: string): Promise<void> => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/manifest-label`,
      { params: { order_id: orderId } }
    );

    // Check if response is a PDF or ZIP file
    const contentType = response.headers['content-type'];
    const disposition = response.headers['content-disposition'];
    
    let filename = `manifest_${orderId}.pdf`;
    
    // Try to extract filename from content-disposition header
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Create blob URL and trigger download
    const blob = new Blob([response.data], { 
      type: contentType || 'application/pdf' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error: any) {
    console.error("Download manifest label error: - shippingApiService.ts:126", error);
    
    // If error response is blob, try to parse error message
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || "Failed to download manifest label");
    }
    
    throw new Error(error.response?.data?.message || "Failed to download manifest label");
  }
};


// Add this to your shippingApiService.ts file

export const generateInvoice = async (orderId: string): Promise<void> => {
  try {
    // Make API call to generate invoice
    const response = await axios.get(`/shipping/invoice/${orderId}`, {
      responseType: 'blob', // Important for file download
    });

    // Create a blob from the response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${orderId}.pdf`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return Promise.resolve();
  } catch (error: any) {
    console.error('Error generating invoice: - shippingApiService.ts:168', error);
    throw new Error(error.response?.data?.message || 'Failed to generate invoice');
  }
};

export const generatePickup = async (orderId: string) => {
  try {
    const response = await api.post(`/shipping/generate-pickup/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};