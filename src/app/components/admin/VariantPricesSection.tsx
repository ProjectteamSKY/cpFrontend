import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, InputNumber, Spin, Empty, Button, Modal, Popconfirm, Switch } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Variant, VariantPrice } from "../../types/productvarientsetup";
import {
  createVariantPrice,
  getVariantPrices,
  deleteVariantPrice,
  updateVariantPrice,
} from "../../service/productvarientsetupApiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface Props {
  variant: Variant;
}

const VariantPricesSection: React.FC<Props> = ({ variant }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ["variantPrices", variant.id],
    queryFn: () => getVariantPrices(variant.id),
  });

  const pricesArray: VariantPrice[] = Array.isArray(prices) ? prices : [];

  // Format price tiers for display
  const getTierDisplay = (item: VariantPrice) => {
    if (item.max_qty) {
      return `${item.min_qty} - ${item.max_qty} units`;
    }
    return `${item.min_qty}+ units`;
  };

  // Format dimensions display
  const getDimensionsDisplay = (item: VariantPrice) => {
    const dimensions = [];
    if (item.length) dimensions.push(`${item.length}cm`);
    if (item.breadth) dimensions.push(`${item.breadth}cm`);
    if (item.height) dimensions.push(`${item.height}cm`);
    return dimensions.join(' × ');
  };

  // =========================
  // CREATE
  // =========================
  const addMutation = useMutation({
    mutationFn: (payload: Partial<VariantPrice>) =>
      createVariantPrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variantPrices", variant.id],
      });
      form.resetFields();
      setModalVisible(false);
      toast.success("Price tier added successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add price tier", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // =========================
  // UPDATE
  // =========================
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VariantPrice>;
    }) => updateVariantPrice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variantPrices", variant.id],
      });
      form.resetFields();
      setEditingId(null);
      setModalVisible(false);
      toast.success("Price tier updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update price tier", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // =========================
  // DELETE
  // =========================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariantPrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variantPrices", variant.id],
      });
      toast.success("Price tier deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete price tier", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (values: any) => {
    const payload: Partial<VariantPrice> = {
      ...values,
      variant_id: variant.id,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  // =========================
  // EDIT HANDLER
  // =========================
  const handleEdit = (item: VariantPrice) => {
    setEditingId(item.id);
    form.setFieldsValue({
      min_qty: item.min_qty,
      max_qty: item.max_qty,
      price: item.price,
      weight: item.weight,
      length: item.length,
      breadth: item.breadth,
      height: item.height,
      custom_qty: item.custom_qty,
    });
    setModalVisible(true);
  };

  // =========================
  // ADD NEW HANDLER
  // =========================
  const handleAddNew = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      min_qty: 1,
      weight: 0,
      price: 0,
      length: 0,
      breadth: 0,
      height: 0,
      custom_qty: false,
    });
    setModalVisible(true);
  };

  // =========================
  // CANCEL HANDLER
  // =========================
  const handleCancel = () => {
    setModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  // Calculate total tiers count
  const totalTiers = pricesArray.length;

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Pricing Tiers</h4>
            <p className="text-sm text-gray-500 mt-1">
              Manage bulk pricing for <span className="font-medium text-gray-700">{variant.sku}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-[#D73D32]/10 rounded-lg">
              <span className="text-[#D73D32] font-semibold">{totalTiers}</span>
              <span className="text-gray-600 ml-1">tiers</span>
            </div>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-[#D73D32] hover:bg-[#c0342a] border-none"
            >
              Add Tier
            </Button>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Loading pricing tiers..." />
        </div>
      ) : pricesArray.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-12">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No pricing tiers added yet"
          >
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-[#D73D32] hover:bg-[#c0342a] border-none mt-2"
            >
              Create First Tier
            </Button>
          </Empty>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions (L × B × H)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custom Qty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pricesArray.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {getTierDisplay(item)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        {item.weight?.toFixed(3)} kg
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        {getDimensionsDisplay(item)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-gray-900">₹</span>
                      <span className="text-base font-bold text-gray-900">
                        {item.price?.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.custom_qty ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          No
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Delete Price Tier"
                        description="Are you sure you want to delete this pricing tier? This action cannot be undone."
                        onConfirm={() => deleteMutation.mutate(item.id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        icon={<ExclamationCircleOutlined style={{ color: '#D73D32' }} />}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL FORM */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {editingId ? (
              <>
                <EditOutlined className="text-[#D73D32]" />
                <span>Edit Pricing Tier</span>
              </>
            ) : (
              <>
                <PlusOutlined className="text-[#D73D32]" />
                <span>Add New Pricing Tier</span>
              </>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={handleCancel}
        width={800}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          {/* Quantity Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AppstoreOutlined className="text-[#D73D32]" />
              Quantity Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="min_qty"
                label="Minimum Quantity"
                rules={[{ required: true, message: "Please enter minimum quantity" }]}
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  placeholder="e.g., 10"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="max_qty"
                label="Maximum Quantity (Optional)"
                tooltip="Leave empty for unlimited"
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  placeholder="e.g., 50"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          {/* Weight and Price Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarOutlined className="text-[#D73D32]" />
              Pricing & Weight
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="weight"
                label="Weight (kg)"
                rules={[{ required: true, message: "Please enter weight" }]}
              >
                <InputNumber
                  min={0}
                  step={0.001}
                  className="w-full"
                  placeholder="0.000"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  className="w-full"
                  placeholder="0.00"
                  size="large"
                  prefix="₹"
                />
              </Form.Item>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <InboxOutlined className="text-[#D73D32]" />
              Package Dimensions
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="length"
                label="Length (cm)"
                rules={[{ required: true, message: "Please enter length" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Length"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="breadth"
                label="Breadth (cm)"
                rules={[{ required: true, message: "Please enter breadth" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Breadth"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="height"
                label="Height (cm)"
                rules={[{ required: true, message: "Please enter height" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Height"
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Note:</span> Dimensions are required for shipping calculations
            </div>
          </div>

          {/* Custom Quantity Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <SettingOutlined className="text-[#D73D32]" />
              Additional Settings
            </h3>
            <Form.Item
              name="custom_qty"
              label="Custom Quantity"
              valuePropName="checked"
              tooltip="Enable this for custom quantity pricing rules"
            >
              <Switch 
                checkedChildren="Yes" 
                unCheckedChildren="No"
                className="bg-gray-300"
              />
            </Form.Item>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Note:</span> Enable this if this tier uses custom quantity rules
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addMutation.isLoading || updateMutation.isLoading}
              icon={editingId ? <SaveOutlined /> : <PlusOutlined />}
              className="bg-[#D73D32] hover:bg-[#c0342a] border-none"
              size="large"
            >
              {editingId ? "Update Tier" : "Add Tier"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default VariantPricesSection;