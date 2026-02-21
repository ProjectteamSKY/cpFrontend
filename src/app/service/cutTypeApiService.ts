import { CutType, CutTypeFormData } from "../types/cutType";
import api from "./api";

/* Mapper: API → UI (convert number → boolean) */
const mapCutTypeFromApi = (ct: any): CutType => ({
  id: ct.id,
  name: ct.name,
  description: ct.description ?? "",
  is_active: Boolean(ct.is_active),
  created_at: ct.created_at ?? null,
  updated_at: ct.updated_at ?? null,
});

/* Mapper: UI → API (FormData for FastAPI Form) */
export const mapCutTypeToFormData = (data: CutTypeFormData): FormData => {
  const form = new FormData();
  form.append("name", data.name);
  if (data.description) form.append("description", data.description);

  // Must be string "true" or "false"
  form.append("is_active", data.is_active ? "true" : "false");

  return form;
};

/* Get all Cut Types */
export const getAllCutTypes = async (): Promise<CutType[]> => {
  const res = await api.get("/cut_type/list");
  return (res.data.cut_types || []).map(mapCutTypeFromApi);
};

/* Create Cut Type */
export const createCutType = async (payload: CutTypeFormData): Promise<void> => {
  const body = mapCutTypeToFormData(payload);
  await api.post("/cut_type/create", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* Update Cut Type */
export const updateCutType = async (
  id: string,
  payload: CutTypeFormData
): Promise<void> => {
  const body = mapCutTypeToFormData(payload);
  await api.put(`/cut_type/${id}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* Delete Cut Type */
export const deleteCutType = async (id: string): Promise<void> => {
  await api.delete(`/cut_type/${id}`);
};

/* Activate / Deactivate Cut Type */
export const activateCutType = async (id: string): Promise<void> => {
  await api.put(`/cut_type/${id}/activate`);
};

export const deactivateCutType = async (id: string): Promise<void> => {
  await api.put(`/cut_type/${id}/deactivate`);
};