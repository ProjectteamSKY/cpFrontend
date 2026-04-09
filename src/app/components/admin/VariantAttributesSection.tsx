// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Form, Select, Button, Table, Spin } from "antd";
// import { Variant, VariantAttributeValue, Attribute, AttributeValue } from "../../types/productvarientsetup";
// import {
//   createVariantAttributeValue,
//   getVariantAttributeValues,
//   deleteVariantAttributeValue,
// } from "../../service/productvarientsetupApiService";

// interface Props {
//   variant: Variant;
//   attributes: Attribute[];
//   attributeValues: AttributeValue[];
// }

// const VariantAttributesSection: React.FC<Props> = ({ variant, attributes, attributeValues }) => {
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();
//   const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);

//   // Fetch variant attribute values
//   const { data: valuesArray = [], isLoading } = useQuery<VariantAttributeValue[]>({
//     queryKey: ["variantAttributeValues", variant.id],
//     queryFn: async () => {
//       const res = await getVariantAttributeValues(variant.id);
//       // API response has { status, data } → we only need data
//       return Array.isArray(res) ? res : [];
//     },
//   });

//   // Add new attribute value
//   const addMutation = useMutation({
//     mutationFn: (payload: Partial<VariantAttributeValue>) => createVariantAttributeValue(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
//       form.resetFields();
//       setSelectedAttributeId(null);
//     },
//   });

//   // Delete attribute value
//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteVariantAttributeValue(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
//     },
//   });

//   // Filter attribute values for the selected attribute
//   const filteredValues = selectedAttributeId
//     ? attributeValues.filter((v) => v.attribute_id === selectedAttributeId)
//     : [];

//   return (
//     <div style={{ marginTop: 16 }}>
//       <h3>Variant Attributes: {variant.sku}</h3>

