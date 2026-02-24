import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CustomTable } from "../common/CustomTable";
import { Product, ProductFormData } from "../../types/product";
import { ProductForm } from "../forms/ProductForm";
import { ColumnDef } from "@tanstack/react-table";

import { getAllProducts, createProduct, updateProduct, deleteProduct, activateProduct } from "../../service/productApiService";

export function ProductManagements() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (data: ProductFormData) => {
    console.log("api triggerd")
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      console.log("update the product api triggerd ")
    } else {
      await createProduct(data);
      console.log("create the product api triggerd ")

    }
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const toggleStatus = async (product: Product) => {
    await activateProduct(product.id);
    fetchProducts();
  };

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
            <span className="text-sm">{p.is_active ? "Active" : "Inactive"}</span>
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
            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
              <Trash2 className="w-4 h-4 text-[#D73D32]" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <CustomTable data={products} columns={columns} />
        </div>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            key={editingProduct?.id || "new"}
            defaultValues={editingProduct}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}