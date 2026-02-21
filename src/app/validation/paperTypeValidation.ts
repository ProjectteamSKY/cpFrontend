import { RegisterOptions } from "react-hook-form";
import { PaperTypeFormData } from "../types/paperType";

type PaperTypeValidationType = {
  name: RegisterOptions<PaperTypeFormData, "name">;
  description: RegisterOptions<PaperTypeFormData, "description">;
  is_active: RegisterOptions<PaperTypeFormData, "is_active">;
};

export const paperTypeValidation: PaperTypeValidationType = {
  name: {
    required: "Paper type name is required",
    minLength: {
      value: 3,
      message: "Paper type name must be at least 3 characters",
    },
    maxLength: {
      value: 50,
      message: "Paper type name cannot exceed 50 characters",
    },
  },
  description: {
    maxLength: {
      value: 200,
      message: "Description cannot exceed 200 characters",
    },
  },
  is_active: {},
};