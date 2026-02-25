import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import React, { useState } from "react";

interface Props {
  uploadedFile: File | null;
  uploadedPreview: string | null;
  uploadError: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const UploadDesignCard = ({
  uploadedFile,
  uploadedPreview,
  uploadError,
  onUpload,
  onRemove
}: Props) => {

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onUpload(fakeEvent);
    }
  };

  return (
    <Card
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 
        ${
          isDragging
            ? "border-[#D73D32] bg-red-50"
            : "border-gray-300 hover:border-[#D73D32]"
        }`}
    >
      <div className="text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#D73D32]/10 p-4 rounded-full">
            <Upload className="w-8 h-8 text-[#D73D32]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xl mb-2">
          Upload Your Design
        </h3>

        <p className="text-sm text-gray-500 mb-6">
          Drag & drop your file here or click below  
          <br />
          <span className="text-xs">
            JPG, PNG, PDF — Max 10MB
          </span>
        </p>

        {/* Hidden Input */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={onUpload}
          className="hidden"
          id="design-upload"
        />

        {/* Button */}
        <Label
          htmlFor="design-upload"
          className="inline-flex items-center gap-2 bg-[#D73D32] text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-[#B83227] transition-all shadow-lg hover:shadow-xl"
        >
          <Upload className="w-4 h-4" />
          Choose File
        </Label>

        {/* Error */}
        {uploadError && (
          <p className="text-red-500 text-sm mt-4">{uploadError}</p>
        )}

        {/* File Preview Section */}
        {uploadedFile && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4 shadow-inner">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                {uploadedFile.type.includes("image") ? (
                  <ImageIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <FileText className="w-6 h-6 text-blue-600" />
                )}

                <div className="text-left">
                  <p className="font-medium text-green-600">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {uploadedPreview && uploadedFile.type.includes("image") && (
              <img
                src={uploadedPreview}
                alt="Preview"
                className="mt-4 mx-auto max-h-48 rounded-xl shadow-lg object-contain"
              />
            )}
          </div>
        )}

      </div>
    </Card>
  );
};