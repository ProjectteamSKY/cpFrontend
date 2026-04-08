import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import AdminProductSetup from "./AdminProductSetup";
import { ProductSetup } from "../../types/productvarientsetup";
import { getAllProducts } from "../../service/productApiService";

const ProductSetupWrapper: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery<ProductSetup[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getAllProducts();
      // API returns { products: [...] }
      if (res?.data?.products) return res.data.products;
      // API returns { data: [...] } directly
      if (Array.isArray(res?.data)) return res.data;
      // API returns array directly
      if (Array.isArray(res)) return res;
      return [];
    },
  });

  if (isLoading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <h1>Product Management</h1>

      <Select
        placeholder="Select Product"
        style={{ width: 300, marginBottom: 16 }}
        options={(products ?? []).map((p) => ({ label: p.name, value: p.id }))}
        onChange={(value) => setSelectedProduct(value)}
      />

      {selectedProduct && <AdminProductSetup productId={selectedProduct} />}
    </div>
  );
};

export default ProductSetupWrapper;