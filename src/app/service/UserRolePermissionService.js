// UserRolePermissionService.js
// import { API_BASE_URL } from '../config/apiConfig';

const API_BASE_URL = 'http://54.206.3.97/api';

// create role
export const createRole = async (roleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/role/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: roleData.name,
                description: roleData.description
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create role');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

// Add delete role function
export const deleteRole = async (roleId) => {
    try {
        const formData = new URLSearchParams();
        formData.append('role_id', roleId);

        const response = await fetch(`${API_BASE_URL}/role/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete role');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting role: - UserRolePermissionService.js:57', error);
        throw error;
    }
};

export const fetchRoles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/role/list`);
        if (!response.ok) throw new Error('Failed to fetch roles');

        const res = await response.json();
        return res.roles || []; // FIX
    } catch (error) {
        console.error('Error fetching roles: - UserRolePermissionService.js:70', error);
        return [];
    }
};

// Fetch Users
export const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`);
        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        return data; // Returns the array of users directly
    } catch (error) {
        console.error('Error fetching users: - UserRolePermissionService.js:84', error);
        return [];
    }
};

// Assign Role to User
export const assignRoleToUser = async (assignmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user_role/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignmentData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to assign role to user');
        }

        return await response.json();
    } catch (error) {
        console.error('Error assigning role to user: - UserRolePermissionService.js:107', error);
        throw error;
    }
};

// Get User Roles
export const getUserRoles = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user_role/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user roles');

        const data = await response.json();
        return data.roles || data.data || [];
    } catch (error) {
        console.error('Error fetching user roles: - UserRolePermissionService.js:121', error);
        return [];
    }
};

// Remove User Role
export const removeUserRole = async (userRoleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user_role/${userRoleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to remove user role');
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing user role: - UserRolePermissionService.js:143', error);
        throw error;
    }
};

// RESOURCES
export const fetchResources = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/resource/list`);
        if (!response.ok) throw new Error('Failed to fetch resources');

        const res = await response.json();
        return res.resources || []; // ✅ FIX
    } catch (error) {
        console.error('Error fetching resources: - UserRolePermissionService.js:157', error);
        return [];
    }
};

// PERMISSIONS
export const fetchPermissions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/permission/list`);
        if (!response.ok) throw new Error('Failed to fetch permissions');

        const res = await response.json();
        return res.permissions || []; // ✅ FIX
    } catch (error) {
        console.error('Error fetching permissions: - UserRolePermissionService.js:171', error);
        return [];
    }
};

// ROLE PERMISSIONS
export const fetchRolePermissions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/role_permission/list`);
        if (!response.ok) throw new Error('Failed to fetch role permissions');

        const res = await response.json();
        return res.role_permissions || []; // ✅ FIX (snake_case)
    } catch (error) {
        console.error('Error fetching role permissions: - UserRolePermissionService.js:185', error);
        return [];
    }
};

export const assignPermission = async (roleId, permissionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/role_permission/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role_id: roleId,
                permission_id: permissionId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to assign permission');
        }
        return await response.json();
    } catch (error) {
        console.error('Error assigning permission: - UserRolePermissionService.js:208', error);
        throw error;
    }
};

export const removePermission = async (roleId, permissionId) => {
    try {
        const formData = new URLSearchParams();
        formData.append('role_id', roleId);
        formData.append('permission_id', permissionId);

        const response = await fetch(`${API_BASE_URL}/role-permissions/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error('Failed to remove permission');
        }
        return await response.json();
    } catch (error) {
        console.error('Error removing permission: - UserRolePermissionService.js:232', error);
        throw error;
    }
};

export const createResource = async (resourceData) => {
    try {
        const formData = new URLSearchParams();
        formData.append('name', resourceData.name);
        if (resourceData.description) {
            formData.append('description', resourceData.description);
        }

        const response = await fetch(`${API_BASE_URL}/resources/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create resource');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating resource: - UserRolePermissionService.js:260', error);
        throw error;
    }
};

export const deleteResource = async (resourceId) => {
    try {
        // Use the correct endpoint with resource_id in the URL path
        const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Usually for DELETE with path params, you don't need form data
            },
            // No body needed since resource_id is in the URL
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete resource (Status: ${response.status})`);
        }

        // Some APIs return 204 No Content with no body
        if (response.status === 204) {
            return { success: true };
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting resource: - UserRolePermissionService.js:288', error);
        throw error;
    }
};

// Permission APIs
export const createPermission = async (permissionData) => {
    try {
        const formData = new URLSearchParams();
        formData.append('resource_id', permissionData.resource_id);
        formData.append('action', permissionData.action);
        formData.append('method', permissionData.method);
        formData.append('path', permissionData.path);
        if (permissionData.description) {
            formData.append('description', permissionData.description);
        }
        const response = await fetch(`${API_BASE_URL}/permission/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Usually for DELETE with path params, you don't need form data
            },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create permission');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating permission: - UserRolePermissionService.js:319', error);
        throw error;
    }
};

export const deletePermission = async (permissionId) => {
    try {
        const formData = new URLSearchParams();
        formData.append('permission_id', permissionId);

        const response = await fetch(`${API_BASE_URL}/permissions/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete permission');
        }

        return await response.json().then(res => res.data || {});
    } catch (error) {
        console.error('Error deleting permission: - UserRolePermissionService.js:344', error);
        throw error;
    }
};
