import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, InputNumber, Spin, Empty } from "antd";
import { Variant, VariantPrice } from "../../types/productvarientsetup";
import {
  createVariantPrice,
  getVariantPrices,
  deleteVariantPrice,
  updateVariantPrice, // ✅ NEW
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
  const [editingId, setEditingId] = useState<string | null>(null); // ✅

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ["variantPrices", variant.id],
    queryFn: () => getVariantPrices(variant.id),
  });

  const pricesArray: VariantPrice[] = Array.isArray(prices) ? prices : [];

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
      toast.success("Price tier added");
    },
  });

  // =========================
  // UPDATE
  // =========================
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VariantPrice> }) =>
      updateVariantPrice(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variantPrices", variant.id],
      });
      form.resetFields();
      setEditingId(null);
      toast.success("Updated successfully");
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
      toast.success("Deleted successfully");
    },
  });

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (vals: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: vals });
    } else {
      addMutation.mutate({
        ...vals,
        variant_id: variant.id,
      });
    }
  };

  // =========================
  // EDIT CLICK
  // =========================
  const handleEdit = (item: VariantPrice) => {
    setEditingId(item.id);

    form.setFieldsValue({
      min_qty: item.min_qty,
      max_qty: item.max_qty,
      price: item.price,
      weight: item.weight,
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* HEADER (UNCHANGED) */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D73D32]/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Pricing Tiers</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage bulk pricing for {variant.sku}
              </p>
            </div>
          </div>

          <div className="bg-[#D73D32]/10 px-3 py-1.5 rounded-full">
            <span className="text-[#D73D32] font-bold text-sm">
              {pricesArray.length}
            </span>
            <span className="text-[#D73D32]/70 text-xs ml-1">tiers</span>
          </div>
        </div>
      </div>

      {/* FORM (UNCHANGED UI) */}
      <div className="p-5 border-b border-gray-100">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <Form.Item name="min_qty" label="Min Qty *" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="max_qty" label="Max Qty">
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="weight" label="Weight (kg) *" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.001} className="w-full" />
            </Form.Item>

            <Form.Item name="price" label="Price *" rules={[{ required: true }]}>
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>


          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-[#D73D32] text-white font-semibold rounded-lg"
          >
            {editingId ? "Update Tier" : "Add Tier"}
          </button>
        </Form>
      </div>

      {/* TABLE */}
      <div className="p-5">
        {isLoading ? (
          <Spin />
        ) : pricesArray.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">

            {/* HEADER */}
            <div className="hidden md:grid grid-cols-4 gap-4 bg-gray-50 rounded-lg px-4 py-3 border">
              <div>Quantity</div>
              <div>Weight</div>
              <div>Price</div>
              <div className="text-right">Action</div>
            </div>

            {/* ROWS */}
            {pricesArray.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">

                <div>{item.min_qty} → {item.max_qty || "∞"}</div>

                <div>{item.weight?.toFixed(3)} kg</div>

                <div>₹ {item.price.toFixed(2)}</div>

                <div className="text-right flex justify-end gap-3">

                  {/* ✅ EDIT (ADDED ONLY THIS) */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default VariantPricesSection;