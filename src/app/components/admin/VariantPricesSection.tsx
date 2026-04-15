

// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Form, InputNumber, Spin, Empty } from "antd";
// import { Variant, VariantPrice } from "../../types/productvarientsetup";
// import {
//   createVariantPrice,
//   getVariantPrices,
//   deleteVariantPrice,
// } from "../../service/productvarientsetupApiService";

// interface Props {
//   variant: Variant;
// }

// const VariantPricesSection: React.FC<Props> = ({ variant }) => {
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   const { data: prices = [], isLoading } = useQuery({
//     queryKey: ["variantPrices", variant.id],
//     queryFn: () => getVariantPrices(variant.id),
//   });

//   const pricesArray: VariantPrice[] = Array.isArray(prices) ? prices : [];

//   const addMutation = useMutation({
//     mutationFn: (payload: Partial<VariantPrice>) => createVariantPrice(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] });
//       form.resetFields();
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteVariantPrice(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] }),
//   });

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h4 className="text-base font-bold text-gray-900">Pricing Tiers</h4>
//         <span className="bg-[#D73D32] text-white text-xs font-bold px-3 py-1 rounded-full">
//           {pricesArray.length}
//         </span>
//       </div>

//       {/* Add Form */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200">
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={(vals) => addMutation.mutate({ ...vals, variant_id: variant.id })}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Form.Item
//               label="Min Qty"
//               name="min_qty"
//               rules={[{ required: true, message: "Required" }]}
//             >
//               <InputNumber
//                 min={1}
//                 placeholder="1"
//                 className="w-full"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Max Qty"
//               name="max_qty"
//             >
//               <InputNumber
//                 min={1}
//                 placeholder="Unlimited"
//                 className="w-full"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Price"
//               name="price"
//               rules={[{ required: true, message: "Required" }]}
//             >
//               <InputNumber
//                 min={0}
//                 precision={2}
//                 placeholder="0.00"
//                 className="w-full"
//               />
//             </Form.Item>
//           </div>

//           <button
//             type="submit"
//             disabled={addMutation.isLoading}
//             className="w-full mt-4 py-2 bg-[#D73D32] text-white font-semibold rounded-lg hover:bg-[#b8311e] disabled:opacity-50 transition-colors"
//           >
//             {addMutation.isLoading ? "Adding..." : "Add Tier"}
//           </button>
//         </Form>
//       </div>

//       {/* Prices Table */}
//       {isLoading ? (
//         <div className="flex justify-center items-center py-6">
//           <Spin tip="Loading..." />
//         </div>
//       ) : pricesArray.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
//           <p className="text-gray-500 text-sm">No pricing tiers set</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           {/* Table Header */}
//           <div className="hidden md:grid grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-sm text-gray-700">
//             <div>Quantity Range</div>
//             <div>Price</div>
//             <div className="text-right">Action</div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-gray-200">
//             {pricesArray.map((item) => (
//               <div
//                 key={item.id}
//                 className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors"
//               >
//                 {/* Quantity Range */}
//                 <div className="flex flex-col md:block">
//                   <span className="text-xs font-bold text-gray-600 md:hidden">Quantity Range</span>
//                   <div className="flex items-center gap-2 mt-1 md:mt-0">
//                     <span className="bg-red-100 text-[#D73D32] px-2 py-1 rounded text-sm font-bold">
//                       {item.min_qty}
//                     </span>
//                     {item.max_qty && (
//                       <>
//                         <span className="text-gray-500 text-sm">to</span>
//                         <span className="bg-red-100 text-[#D73D32] px-2 py-1 rounded text-sm font-bold">
//                           {item.max_qty}
//                         </span>
//                       </>
//                     )}
//                     {!item.max_qty && (
//                       <span className="text-gray-500 text-sm">+</span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="flex flex-col md:block">
//                   <span className="text-xs font-bold text-gray-600 md:hidden">Price</span>
//                   <div className="text-lg font-bold text-[#D73D32] mt-1 md:mt-0">
//                     ${item.price?.toFixed(2)}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => deleteMutation.mutate(item.id)}
//                     disabled={deleteMutation.isLoading}
//                     className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     title="Delete"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VariantPricesSection;


