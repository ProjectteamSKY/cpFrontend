import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { Product, ProductFormData } from "../../types/product";
import { ProductForm } from "../forms/ProductForm";
import { ColumnDef } from "@tanstack/react-table";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  activateProduct,
  deactivateProduct,
} from "../../service/productApiService";

export function ProductManagements() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save Product (Add / Edit)
  const handleSave = async (
    data: ProductFormData & {
      existing_image_ids: string[];
      existing_related_image_ids: string[];
    }
  ) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data);
        toast.success("Product created successfully!");
      }

      setMode("list");
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    }
  };

  // Edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setMode("edit");
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  // Toggle Active Status
  const toggleStatus = async (product: Product) => {
    try {
      if (product.is_active) {
        await deactivateProduct(product.id);
        toast.success("Product deactivated successfully!");
      } else {
        await activateProduct(product.id);
        toast.success("Product activated successfully!");
      }

      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status");
    }
  };

  // Table Columns
  const columns: ColumnDef<Product>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Min Order", accessorKey: "min_order_qty" },
    { header: "Max Order", accessorKey: "max_order_qty" },
    {
      header: "Status",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleStatus(p)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${p.is_active ? "bg-green-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${p.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm">
              {p.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(p.id)}
            >
              <Trash2 className="w-4 h-4 text-[#D73D32]" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>

        {mode === "list" && (
          <Button
            className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white"
            onClick={() => {
              setEditingProduct(null);
              setMode("add");
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* FULL WIDTH FORM */}
      {(mode === "add" || mode === "edit") && (
        <Card className="p-6 space-y-6">

          {/* Title + Back */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h2>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setMode("list");
                setEditingProduct(null);
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>

          <ProductForm
            key={editingProduct?.id || "new"}
            defaultValues={editingProduct}
            onSubmit={handleSave}
            onCancel={() => {
              setMode("list");
              setEditingProduct(null);
            }}
          />
        </Card>
      )}

      {/* PRODUCT TABLE */}
      {mode === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <CustomTable data={products} columns={columns} />
          </div>
        </Card>
      )}

      <Toaster />
    </div>
  );
}
