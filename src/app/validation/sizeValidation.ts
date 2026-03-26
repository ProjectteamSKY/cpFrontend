import { RegisterOptions } from "react-hook-form";
import { SizeFormData } from "../types/size";

type SizeValidationType = {
  name: RegisterOptions<SizeFormData, "name">;
  width: RegisterOptions<SizeFormData, "width">;
  height: RegisterOptions<SizeFormData, "height">;
  unit: RegisterOptions<SizeFormData, "unit">;
  description: RegisterOptions<SizeFormData, "description">;
  is_active: RegisterOptions<SizeFormData, "is_active">;
};

export const sizeValidation: SizeValidationType = {
  name: {
    required: "Size name is required",
    minLength: { value: 1, message: "Name cannot be empty" },
    maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
    validate: (value) =>
      !!value?.trim() || "Name cannot be empty",
  },

  width: {
    required: "Width is required",
    min: { value: 0.1, message: "Width must be positive" },
  },

  height: {
    required: "Height is required",
    min: { value: 0.1, message: "Height must be positive" },
  },

  unit: {
    required: "Unit is required",
    validate: (value) =>
      !!value?.trim() || "Unit cannot be empty",
  },

  description: {
    required: "Description is required",
    maxLength: {
      value: 200,
      message: "Description cannot exceed 200 characters",
    },
    validate: (value) =>
      !!value?.trim() || "Description cannot be empty",
  },

  is_active: {},
};