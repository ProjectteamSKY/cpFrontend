import { RegisterOptions } from "react-hook-form";
import { PaperTypeFormData } from "../types/paperType";

export const paperTypeValidation: {
  name: RegisterOptions<PaperTypeFormData, "name">;
  description: RegisterOptions<PaperTypeFormData, "description">;
} = {
  name: {
    required: "Paper Type Name is required", // ✅ This will trigger first
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
        (value && value.trim() !== "") || "Paper Type Name cannot be empty",
      noLeadingSpaces: (value: string) =>
        !value.startsWith(" ") || "Name cannot start with spaces",
      noSpecialChars: (value: string) =>
        /^[a-zA-Z0-9\s&()-]*$/.test(value) ||
        "Only letters, numbers, and basic symbols allowed",
    },
  },

  description: {
    required: "Description is required",
    maxLength: {
      value: 200,
      message: "Maximum 200 characters allowed",
    },
    validate: {
      noExcessiveSpaces: (value: string) =>
        !value || !/\s{2,}/.test(value) || "Remove extra spaces",
    },
  },
};