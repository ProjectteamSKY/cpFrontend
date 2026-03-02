import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import React, { useState } from "react";

interface Props {
  sides: string; // 1 or 2
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
  onUploadFront: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFront: () => void;
  onRemoveBack: () => void;
}

export const UploadDesignCard = ({
  sides,
  frontFile,
  backFile,
  frontPreview,
  backPreview,
  onUploadFront,
  onUploadBack,
  onRemoveFront,
  onRemoveBack
}: Props) => {
  return (
    <Card className="p-8 rounded-2xl border-2 border-dashed border-gray-300">

      <h3 className="text-xl font-semibold mb-6">
        Upload Your Design
      </h3>

      {/* ================= FRONT SIDE ================= */}
      <div className="mb-8">
        <Label className="font-medium mb-2 block">
          Front Side Design *
        </Label>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={onUploadFront}
          className="hidden"
          id="front-upload"
        />

        <Label
          htmlFor="front-upload"
          className="inline-flex items-center gap-2 bg-[#D73D32] text-white px-5 py-2 rounded-lg cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Upload Front
        </Label>

        {frontFile && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-sm">{frontFile.name}</span>
            <button onClick={onRemoveFront}>
              <X size={16} className="text-red-500" />
            </button>
          </div>
        )}

        {frontPreview && frontFile?.type.includes("image") && (
          <img
            src={frontPreview}
            alt="Front Preview"
            className="mt-3 max-h-40 rounded-lg"
          />
        )}
      </div>

      {/* ================= BACK SIDE (ONLY IF DOUBLE) ================= */}
      {sides === "2" && (
        <div>
          <Label className="font-medium mb-2 block">
            Back Side Design *
          </Label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={onUploadBack}
            className="hidden"
            id="back-upload"
          />

          <Label
            htmlFor="back-upload"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Back
          </Label>

          {backFile && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm">{backFile.name}</span>
              <button onClick={onRemoveBack}>
                <X size={16} className="text-red-500" />
              </button>
            </div>
          )}

          {backPreview && backFile?.type.includes("image") && (
            <img
              src={backPreview}
              alt="Back Preview"
              className="mt-3 max-h-40 rounded-lg"
            />
          )}
        </div>
      )}
    </Card>
  );
};