// services/printTypeApiService.ts
import { PrintType, PrintTypeFormData } from "../types/printType";
import api from "./api";

/* =========================================================
   Mapper: API → UI
========================================================= */
export const mapPrintTypeFromApi = (pt: any): PrintType => ({
  id: pt.id,
  name: pt.name,
  description: pt.description ?? "",
  is_active: Boolean(pt.is_active),
  created_at: pt.created_at ?? null,
  updated_at: pt.updated_at ?? null,
});

/* =========================================================
   Mapper: UI → API (FormData for FastAPI Form(...))
========================================================= */
export const mapPrintTypeToFormData = (data: PrintTypeFormData): FormData => {
  const form = new FormData();
  form.append("name", data.name);
  if (data.description) form.append("description", data.description);
  form.append("is_active", data.is_active ? "true" : "false"); // must be string for FastAPI
  return form;
};

/* =========================================================
   Get All PrintTypes
========================================================= */
export const getAllPrintTypes = async (): Promise<PrintType[]> => {
  const res = await api.get("/print_type/list");
  return (res.data.print_types || []).map(mapPrintTypeFromApi);
};

/* =========================================================
   Create PrintType
========================================================= */
export const createPrintType = async (payload: PrintTypeFormData): Promise<void> => {
  const body = mapPrintTypeToFormData(payload);
  await api.post("/print_type/create", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =========================================================
   Update PrintType
========================================================= */
export const updatePrintType = async (id: string, payload: PrintTypeFormData): Promise<void> => {
  const body = mapPrintTypeToFormData(payload);
  await api.put(`/print_type/${id}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =========================================================
   Delete PrintType
========================================================= */
export const deletePrintType = async (id: string): Promise<void> => {
  await api.delete(`/print_type/${id}`);
};

/* =========================================================
   Activate PrintType
========================================================= */
export const activatePrintType = async (id: string): Promise<void> => {
  await api.put(`/print_type/${id}/activate`);
};

/* =========================================================
   Deactivate PrintType
========================================================= */
export const deactivatePrintType = async (id: string): Promise<void> => {
  await api.put(`/print_type/${id}/deactivate`);
};