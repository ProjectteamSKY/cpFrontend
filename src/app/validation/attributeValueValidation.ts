import { RegisterOptions } from "react-hook-form";
import { AttributeValueFormData } from "../types/attributeValue";

export const attributeValueValidation: {
  value: RegisterOptions<AttributeValueFormData, "value">;
} = {
  value: {
    required: "Value is required",
    minLength: {
      value: 1,
      message: "Value cannot be empty",
    },
    maxLength: {
      value: 50,
      message: "Maximum 50 characters allowed",
    },
    validate: {
      notEmpty: (v: string) =>
        v.trim() !== "" || "Value cannot be blank",
      noLeadingSpace: (v: string) =>
        !v.startsWith(" ") || "No leading space allowed",
    },
  },
};