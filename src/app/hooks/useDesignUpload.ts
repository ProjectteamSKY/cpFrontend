import { useState } from "react";

export const useDesignUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB.");
      return;
    }

    setUploadError(null);
    setUploadedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedPreview(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
  };

  return {
    uploadedFile,
    uploadedPreview,
    uploadError,
    handleFileUpload,
    removeFile,
  };
};