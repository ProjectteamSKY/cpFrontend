import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, Form, Input, Switch, Space, Divider, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";

import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getAttributes,
  getAttributeValues,
} from "../../service/productvarientsetupApiService";
import { Variant } from "../../types/productvarientsetup";
import VariantAttributesSection from "./VariantAttributesSection";
import VariantPricesSection from "./VariantPricesSection";

interface ProductSetupProps {
  productId: string;
}

const AdminProductSetup: React.FC<ProductSetupProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Fetch attributes
  const { data: attributesData, isLoading: loadingAttributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => getAttributes().then((res) => res.data.data),
  });
  const attributes = Array.isArray(attributesData) ? attributesData : [];

  // Fetch attribute values
  const { data: attributeValuesData, isLoading: loadingAttributeValues } = useQuery({
    queryKey: ["attributeValues"],
    queryFn: () => getAttributeValues().then((res) => res.data.data),
  });
  const attributeValues = Array.isArray(attributeValuesData) ? attributeValuesData : [];

  // Fetch variants
  const { data: variantsData, isLoading: loadingVariants } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => getVariants(productId).then((res) => res.data.data),
  });
  const variants: Variant[] = Array.isArray(variantsData)
    ? variantsData.map((v) => ({ ...v, is_active: !!v.is_active }))
    : [];

  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Partial<Variant> | null>(null);

  // Pre-fill modal form
  useEffect(() => {
    if (variantModalVisible) {
      form.setFieldsValue({
        sku: currentVariant?.sku ?? generateSKU(),
        is_active: currentVariant?.is_active ?? true,
      });
    }
  }, [variantModalVisible, currentVariant, form]);

  // Mutations
  const variantMutation = useMutation({
    mutationFn: (payload: Partial<Variant>) => createVariant(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variants", productId] }),
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (id: string) => deleteVariant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["variants", productId] }),
  });

  const generateSKU = () => `SKU-${uuidv4().split("-")[0].toUpperCase()}`;

  const handleClose = () => {
    setVariantModalVisible(false);
    setCurrentVariant(null);
    form.resetFields();
  };

  return (
    <div>
      <h2>Admin Product Setup</h2>

      <Button
        type="primary"
        onClick={() => {
          setCurrentVariant(null);
          setVariantModalVisible(true);
        }}
      >
        Add Variant
      </Button>

      <Divider />

      {/* Loading spinner for Table */}
      {loadingVariants ? (
        <Spin tip="Loading variants..." />
      ) : (
        <Table
          style={{ marginTop: 16 }}
          rowKey="id"
          dataSource={variants}
          columns={[
            { title: "SKU", dataIndex: "sku" },
            {
              title: "Active",
              dataIndex: "is_active",
              render: (_, record: Variant) => (record.is_active ? "Yes" : "No"),
            },
            {
              title: "Actions",
              render: (_, record: Variant) => (
                <Space>
                  <Button
                    onClick={() => {
                      setCurrentVariant(record);
                      setVariantModalVisible(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button danger onClick={() => deleteVariantMutation.mutate(record.id)}>
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          locale={{ emptyText: "No variants yet" }}
        />
      )}

      {/* Variant Modal */}
      <Modal
        title={currentVariant ? "Edit Variant" : "Add Variant"}
        open={variantModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (currentVariant?.id) {
              updateVariant(currentVariant.id, values).then(() =>
                queryClient.invalidateQueries({ queryKey: ["variants", productId] })
              );
            } else {
              variantMutation.mutate({ ...values, product_id: productId });
            }
            handleClose();
          }}
        >
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentVariant ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Divider />

      {/* Variant Attributes Section */}
      {loadingAttributes || loadingAttributeValues ? (
        <Spin tip="Loading attributes..." />
      ) : variants.length > 0 ? (
        variants.map((variant) => (
          <VariantAttributesSection
            key={variant.id}
            variant={variant}
            attributes={attributes}
            attributeValues={attributeValues}
          />
        ))
      ) : (
        <p>No variant attributes to display.</p>
      )}

      <Divider />

      {/* Variant Prices Section */}
      {variants.length > 0 ? (
        variants.map((variant) => <VariantPricesSection key={variant.id} variant={variant} />)
      ) : (
        <p>No variant prices to display.</p>
      )}
    </div>
  );
};

export default AdminProductSetup;