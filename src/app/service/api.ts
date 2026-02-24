import axios from "axios";
import { API_BASE } from "../../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export default api;