import { RegisterOptions } from "react-hook-form";
import { CutTypeFormData } from "../types/cutType";

type CutTypeValidationType = {
  name: RegisterOptions<CutTypeFormData, "name">;
  description: RegisterOptions<CutTypeFormData, "description">;
};

export const cutTypeValidation: CutTypeValidationType = {
  name: {
    required: "Cut type name is required",
    minLength: { value: 3, message: "Must be at least 3 characters" },
    maxLength: { value: 50, message: "Cannot exceed 50 characters" },
  },
  description: {
    maxLength: { value: 200, message: "Cannot exceed 200 characters" },
  },
};