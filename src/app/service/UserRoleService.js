import axios from "axios";
// import { API_BASE_URL } from "../config/apiConfig";

export const assignRoleToUser = async (userId, roleId, assignedBy = null) => {

  const API_BASE_URL = 'https://api.citizenprintz.in/api';
  
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("role_id", roleId);
  if (assignedBy) formData.append("assigned_by", assignedBy);

  const response = await axios.post(`${API_BASE_URL}/user-roles/assign`, formData);
  return response.data;
};

export const UserRoleslist = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user_role/list`);
        if (!response.ok) throw new Error('Failed to fetch user roles');

        const data = await response.json();
        return data.roles || data.data || [];
    } catch (error) {
        console.error('Error fetching user roles:  UserRolePermissionService.js:133 - UserRoleService.js:25', error);
        return [];
    }
};