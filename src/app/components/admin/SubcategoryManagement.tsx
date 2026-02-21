import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  activateSubcategory,
  deactivateSubcategory,
} from "../../service/subcategoryApiService";

import { Subcategory, SubcategoryFormData } from "../../types/subcategory";
import { SubcategoryForm } from "../forms/SubcategoryForm";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { useLocation } from "react-router-dom";

interface Props {
  categoryId?: string; // optional filter by category
}

export function SubcategoryManagement({ categoryId }: Props) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);

  const location = useLocation();
  const id = categoryId || (location.state as any)?.categoryId;

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const data = await getAllSubcategories(id);
      setSubcategories(data);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [id]);

  /* ---------- Save Handler ---------- */
  const handleSave = async (data: SubcategoryFormData) => {
    try {
      if (editingSubcategory) {
        // Edit mode
        await updateSubcategory(editingSubcategory.id, data);
        setShowEditDialog(false);
        setEditingSubcategory(null);
      } else {
        // Create mode
        await createSubcategory({ ...data, category_id: id || "" });
        setShowAddDialog(false);
      }
      fetchSubcategories();
      alert("Subcategory saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save subcategory.");
    }
  };

  /* ---------- Edit ---------- */
  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setShowEditDialog(true);
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await deleteSubcategory(id);
      fetchSubcategories();
      alert("Subcategory deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete subcategory.");
    }
  };

  /* ---------- Toggle Status ---------- */
  const toggleStatus = async (subcategory: Subcategory) => {
    try {
      if (subcategory.is_active) {
        await deactivateSubcategory(subcategory.id);
      } else {
        await activateSubcategory(subcategory.id);
      }
      fetchSubcategories();
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  // Table columns
  const columns: ColumnDef<Subcategory>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.description || "-"}</span>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleStatus(sub)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                sub.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  sub.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm">{sub.is_active ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
              <Trash2 className="w-4 h-4 text-[#D73D32]" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            Subcategory Management
          </h1>
          <p className="text-gray-600">Manage subcategories of the selected category</p>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Subcategory
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Subcategory</DialogTitle>
            </DialogHeader>

            <SubcategoryForm
              defaultCategoryId={id}
              onSubmit={handleSave}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Subcategories Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Subcategories</h2>
        </div>

        <div className="overflow-x-auto">
          <CustomTable data={subcategories} columns={columns} />
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Subcategory</DialogTitle>
          </DialogHeader>

          <SubcategoryForm
            key={editingSubcategory?.id || "new"}
            defaultValues={editingSubcategory}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingSubcategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}