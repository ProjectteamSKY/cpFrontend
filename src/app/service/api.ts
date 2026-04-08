import axios from "axios";
import { API_BASE } from "../../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Add a request interceptor to include token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;