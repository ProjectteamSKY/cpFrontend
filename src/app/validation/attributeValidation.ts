import { RegisterOptions } from "react-hook-form";
import { AttributeFormData } from "../types/attribute";

export const attributeValidation: {
  name: RegisterOptions<AttributeFormData, "name">;
  description: RegisterOptions<AttributeFormData, "description">;
} = {
  name: {
    required: "Attribute name is required",
    minLength: {
      value: 2,
      message: "Minimum 2 characters required",
    },
    maxLength: {
      value: 50,
      message: "Maximum 50 characters allowed",
    },
    validate: {
      notEmpty: (value: string) =>
        value.trim() !== "" || "Attribute name cannot be empty",
      noLeadingSpaces: (value: string) =>
        !value.startsWith(" ") || "No leading spaces allowed",
      validChars: (value: string) =>
        /^[a-zA-Z0-9\s&()-]*$/.test(value) ||
        "Only letters, numbers & basic symbols allowed",
    },
  },

  description: {
    required: "Description is required",
    maxLength: {
      value: 200,
      message: "Maximum 200 characters allowed",
    },
    validate: {
      noExtraSpaces: (value: string) =>
        !/\s{2,}/.test(value) || "Remove extra spaces",
    },
  },
};