//       {/* Add new variant attribute */}
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={(vals) =>
//           addMutation.mutate({
//             variant_id: variant.id,
//             attribute_id: vals.attribute_id,
//             attribute_value_ids: [vals.attribute_value_id], // required by backend
//           })
//         }
//       >
//         <Form.Item label="Attribute" name="attribute_id" rules={[{ required: true }]}>
//           <Select
//             style={{ width: 150 }}
//             options={attributes.map((a) => ({ label: a.name, value: a.id }))}
//             onChange={(val) => {
//               setSelectedAttributeId(val);
//               form.setFieldValue("attribute_value_id", undefined);
//             }}
//           />
//         </Form.Item>

//         <Form.Item label="Value" name="attribute_value_id" rules={[{ required: true }]}>
//           <Select
//             style={{ width: 150 }}
//             options={filteredValues.map((v) => ({ label: v.value, value: v.id }))}
//             disabled={!selectedAttributeId}
//           />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={addMutation.isLoading}>
//             Add
//           </Button>
//         </Form.Item>
//       </Form>

//       {/* Table showing variant attributes */}
//       <Table
//         style={{ marginTop: 16 }}
//         rowKey="id"
//         dataSource={valuesArray}
//         loading={isLoading || deleteMutation.isLoading}
//         columns={[
//           { title: "Attribute", dataIndex: "attribute_name" },
//           { title: "Value", dataIndex: "attribute_value_name" },
//           {
//             title: "Actions",
//             render: (_, record) => (
//               <Button
//                 danger
//                 loading={deleteMutation.isLoading}
//                 onClick={() => deleteMutation.mutate(record.id)}
//               >
//                 Delete
//               </Button>
//             ),
//           },
//         ]}
//         locale={{ emptyText: "No variant attributes yet" }}
//       />
//     </div>
//   );
// };

// export default VariantAttributesSection;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Select, Spin, Dropdown, Menu } from "antd";
import { Variant, VariantAttributeValue, Attribute, AttributeValue } from "../../types/productvarientsetup";
import {
  createVariantAttributeValue,
  getVariantAttributeValues,
  deleteVariantAttributeValue,
  updateVariantAttributeValue,
} from "../../service/productvarientsetupApiService";

interface Props {
  variant: Variant;
  attributes: Attribute[];
  attributeValues: AttributeValue[];
}

const VariantAttributesSection: React.FC<Props> = ({ variant, attributes, attributeValues }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<VariantAttributeValue | null>(null);

  // Fetch variant attribute values
  const { data: valuesArray = [], isLoading } = useQuery<VariantAttributeValue[]>({
    queryKey: ["variantAttributeValues", variant.id],
    queryFn: async () => {
      const res = await getVariantAttributeValues(variant.id);
      return Array.isArray(res) ? res : [];
    },
  });

  // Add new attribute value
  const addMutation = useMutation({
    mutationFn: (payload: Partial<VariantAttributeValue>) => createVariantAttributeValue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
      form.resetFields();
      setSelectedAttributeId(null);
      setEditingItem(null);
    },
  });

  // Update attribute value - FIXED: No ID in URL
  const updateMutation = useMutation({
    mutationFn: (payload: {
      variant_id: string;
      attribute_id: string;
      attribute_value_ids: string[];
    }) => updateVariantAttributeValue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
      form.resetFields();
      setSelectedAttributeId(null);
      setEditingItem(null);
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  // Delete attribute value
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariantAttributeValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
    },
  });

  // Filter attribute values for the selected attribute
  const filteredValues = selectedAttributeId
    ? attributeValues.filter((v) => v.attribute_id === selectedAttributeId)
    : [];

  // Handle edit click
  const handleEdit = (item: VariantAttributeValue) => {
    setEditingItem(item);
    setSelectedAttributeId(item.attribute_id);
    form.setFieldsValue({
      attribute_id: item.attribute_id,
      attribute_value_id: item.attribute_value_id,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    form.resetFields();
    setSelectedAttributeId(null);
  };

  // Handle form submit (create or update)
  const handleSubmit = (vals: any) => {
    if (editingItem) {
      // Update existing - using the update endpoint without ID
      updateMutation.mutate({
        variant_id: variant.id,
        attribute_id: vals.attribute_id,
        attribute_value_ids: [vals.attribute_value_id],
      });
    } else {
      // Create new
      addMutation.mutate({
        variant_id: variant.id,
        attribute_id: vals.attribute_id,
        attribute_value_ids: [vals.attribute_value_id],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-gray-900">Attributes</h4>
        <span className="bg-[#D73D32] text-white text-xs font-bold px-3 py-1 rounded-full">
          {valuesArray.length}
        </span>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Attribute"
              name="attribute_id"
              rules={[{ required: true, message: "Select attribute" }]}
            >
              <Select
                placeholder="Choose attribute"
                options={attributes.map((a) => ({ label: a.name, value: a.id }))}
                onChange={(val) => {
                  setSelectedAttributeId(val);
                  form.setFieldValue("attribute_value_id", undefined);
                }}
                disabled={!!editingItem}
              />
            </Form.Item>

            <Form.Item
              label="Value"
              name="attribute_value_id"
              rules={[{ required: true, message: "Select value" }]}
            >
              <Select
                placeholder="Choose value"
                options={filteredValues.map((v) => ({ label: v.value, value: v.id }))}
                disabled={!selectedAttributeId}
              />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={addMutation.isLoading || updateMutation.isLoading}
              className="flex-1 py-2 bg-[#D73D32] text-white font-semibold rounded-lg hover:bg-[#b8311e] disabled:opacity-50 transition-colors"
            >
              {updateMutation.isLoading 
                ? "Updating..." 
                : addMutation.isLoading 
                  ? "Adding..." 
                  : editingItem 
                    ? "Update Attribute" 
                    : "Add Attribute"
              }
            </button>
            
            {editingItem && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      </div>

      {/* Attributes List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <Spin tip="Loading..." />
        </div>
      ) : valuesArray.length === 0 ? (
        <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">No attributes assigned</p>
        </div>
      ) : (
        <div className="space-y-2">
          {valuesArray.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:border-[#D73D32] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="bg-red-100 text-[#D73D32] px-3 py-1 rounded text-xs font-bold">
                  {item.attribute_name}
                </span>
                <span className="text-gray-700 font-medium">{item.attribute_value_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(item)}
                  disabled={updateMutation.isLoading}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit attribute value"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isLoading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove attribute"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantAttributesSection;