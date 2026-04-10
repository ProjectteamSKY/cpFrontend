import axios from "axios";
// import { API_BASE_URL } from "../config/apiConfig";

export const assignRoleToUser = async (userId, roleId, assignedBy = null) => {

  const API_BASE_URL = 'http://54.206.3.97/api';
  
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("role_id", roleId);
  if (assignedBy) formData.append("assigned_by", assignedBy);

  const response = await axios.post(`${API_BASE_URL}/user-roles/assign`, formData);
  return response.data;
};