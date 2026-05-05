// service/designApiService.ts

import axios from "axios";
import { DesignRequest, DesignFormData, DesignUpdatePayload } from "../types/design";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Get all design requests
export async function getAllDesignRequests(): Promise<DesignRequest[]> {
    try {
        const response = await apiClient.get("/design_request/list");
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching design requests: - Designapiservice.ts:21", error);
        throw error;
    }
}

// Get single design request
export async function getDesignRequest(id: string): Promise<DesignRequest> {
    try {
        const response = await apiClient.get(`/design_request/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching design request: - Designapiservice.ts:32", error);
        throw error;
    }
}

// Create design request
export async function createDesignRequest(data: DesignFormData): Promise<DesignRequest> {
    try {
        const formData = new FormData();

        // Append text fields
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("product_id", data.product_id);
        formData.append("design_notes", data.design_notes || "");
        formData.append("design_price", String(data.design_price || 0));

        // Append logo images
        if (data.logo_images && data.logo_images.length > 0) {
            data.logo_images.forEach((file, index) => {
                formData.append(`logo_images[${index}]`, file);
            });
        }

        const response = await apiClient.post("/design_request/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    } catch (error) {
        console.error("Error creating design request: - Designapiservice.ts:65", error);
        throw error;
    }
}

// Update design request
export async function editDesignRequest(id: string, data: DesignFormData) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("product_id", data.product_id);
    formData.append("design_notes", data.design_notes || "");
    formData.append("design_price", String(data.design_price || 0));

    // Logo images
    if (data.logo_images?.length) {
        data.logo_images.forEach(file => formData.append("logo_files", file));
    }

    // Designed images
    if (data.designed_images?.length) {
        data.designed_images.forEach(file => formData.append("designed_files", file));
    }

    const response = await apiClient.post(`/design_request/${id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
}

// Upload designed files
export async function uploadDesignFiles(
    id: string,
    files: File[]
): Promise<DesignRequest> {
    try {
        const formData = new FormData();

        // Append designed images
        files.forEach((file, index) => {
            formData.append(`designed_images[${index}]`, file);
        });

        const response = await apiClient.post(
            `/design_request/${id}/upload-designs`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error("Error uploading design files: - Designapiservice.ts:122", error);
        throw error;
    }
}

// Delete design request
export async function deleteDesignRequest(id: string): Promise<void> {
    try {
        await apiClient.delete(`/design_request/${id}/delete`);
    } catch (error) {
        console.error("Error deleting design request: - Designapiservice.ts:132", error);
        throw error;
    }
}

// Approve design request
export async function approveDesignRequest(id: string): Promise<DesignRequest> {
    try {
        const response = await apiClient.post(`/design_request/${id}/approve`, {});
        return response.data.data;
    } catch (error) {
        console.error("Error approving design request: - Designapiservice.ts:143", error);
        throw error;
    }
}

// Reject design request
export async function rejectDesignRequest(id: string): Promise<DesignRequest> {
    try {
        const response = await apiClient.post(`/design_request/${id}/reject`, {});
        return response.data.data;
    } catch (error) {
        console.error("Error rejecting design request: - Designapiservice.ts:154", error);
        throw error;
    }
}

// Update design status
export async function updateDesignStatus(
    id: string,
    status: "NEW" | "IN_PROGRESS" | "DESIGN_COMPLETED" | "REJECTED"
): Promise<DesignRequest> {
    try {
        const response = await apiClient.post(`/design_request/${id}/status`, {
            status,
        });
        return response.data.data;
    } catch (error) {
        console.error("Error updating design status: - Designapiservice.ts:170", error);
        throw error;
    }
}