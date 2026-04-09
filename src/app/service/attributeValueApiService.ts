import api from "./api";
import { AttributeValue, AttributeValueFormData } from "../types/attributeValue";

const mapData = (d: any): AttributeValue => ({
  id: d.id,
  attribute_id: d.attribute_id,
  value: d.value,
  is_active: Boolean(d.is_active),
  created_at: d.created_at ?? null,
  updated_at: d.updated_at ?? null,
  attribute_name: d.attribute_name ?? "",
});

/* ---------- GET ---------- */
export const getAllAttributeValues = async (): Promise<AttributeValue[]> => {
  const res = await api.get("/attribute_value/list");
  return (res.data.data || []).map(mapData);
};

export const getValuesByAttribute = async (attributeId: string) => {
  const res = await api.get(`/attribute_value/attribute/${attributeId}`);
  return (res.data.data || []).map(mapData);
};

/* ---------- CREATE ---------- */
export const createAttributeValue = async (payload: AttributeValueFormData) => {
  await api.post("/attribute_value/create", payload);
};

/* ---------- UPDATE ---------- */
export const updateAttributeValue = async (id: string, payload: AttributeValueFormData) => {
  await api.put(`/attribute_value/${id}`, payload);
};

/* ---------- DELETE ---------- */
export const deleteAttributeValue = async (id: string) => {
  await api.delete(`/attribute_value/${id}`);
};

/* ---------- TOGGLE ---------- */
export const activateAttributeValue = async (id: string) => {
  await api.put(`/attribute_value/${id}/activate`);
};

export const deactivateAttributeValue = async (id: string) => {
  await api.put(`/attribute_value/${id}/deactivate`);
};