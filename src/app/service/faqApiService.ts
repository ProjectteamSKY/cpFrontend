import axios from "axios";

const API = "https://api.citizenprintz.in/api/faq";

export const getAllFAQs = async () => {
  const res = await axios.get(`${API}/list`);
  return res.data.data;
};

export const createFAQ = async (data: any) => {
  await axios.post(`${API}/create`, data);
};

export const updateFAQ = async (id: string, data: any) => {
  await axios.put(`${API}/${id}`, data);
};

export const deleteFAQ = async (id: string) => {
  await axios.delete(`${API}/${id}`);
};

export const toggleFAQStatus = async (id: string) => {  
  await axios.patch(`${API}/${id}`);
};