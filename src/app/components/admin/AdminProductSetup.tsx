import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getAttributes,
  getAttributeValues,
} from "../../service/productvarientsetupApiService";
import VariantAttributesSection from "./VariantAttributesSection";
import VariantPricesSection from "./VariantPricesSection";





interface AdminProductSetupProps {
  productId: string;
}

type TabType = "variants" | "attributes" | "pricing";

const AdminProductSetup: React.FC<AdminProductSetupProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("variants");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [skuInput, setSkuInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedVariantForAttributes, setSelectedVariantForAttributes] = useState<Variant | null>(null);
  const [selectedVariantForPricing, setSelectedVariantForPricing] = useState<Variant | null>(null);

  // Fetch data
  const { data: attributesData, isLoading: loadingAttributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => getAttributes().then((res) => res.data.data),
  });
  const attributes = Array.isArray(attributesData) ? attributesData : [];

  const { data: attributeValuesData, isLoading: loadingAttributeValues } = useQuery({
    queryKey: ["attributeValues"],
    queryFn: () => getAttributeValues().then((res) => res.data.data),
  });
  const attributeValues = Array.isArray(attributeValuesData) ? attributeValuesData : [];

  const { data: variantsData, isLoading: loadingVariants, refetch } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => getVariants(productId).then((res) => res.data.data),
  });
  const variants: Variant[] = Array.isArray(variantsData)
    ? variantsData.map((v) => ({ ...v, is_active: !!v.is_active }))
    : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: Partial<Variant>) => createVariant(payload),
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Variant> }) => updateVariant(id, data),
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariant(id),
    onSuccess: () => refetch(),
  });

  const generateSKU = () => `SKU-${uuidv4().split("-")[0].toUpperCase()}`;

  const handleOpenCreate = () => {
    setEditingVariant(null);
    setSkuInput(generateSKU());
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (variant: Variant) => {
    setEditingVariant(variant);
    setSkuInput(variant.sku);
    setIsActive(variant.is_active);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
    setSkuInput("");
    setIsActive(true);
  };

  const handleSubmit = () => {
    if (editingVariant) {
      updateMutation.mutate({
        id: editingVariant.id,
        data: { sku: skuInput, is_active: isActive },
      });
    } else {
      createMutation.mutate({
        sku: skuInput,
        is_active: isActive,
        product_id: productId,
      });
    }
  };

  const stats = [
    { label: "Total Variants", value: variants.length, color: "#D73D32" },
    { label: "Active Variants", value: variants.filter((v) => v.is_active).length, color: "#10B981" },
    { label: "Total Attributes", value: attributes.length, color: "#8B5CF6" },
  ];

  const tabs = [
    { id: "variants" as TabType, label: "Variants", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )},
    { id: "attributes" as TabType, label: "Attributes", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )},
    { id: "pricing" as TabType, label: "Pricing", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const isLoading = loadingVariants || loadingAttributes || loadingAttributeValues;

  return (
    <div className="w-full">
      {/* Stats Cards - Full Width */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-gray-900 text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: `${stat.color}10` }}>
                <div className="w-full h-full rounded-xl" style={{ backgroundColor: `${stat.color}20` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Main Card - Full Width */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header with Tabs - Sticky inside card */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D73D32]/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Product Configuration</h2>
                <p className="text-xs text-gray-500">Manage variants, attributes, and pricing</p>
              </div>
            </div>
            {activeTab === "variants" && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] rounded-lg text-white font-medium transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Variant
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="px-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-t-lg transition-all font-medium ${
                    activeTab === tab.id
                      ? "bg-white text-[#D73D32] border-t border-l border-r border-gray-200 -mb-px"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === "variants" && variants.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {variants.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable inside card if needed */}
        <div className="p-6 w-full max-h-[calc(100vh-320px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-[#D73D32] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="w-full">
                  {variants.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No variants yet</p>
                      <button
                        onClick={handleOpenCreate}
                        className="mt-3 text-[#D73D32] text-sm font-medium hover:underline"
                      >
                        Create your first variant →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 w-full">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#D73D32]/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-mono text-gray-900 font-semibold">{variant.sku}</p>
                                <p className="text-gray-400 text-xs mt-0.5">ID: {variant.id.slice(0, 8)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                  variant.is_active
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-gray-50 text-gray-500 border border-gray-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    variant.is_active ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                  }`}
                                ></span>
                                {variant.is_active ? "Active" : "Inactive"}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenEdit(variant)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-[#D73D32] hover:bg-[#D73D32]/10 transition-all"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteMutation.mutate(variant.id)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attributes Tab */}
              {activeTab === "attributes" && (
                <div className="w-full">
                  {variants.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Create a variant first to manage attributes</p>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                        <select
                          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] outline-none bg-white"
                          value={selectedVariantForAttributes?.id || ""}
                          onChange={(e) => {
                            const variant = variants.find((v) => v.id === e.target.value);
                            setSelectedVariantForAttributes(variant || null);
                          }}
                        >
                          <option value="">-- Select a variant --</option>
                          {variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.sku} - {variant.is_active ? "Active" : "Inactive"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedVariantForAttributes ? (
                        <VariantAttributesSection
                          variant={selectedVariantForAttributes}
                          attributes={attributes}
                          attributeValues={attributeValues}
                        />
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-500">Please select a variant to view its attributes</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === "pricing" && (
                <div className="w-full">
                  {variants.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Create a variant first to set pricing</p>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                        <select
                          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] outline-none bg-white"
                          value={selectedVariantForPricing?.id || ""}
                          onChange={(e) => {
                            const variant = variants.find((v) => v.id === e.target.value);
                            setSelectedVariantForPricing(variant || null);
                          }}
                        >
                          <option value="">-- Select a variant --</option>
                          {variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.sku} - {variant.is_active ? "Active" : "Inactive"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedVariantForPricing ? (
                        <VariantPricesSection variant={selectedVariantForPricing} />
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-500">Please select a variant to view its pricing</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingVariant ? "Edit Variant" : "Create New Variant"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {editingVariant ? "Update variant details" : "Add a new product variant"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32] focus:border-transparent"
                  placeholder="Enter SKU"
                />
                <p className="mt-1 text-gray-400 text-xs">Unique identifier for this variant</p>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                <span className="text-gray-700 text-sm font-medium">Active Status</span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-[#D73D32]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-5 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] rounded-lg text-white font-medium transition-colors shadow-sm"
              >
                {editingVariant ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductSetup;


// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Form, Input, Switch, Spin, Empty } from "antd";
// import { v4 as uuidv4 } from "uuid";
// import {
//   getVariants,
//   createVariant,
//   updateVariant,
//   deleteVariant,
//   getAttributes,
//   getAttributeValues,
// } from "../../service/productvarientsetupApiService";
// import { Variant } from "../../types/productvarientsetup";
// import VariantAttributesSection from "./VariantAttributesSection";
// import VariantPricesSection from "./VariantPricesSection";

// interface ProductSetupProps {
//   productId: string;
// }

// const AdminProductSetup: React.FC<ProductSetupProps> = ({ productId }) => {
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   // Fetch attributes
//   const { data: attributesData, isLoading: loadingAttributes } = useQuery({
//     queryKey: ["attributes"],
//     queryFn: () => getAttributes().then((res) => res.data.data),
//   });
//   const attributes = Array.isArray(attributesData) ? attributesData : [];

//   // Fetch attribute values
//   const { data: attributeValuesData, isLoading: loadingAttributeValues } = useQuery({
//     queryKey: ["attributeValues"],
//     queryFn: () => getAttributeValues().then((res) => res.data.data),
//   });
//   const attributeValues = Array.isArray(attributeValuesData) ? attributeValuesData : [];

//   // Fetch variants
//   const { data: variantsData, isLoading: loadingVariants } = useQuery({
//     queryKey: ["variants", productId],
//     queryFn: () => getVariants(productId).then((res) => res.data.data),
//   });
//   const variants: Variant[] = Array.isArray(variantsData)
//     ? variantsData.map((v) => ({ ...v, is_active: !!v.is_active }))
//     : [];

//   const [showAddVariant, setShowAddVariant] = useState(false);
//   const [editingVariant, setEditingVariant] = useState<Partial<Variant> | null>(null);
//   const [expandedVariantId, setExpandedVariantId] = useState<string | null>(null);

//   useEffect(() => {
//     if (showAddVariant || editingVariant) {
//       form.setFieldsValue({
//         sku: editingVariant?.sku ?? generateSKU(),
//         is_active: editingVariant?.is_active ?? true,
//       });
//     }
//   }, [showAddVariant, editingVariant, form]);

//   // Mutations
//   const variantMutation = useMutation({
//     mutationFn: (payload: Partial<Variant>) => createVariant(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["variants", productId] });
//       resetForm();
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<Variant> }) =>
//       updateVariant(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["variants", productId] });
//       resetForm();
//     },
//   });

//   const deleteVariantMutation = useMutation({
//     mutationFn: (id: string) => deleteVariant(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variants", productId] }),
//   });

//   const generateSKU = () => `SKU-${uuidv4().split("-")[0].toUpperCase()}`;

//   const resetForm = () => {
//     setShowAddVariant(false);
//     setEditingVariant(null);
//     form.resetFields();
//   };

//   const handleSaveVariant = async (values: any) => {
//     if (editingVariant?.id) {
//       updateMutation.mutate({ id: editingVariant.id, payload: values });
//     } else {
//       variantMutation.mutate({ ...values, product_id: productId });
//     }
//   };

//   const isLoading = loadingVariants || loadingAttributes || loadingAttributeValues;
//   const activeCount = variants.filter((v) => v.is_active).length;

//   return (
//     <div className="space-y-8">
//       {/* Add Variant Section */}
//       <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-bold text-gray-900">
//             {showAddVariant || editingVariant ? "Variant Details" : "Add New Variant"}
//           </h3>
//         </div>

//         {showAddVariant || editingVariant ? (
//           <div className="bg-white p-6 rounded-lg border border-gray-200">
//             <Form form={form} layout="vertical" onFinish={handleSaveVariant}>
//               <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "SKU is required" }]}>
//                 <Input
//                   placeholder="Enter SKU or auto-generate"
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D73D32]"
//                 />
//               </Form.Item>

//               <Form.Item label="Active" name="is_active" valuePropName="checked">
//                 <div className="flex items-center gap-3">
//                   <Switch />
//                   <span className="text-gray-700 font-medium">
//                     {form.getFieldValue("is_active") ? "Active" : "Inactive"}
//                   </span>
//                 </div>
//               </Form.Item>

//               <div className="flex gap-3 justify-end pt-4">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={variantMutation.isLoading || updateMutation.isLoading}
//                   className="px-6 py-2 bg-[#D73D32] text-white font-semibold rounded-lg hover:bg-[#b8311e] disabled:opacity-50 transition-colors"
//                 >
//                   {variantMutation.isLoading || updateMutation.isLoading ? "Saving..." : "Save Variant"}
//                 </button>
//               </div>
//             </Form>
//           </div>
//         ) : (
//           <button
//             onClick={() => setShowAddVariant(true)}
//             className="w-full py-3 px-6 bg-gradient-to-r from-[#D73D32] to-[#b8311e] text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
//           >
//             <span className="text-xl">+</span>
//             Add New Variant
//           </button>
//         )}
//       </div>

//       {/* Variants List Section */}
//       <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-bold text-gray-900">Variants ({variants.length})</h3>
//           <div className="bg-[#D73D32] text-white px-4 py-2 rounded-full text-sm font-semibold">
//             {activeCount} active
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <Spin tip="Loading variants..." />
//           </div>
//         ) : variants.length === 0 ? (
//           <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
//             <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10m0-10l8-4" />
//             </svg>
//             <p className="text-gray-600 font-medium">No variants yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {variants.map((variant) => (
//               <div
//                 key={variant.id}
//                 className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#D73D32] transition-colors"
//               >
//                 <button
//                   onClick={() => setExpandedVariantId(expandedVariantId === variant.id ? null : variant.id)}
//                   className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4 flex-1">
//                     <h4 className="font-mono font-bold text-gray-900">{variant.sku}</h4>
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
//                       variant.is_active ? "bg-green-600" : "bg-gray-400"
//                     }`}>
//                       {variant.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setEditingVariant(variant);
//                         setShowAddVariant(false);
//                       }}
//                       className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Edit"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteVariantMutation.mutate(variant.id);
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="Delete"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                     <span className={`text-gray-400 transition-transform ${expandedVariantId === variant.id ? "rotate-180" : ""}`}>
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                       </svg>
//                     </span>
//                   </div>
//                 </button>

//                 {expandedVariantId === variant.id && (
//                   <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-6">
//                     <VariantAttributesSection
//                       variant={variant}
//                       attributes={attributes}
//                       attributeValues={attributeValues}
//                     />
//                     <div className="border-t border-gray-200 pt-6">
//                       <VariantPricesSection variant={variant} />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProductSetup;