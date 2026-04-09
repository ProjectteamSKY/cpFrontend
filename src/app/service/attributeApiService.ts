import api from "./api";
import { Attribute, AttributeFormData } from "../types/attribute";

const mapAttribute = (data: any): Attribute => ({
  id: data.id,
  name: data.name,
  description: data.description ?? "",
  is_active: Boolean(data.is_active),
  created_at: data.created_at ?? null,
  updated_at: data.updated_at ?? null,
});

/* ---------- GET ---------- */
export const getAllAttributes = async (): Promise<Attribute[]> => {
  const res = await api.get("/attribute/list");
  return (res.data.data || []).map(mapAttribute);
};

/* ---------- CREATE ---------- */
export const createAttribute = async (payload: AttributeFormData) => {
  await api.post("/attribute/create", payload);
};

/* ---------- UPDATE ---------- */
export const updateAttribute = async (id: string, payload: AttributeFormData) => {
  await api.put(`/attribute/${id}`, payload);
};

/* ---------- DELETE ---------- */
export const deleteAttribute = async (id: string) => {
  await api.delete(`/attribute/${id}`);
};

/* ---------- TOGGLE ---------- */
export const activateAttribute = async (id: string) => {
  await api.put(`/attribute/${id}/activate`);
};

export const deactivateAttribute = async (id: string) => {
  await api.put(`/attribute/${id}/deactivate`);
};