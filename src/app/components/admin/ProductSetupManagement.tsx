import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus } from "lucide-react";

import { ProductResponse, ProductSetup, ProductSetupFormData } from "../../types/productSetup";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from "../../service/productSetupApiService";

import { ProductSetupForm } from "../forms/ProductSetupForm";
import { CustomTable } from "../common/CustomTable";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function ProductSetupManagement() {
  const [products, setProducts] = useState<ProductSetup[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  /* ---------------- Fetch ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getAllProducts();
      const data =
        Array.isArray(response) ? response : response?.products || [];

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    await deleteProduct(id);
    fetchProducts();
  };

  /* ---------------- Toggle Status ---------------- */
  const toggleStatus = async (product: ProductSetup) => {
    // call activate/deactivate API here if available
    console.log("Toggle status", product.id);
  };

  /* ---------------- Columns ---------------- */
  const columns: ColumnDef<ProductSetup>[] = [
    {
      header: "Product",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.name}
        </span>
      ),
    },

    {
      header: "Category",
      accessorKey: "category_name",
    },

    {
      header: "Subcategory",
      accessorKey: "subcategory_name",
    },

    // ================= VARIANT DETAILS =================

    {
      header: "Size",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant?.size_name ?? "N/A";
      },
    },

    {
      header: "Paper",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant?.paper_type_name ?? "N/A";
      },
    },

    {
      header: "Print",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant?.print_type_name ?? "N/A";
      },
    },

    {
      header: "Cut",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant?.cut_type_name ?? "N/A";
      },
    },

    {
      header: "Sides",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0];
        return variant?.sides ?? "N/A";
      },
    },

    {
      header: "2 Side Cut",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant
          ? variant.two_side_cut === 1
            ? "Yes"
            : "No"
          : "N/A";
      },
    },

    {
      header: "4 Side Cut",
      cell: ({ row }) => {
        const variant = row.original.variants?.[0] as any;
        return variant
          ? variant.four_side_cut === 1
            ? "Yes"
            : "No"
          : "N/A";
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
      header: "Max Qty",
      cell: ({ row }) => {
        const price = row.original.variants?.[0]?.prices?.[0];
        return price?.max_qty ?? "N/A";
      },
    },
     {
      header: "Price",
      cell: ({ row }) => {
        const price = row.original.variants?.[0]?.prices?.[0];
        return price?.price ?? "N/A";
      },
    },

    // ================= ACTIONS =================

    {
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(product.id)}
            >
              <Trash2 className="w-4 h-4 text-[#D73D32]" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {showForm ? (
        /* ---------------- ONLY FORM ---------------- */
        <>
          <div className="relative flex items-center mb-6">
            {/* Centered Title */}
            <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
              Add Product
            </h2>

            {/* Cancel Button on Right */}
            <div className="ml-auto">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>

          <ProductSetupForm onCancel={() => setShowForm(false)} />
        </>


      ) : (
        /* ---------------- HEADER + TABLE ---------------- */
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Product Setup Management
              </h1>
              <p className="text-gray-600">
                Create, edit and manage product setups
              </p>
            </div>

            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

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