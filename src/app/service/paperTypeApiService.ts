import { PaperType, PaperTypeFormData } from "../types/paperType";
import api from "./api";

// Convert object to FormData
const toFormData = (data: PaperTypeFormData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  formData.append("is_active", String(data.is_active)); // must be string for FormData
  return formData;
};

const mapPaperTypeFromApi = (pt: any): PaperType => ({
  id: pt.id,
  name: pt.name,
  description: pt.description ?? "",
  is_active: Boolean(pt.is_active),
  created_at: pt.created_at ?? null,
  updated_at: pt.updated_at ?? null,
});

export const getAllPaperTypes = async (): Promise<PaperType[]> => {
  const res = await api.get("/paper_type/list");
  return (res.data.paper_types || []).map(mapPaperTypeFromApi);
};

export const createPaperType = async (payload: PaperTypeFormData): Promise<void> => {
  const formData = toFormData(payload);
  await api.post("/paper_type/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePaperType = async (id: string, payload: PaperTypeFormData): Promise<void> => {
  const formData = toFormData(payload);
  await api.put(`/paper_type/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePaperType = async (id: string): Promise<void> => {
  await api.delete(`paper_type/${id}`);
};

export const activatePaperType = async (id: string): Promise<void> => {
  await api.put(`/paper_type/${id}/activate`);
};

export const deactivatePaperType = async (id: string): Promise<void> => {
  await api.put(`/paper-type/${id}/deactivate`);
};