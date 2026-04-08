import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Form, InputNumber, Button } from "antd";
import { Variant, VariantPrice } from "../../types/productvarientsetup";
import { createVariantPrice, getVariantPrices, deleteVariantPrice } from "../../service/productvarientsetupApiService";

interface Props {
  variant: Variant;
}

const VariantPricesSection: React.FC<Props> = ({ variant }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data } = useQuery({
    queryKey: ["variantPrices", variant.id],
    queryFn: () => getVariantPrices(variant.id),
  });

  // Always ensure array
  const pricesArray: VariantPrice[] = Array.isArray(data?.data) ? data.data : [];

  const addMutation = useMutation({
    mutationFn: (payload: Partial<VariantPrice>) => createVariantPrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] });
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariantPrice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variantPrices", variant.id] }),
  });

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Variant Prices: {variant.sku}</h3>

      <Form form={form} layout="inline" onFinish={(vals) => addMutation.mutate({ ...vals, variant_id: variant.id })}>
        <Form.Item label="Min Qty" name="min_qty" rules={[{ required: true }]}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Max Qty" name="max_qty">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} precision={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add</Button>
        </Form.Item>
      </Form>

      <Table
        style={{ marginTop: 8 }}
        rowKey="id"
        dataSource={pricesArray}
        columns={[
          { title: "Min Qty", dataIndex: "min_qty" },
          { title: "Max Qty", dataIndex: "max_qty" },
          { title: "Price", dataIndex: "price" },
          { title: "Actions", render: (_, record: VariantPrice) => <Button danger onClick={() => deleteMutation.mutate(record.id)}>Delete</Button> },
        ]}
      />
    </div>
  );
};

export default VariantPricesSection;