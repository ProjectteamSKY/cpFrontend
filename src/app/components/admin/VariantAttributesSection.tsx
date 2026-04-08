import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Select, Button, Table } from "antd";
import { Variant, VariantAttributeValue, Attribute, AttributeValue } from "../../types/productvarientsetup";
import { createVariantAttributeValue, getVariantAttributeValues, deleteVariantAttributeValue } from "../../service/productvarientsetupApiService";

interface Props {
  variant: Variant;
  attributes: Attribute[];
  attributeValues: AttributeValue[];
}

const VariantAttributesSection: React.FC<Props> = ({ variant, attributes, attributeValues }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["variantAttributeValues", variant.id],
    queryFn: () => getVariantAttributeValues(variant.id),
  });

  // Always ensure array
  const valuesArray: VariantAttributeValue[] = Array.isArray(data?.data) ? data.data : [];

  const addMutation = useMutation({
    mutationFn: (payload: Partial<VariantAttributeValue>) => createVariantAttributeValue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] });
      form.resetFields();
      setSelectedAttributeId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariantAttributeValue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variantAttributeValues", variant.id] }),
  });

  const filteredValues = selectedAttributeId
    ? attributeValues.filter((v) => v.attribute_id === selectedAttributeId)
    : [];

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Variant Attributes: {variant.sku}</h3>
      <Form
        form={form}
        layout="inline"
        onFinish={(vals) => addMutation.mutate({ ...vals, variant_id: variant.id })}
      >
        <Form.Item label="Attribute" name="attribute_id" rules={[{ required: true }]}>
          <Select
            style={{ width: 150 }}
            options={attributes.map((a) => ({ label: a.name, value: a.id }))}
            onChange={(val) => {
              setSelectedAttributeId(val);
              form.setFieldValue("attribute_value_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item label="Value" name="attribute_value_id" rules={[{ required: true }]}>
          <Select
            style={{ width: 150 }}
            options={filteredValues.map((v) => ({ label: v.value, value: v.id }))}
            disabled={!selectedAttributeId}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add</Button>
        </Form.Item>
      </Form>

      <Table
        style={{ marginTop: 8 }}
        rowKey="id"
        dataSource={valuesArray}
        columns={[
          { title: "Attribute", dataIndex: "attribute_id", render: (id) => attributes.find((a) => a.id === id)?.name },
          { title: "Value", dataIndex: "attribute_value_id", render: (id) => attributeValues.find((v) => v.id === id)?.value },
          { title: "Actions", render: (_, record) => <Button danger onClick={() => deleteMutation.mutate(record.id)}>Delete</Button> },
        ]}
      />
    </div>
  );
};

export default VariantAttributesSection;