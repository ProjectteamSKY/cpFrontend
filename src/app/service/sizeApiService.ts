// services/sizeApiService.ts
import { Size, SizeFormData } from "../types/size";
import api from "./api";

/* =========================================================
   Mapper: API → UI
========================================================= */
export const mapSizeFromApi = (s: any): Size => ({
  id: s.id,
  name: s.name,
  width: Number(s.width),
  height: Number(s.height),
  unit: s.unit ?? "mm",
  description: s.description ?? "",
  is_active: Boolean(s.is_active),
  created_at: s.created_at ?? null,
  updated_at: s.updated_at ?? null,
});

/* =========================================================
   Mapper: UI → API (FormData for FastAPI Form(...))
========================================================= */
export const mapSizeToFormData = (data: SizeFormData): FormData => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("width", String(data.width));
  form.append("height", String(data.height));
  form.append("unit", data.unit ?? "mm");
  if (data.description) form.append("description", data.description);
  if (data.is_active !== undefined) form.append("is_active", data.is_active ? "true" : "false");
  return form;
};

/* =========================================================
   Get All Sizes
========================================================= */
export const getAllSizes = async (): Promise<Size[]> => {
  const res = await api.get("/size/list");
  return (res.data.sizes || []).map(mapSizeFromApi);
};

/* =========================================================
   Create Size
========================================================= */
export const createSize = async (payload: SizeFormData): Promise<void> => {
  const body = mapSizeToFormData(payload);
  await api.post("/size/create", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =========================================================
   Update Size
========================================================= */
export const updateSize = async (id: string, payload: SizeFormData): Promise<void> => {
  const body = mapSizeToFormData(payload);
  await api.put(`/size/${id}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =========================================================
   Delete Size
========================================================= */
export const deleteSize = async (id: string): Promise<void> => {
  await api.delete(`/size/${id}`);
};

/* =========================================================
   Activate Size
========================================================= */
export const activateSize = async (id: string): Promise<void> => {
  await api.put(`/size/${id}/activate`);
};