import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, InputNumber, Spin, Empty, Modal } from "antd";
import { Variant, VariantPrice } from "../../types/productvarientsetup";
import {
  createVariantPrice,
  getVariantPrices,
  deleteVariantPrice,
} from "../../service/productvarientsetupApiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "../ui/toaster";
interface Props {
  variant: Variant;
}


const VariantPricesSection: React.FC<Props> = ({ variant }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ["variantPrices", variant.id],
    queryFn: () => getVariantPrices(variant.id),
  });

  const pricesArray: VariantPrice[] = Array.isArray(prices) ? prices : [];

  const addMutation = useMutation({
    mutationFn: (payload: Partial<VariantPrice>) => createVariantPrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] });
      form.resetFields();
      toast.success(res?.message || "Price tier added");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariantPrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] });
      toast.success("Deleted successfully");
    },
  });

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D73D32]/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Pricing Tiers</h4>
              <p className="text-xs text-gray-500 mt-0.5">Manage bulk pricing for {variant.sku}</p>
            </div>
          </div>
          <div className="bg-[#D73D32]/10 px-3 py-1.5 rounded-full">
            <span className="text-[#D73D32] font-bold text-sm">{pricesArray.length}</span>
            <span className="text-[#D73D32]/70 text-xs ml-1">tiers</span>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div className="p-5 border-b border-gray-100">
        <Form
          form={form}
          layout="vertical"
          onFinish={(vals) => addMutation.mutate({ ...vals, variant_id: variant.id })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label={<span className="text-gray-700 font-medium text-sm">Min Qty <span className="text-red-500">*</span></span>}
              name="min_qty"
              rules={[{ required: true, message: "Required" }]}
              className="mb-0"
            >
              <InputNumber
                min={1}
                placeholder="1"
                className="w-full [&_.ant-input-number-input]:py-2 [&_.ant-input-number-input]:px-3"
                size="middle"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium text-sm">Max Qty <span className="text-gray-400 text-xs">(optional)</span></span>}
              name="max_qty"
              className="mb-0"
            >
              <InputNumber
                min={1}
                placeholder="Unlimited"
                className="w-full [&_.ant-input-number-input]:py-2 [&_.ant-input-number-input]:px-3"
                size="middle"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium text-sm">Price <span className="text-red-500">*</span></span>}
              name="price"
              rules={[{ required: true, message: "Required" }]}
              className="mb-0"
            >
              <InputNumber
                min={0}
                precision={2}
                placeholder="0.00"
                className="w-full [&_.ant-input-number-input]:py-2 [&_.ant-input-number-input]:px-3"
                size="middle"
                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
              />
            </Form.Item>
          </div>

          <button
            type="submit"
            disabled={addMutation.isLoading}
            className="w-full mt-2 py-2.5 bg-[#D73D32] text-white font-semibold rounded-lg hover:bg-[#c0342a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {addMutation.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Tier</span>
              </>
            )}
          </button>
        </Form>
      </div>

      {/* Prices Table */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Spin size="default" />
            <p className="mt-3 text-gray-500 text-sm">Loading pricing tiers...</p>
          </div>
        ) : pricesArray.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">No pricing tiers set</p>
                  <p className="text-gray-400 text-xs">Add a tier using the form above</p>
                </div>
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity Range</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Action</div>
            </div>

            {/* Table Body */}
            <div className="space-y-2">
              {pricesArray.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#D73D32]/30 transition-all duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    {/* Quantity Range */}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 md:hidden block mb-1">Quantity Range</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#D73D32]/10 text-[#D73D32] font-bold text-sm">
                          {item.min_qty}
                        </span>
                        {item.max_qty ? (
                          <>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#D73D32]/10 text-[#D73D32] font-bold text-sm">
                              {item.max_qty}
                            </span>
                            <span className="text-gray-500 text-xs">units</span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-400 text-xs">+</span>
                            <span className="text-gray-500 text-xs">units</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 md:hidden block mb-1">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-gray-500 text-sm">$</span>
                        <span className="text-xl font-bold text-[#D73D32]">
                          {item.price?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-start md:justify-end">
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {pricesArray.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <div className="inline-flex items-center gap-4 text-xs bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Total Tiers:</span>
                    <span className="font-bold text-gray-900">{pricesArray.length}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Starting from:</span>
                    <span className="font-bold text-[#D73D32]">
                      ${Math.min(...pricesArray.map((p) => Number(p.price))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
       <Toaster />
    </div>
  );
};

export default VariantPricesSection;