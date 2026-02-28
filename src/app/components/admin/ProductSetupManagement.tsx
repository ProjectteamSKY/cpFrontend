import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus } from "lucide-react";

import { ProductSetup, ProductSetupFormData } from "../../types/productSetup";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../../service/productSetupApiService";

import { ProductSetupForm } from "../forms/ProductSetupForm";
import { CustomTable } from "../common/CustomTable";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

// Define the API response type
// Define the API response type
interface ApiResponse {
  status?: string;
  product?: ProductSetup;      // For single product responses
  products?: ProductSetup[];   // For list responses
  data?: ProductSetup[] | ProductSetup; // Alternative structure
  message?: string;
  count?: number;              // If API returns count
}

export function ProductSetupManagement() {
  const [products, setProducts] = useState<ProductSetup[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSetupFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch ---------------- */
  /* ---------------- Fetch ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProducts();

      console.log("Fetch products response:", response);

      // Handle different response types
      let productData: ProductSetup[] = [];

      if (Array.isArray(response)) {
        productData = response;
      } else if (response && typeof response === 'object') {
        const apiResponse = response as ApiResponse;

        // Based on your API response structure
        if (apiResponse.status === 'success') {
          // Check for products array (plural) for list responses
          if (apiResponse.products && Array.isArray(apiResponse.products)) {
            productData = apiResponse.products;
          }
          // Check for data property
          else if (apiResponse.data && Array.isArray(apiResponse.data)) {
            productData = apiResponse.data;
          }
          // If product (singular) is returned but we expect an array
          else if (apiResponse.product) {
            productData = [apiResponse.product];
          }
        }
        // Fallback checks
        else if (apiResponse.products && Array.isArray(apiResponse.products)) {
          productData = apiResponse.products;
        } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
          productData = apiResponse.data;
        }
      }

      console.log("Processed product data:", productData);
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await deleteProduct(id);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Edit ---------------- */
  /* ---------------- Edit ---------------- */
  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductById(id);
      console.log("Raw product data for edit:", response);

      let productData: any = null;

      if (response && typeof response === 'object') {
        const apiResponse = response as ApiResponse;

        if (apiResponse.status === 'success' && apiResponse.product) {
          productData = apiResponse.product;
          console.log("Extracted product data:", productData);
        } else {
          productData = response;
        }
      }

      if (!productData) {
        throw new Error("Product data not found");
      }

      // Log the original values
      console.log("Original variant data:", productData.variants?.[0]);
      console.log("Variant ID:", productData.variants?.[0]?.id);
      console.log("Price IDs:", productData.variants?.[0]?.prices?.map((p: any) => p.id));
      console.log("Discount IDs:", productData.variants?.[0]?.prices?.map((p: any) => p.discount?.id));

      const formData: ProductSetupFormData = {
        id: productData.id,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id || "",
        name: productData.name || "",
        description: productData.description || "",
        min_order_qty: productData.min_order_qty || 100,
        max_order_qty: productData.max_order_qty || null,
        images: productData.images || [],
        related_images: productData.related_images || [],
        variants: productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0
          ? productData.variants.map((variant: any) => {
            console.log("Processing variant with ID:", variant.id);

            return {
              id: variant.id, // IMPORTANT: Keep the variant ID
              size_id: variant.size_id || "",
              paper_type_id: variant.paper_type_id || "",
              print_type_id: variant.print_type_id || "",
              cut_type_id: variant.cut_type_id || "",
              sides: Number(variant.sides) || 1,
              two_side_cut: variant.two_side_cut === 1 || variant.two_side_cut === true,
              four_side_cut: variant.four_side_cut === 1 || variant.four_side_cut === true,
              orientation: variant.orientation || "Landscape",
              prices: variant.prices && Array.isArray(variant.prices) && variant.prices.length > 0
                ? variant.prices.map((price: any) => {
                  console.log("Processing price with ID:", price.id);

                  const priceObj: any = {
                    id: price.id, // IMPORTANT: Keep the price ID
                    min_qty: Number(price.min_qty) || 100,
                    price: Number(price.price) || 0,
                  };

                  if (price.discount) {
                    console.log("Processing discount with ID:", price.discount.id);
                    priceObj.discount = {
                      id: price.discount.id, // IMPORTANT: Keep the discount ID
                      description: price.discount.description,
                      discount: Number(price.discount.discount),
                      start_date: price.discount.start_date,
                      end_date: price.discount.end_date
                    };
                  } else {
                    priceObj.discount = null;
                  }

                  return priceObj;
                })
                : [{ min_qty: 100, price: 0, discount: null }]
            };
          })
          : [{
            size_id: "",
            paper_type_id: "",
            print_type_id: "",
            cut_type_id: "",
            sides: 1,
            two_side_cut: false,
            four_side_cut: false,
            orientation: "Landscape",
            prices: [{ min_qty: 100, price: 0, discount: null }]
          }]
      };

      console.log("Final transformed form data (with all IDs preserved):", JSON.stringify(formData, null, 2));
      setEditingProduct(formData);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error loading product for editing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  /* ---------------- Columns ---------------- */
  const columns: ColumnDef<ProductSetup>[] = [
    {
      header: "Product",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.name || "N/A"}</span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category_name",
      cell: ({ row }) => row.original.category_name || "N/A",
    },
    {
      header: "Subcategory",
      accessorKey: "subcategory_name",
      cell: ({ row }) => row.original.subcategory_name || "N/A",
    },
    {
      header: "Size",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.size_name ?? "N/A";
      },
    },
    {
      header: "Paper",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.paper_type_name ?? "N/A";
      },
    },
    {
      header: "Print",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.print_type_name ?? "N/A";
      },
    },
    {
      header: "Cut",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.cut_type_name ?? "N/A";
      },
    },
    {
      header: "Sides",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.sides === 1 ? "Single" : variant?.sides === 2 ? "Double" : "N/A";
      },
    },
    {
      header: "Min Qty",
      cell: ({ row }) => {
        const price = row.original.variants?.[0]?.prices?.[0];
        return price?.min_qty ?? "N/A";
      },
    },

    {
      header: "Price",
      cell: ({ row }) => {
        const price = row.original.variants?.[0]?.prices?.[0];
        return price?.price ? `$${price.price}` : "N/A";
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(product.id)}
              className="text-blue-500 hover:text-blue-700"
              disabled={loading}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(product.id)}
              className="text-red-500 hover:text-red-700"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {showForm ? (
        /* ---------------- FORM (Create/Edit) ---------------- */
        <>
          <div className="relative flex items-center mb-6">
            <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <div className="ml-auto">
              <Button variant="outline" onClick={handleFormCancel}>
                Cancel
              </Button>
            </div>
          </div>

          <ProductSetupForm
            defaultValues={editingProduct}
            onCancel={handleFormCancel}
            onSubmitSuccess={handleFormSuccess}
            isEditing={!!editingProduct}
          />
        </>
      ) : (
        /* ---------------- HEADER + TABLE ---------------- */
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Product Setup Management</h1>
              <p className="text-gray-600">Create, edit and manage product setups</p>
            </div>

            <Button onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
              <Button
                variant="link"
                onClick={fetchProducts}
                className="ml-2 text-red-700 underline"
              >
                Try again
              </Button>
            </div>
          )}

          {/* Table */}
          <Card className="bg-white shadow-sm border-0">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Products</h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No products found. Click "Add Product" to create one.
                </div>
              ) : (
                <CustomTable data={products} columns={columns} />
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}