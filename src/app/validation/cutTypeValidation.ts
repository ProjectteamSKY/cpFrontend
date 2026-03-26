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
    validate: (value) =>
      !!value?.trim() || "Name cannot be empty",
  },

  // ✅ REQUIRED ADDED
  description: {
    required: "Description is required",
    maxLength: {
      value: 200,
      message: "Cannot exceed 200 characters",
    },
    validate: (value) =>
      !!value?.trim() || "Description cannot be empty",
  },
};