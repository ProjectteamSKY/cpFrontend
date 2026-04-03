// validation/designValidation.ts

export const designValidation = {
  name: {
    required: "Client name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters long",
    },
    maxLength: {
      value: 100,
      message: "Name must not exceed 100 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  phone: {
    required: "Phone number is required",
    minLength: {
      value: 10,
      message: "Phone number must be at least 10 digits",
    },
    maxLength: {
      value: 15,
      message: "Phone number must not exceed 15 digits",
    },
    pattern: {
      value: /^[0-9\s+\-()]*$/,
      message: "Phone number can only contain numbers, spaces, +, -, and ()",
    },
  },
  product_id: {
    required: "Product selection is required",
  },
  design_notes: {
    maxLength: {
      value: 2000,
      message: "Design notes must not exceed 2000 characters",
    },
  },
  design_price: {
    min: {
      value: 0,
      message: "Design price cannot be negative",
    },
    validate: (value: any) => {
      if (value && isNaN(value)) {
        return "Design price must be a number";
      }
      return true;
    },
  },
};