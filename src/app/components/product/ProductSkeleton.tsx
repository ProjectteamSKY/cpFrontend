import React from "react";
import { Card } from "../ui/card";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border-0 animate-pulse">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2 mb-4"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};