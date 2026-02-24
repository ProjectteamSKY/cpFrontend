import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";

import {
  getAllProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../service/productVariantApiService";

import {
  ProductVariant,
  ProductVariantFormData,
} from "../../types/productVariant";
import { ProductVariantForm } from "../forms/ProductVariantForm";

export function ProductVariantManagement() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<ProductVariant | null>(null);

  const fetchVariants = async () => {
    const data = await getAllProductVariants();
    setVariants(data);
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleSave = async (data: ProductVariantFormData) => {
    if (editingVariant) {
      await updateProductVariant(editingVariant.id, data);
    } else {
      await createProductVariant(data);
    }

    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingVariant(null);
    fetchVariants();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    await deleteProductVariant(id);
    fetchVariants();
  };

  const columns: ColumnDef<ProductVariant>[] = [
    {
      header: "Product",
      accessorKey: "product_name",
    },
    {
      header: "Size",
      accessorKey: "size_name",
    },
    {
      header: "Paper Type",
      accessorKey: "paper_type_name",
    },
    {
      header: "Print Type",
      accessorKey: "print_type_name",
    },
    {
      header: "Cut Type",
      accessorKey: "cut_type_name",
    },
    {
      header: "Orientation",
      accessorKey: "orientation",
    },
    {
      header: "Sides",
      cell: ({ row }) => row.original.sides ?? "-",
    },
    {
      header: "Two Side Cut",
      cell: ({ row }) =>
        row.original.two_side_cut ? "Yes" : "No",
    },
    {
      header: "Four Side Cut",
      cell: ({ row }) =>
        row.original.four_side_cut ? "Yes" : "No",
    },
    // {
    //   header: "Status",
    //   cell: ({ row }) =>
    //     row.original.is_active ? (
    //       <span className="text-green-600 font-medium">Active</span>
    //     ) : (
    //       <span className="text-red-500 font-medium">Inactive</span>
    //     ),
    // },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingVariant(row.original);
              setShowEditDialog(true);
            }}
          >
            <Edit className="w-4 h-4 text-[#D73D32]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4 text-[#D73D32]" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Product Variant Management
        </h1>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product Variant</DialogTitle>
            </DialogHeader>

            <ProductVariantForm
              onSubmit={handleSave}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-sm border-0">
        <CustomTable data={variants} columns={columns} />
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Variant</DialogTitle>
          </DialogHeader>

          <ProductVariantForm
            key={editingVariant?.id || "new"}
            defaultValues={editingVariant}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingVariant(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}