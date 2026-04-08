import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

import {
  getAllCutTypes,
  createCutType,
  updateCutType,
  deleteCutType,
  activateCutType,
  deactivateCutType,
} from "../../service/cutTypeApiService";

import { CutType } from "../../types/cutType";
import { CutTypeForm } from "../forms/CutTypeForm";

export function CutTypeManagement() {
  const [cutTypes, setCutTypes] = useState<CutType[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCutType, setEditingCutType] = useState<CutType | null>(null);

  const fetchCutTypes = async () => {
    try {
      const data = await getAllCutTypes();
      setCutTypes(data);
    } catch (error: any) {
      toast.error("Failed to fetch cut types");
    }
  };

  useEffect(() => {
    fetchCutTypes();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingCutType) {
        await updateCutType(editingCutType.id, data);
        toast.success("Cut type updated successfully!");
      } else {
        await createCutType(data);
        toast.success("Cut type created successfully!");
      }

      // Reset UI
      setShowAddDialog(false);
      setShowEditDialog(false);
      setEditingCutType(null);

      fetchCutTypes();
    } catch (error: any) {
      console.log("Full error:", error);

      // ✅ Extract correct backend message
      const errorMessage =
        error?.response?.data?.detail || // FastAPI format
        error?.response?.data?.message || // Other APIs
        error?.message ||
        "Failed to save cut type";

      toast.error(errorMessage);
    }
  };

  const handleEdit = (ct: CutType) => {
    setEditingCutType(ct);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cut type?")) return;
    try {
      await deleteCutType(id);
      toast.error("Cut type deleted successfully!");
      fetchCutTypes();
    } catch (error: any) {
      toast.error("Failed to delete cut type");
    }
  };

  const toggleStatus = async (ct: CutType) => {
    try {
      if (ct.is_active) {
        await deactivateCutType(ct.id);
        toast.error("Cut type deactivated successfully!");
      } else {
        await activateCutType(ct.id);
        toast.success("Cut type activated successfully!");
      }
      fetchCutTypes();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const columns: ColumnDef<CutType>[] = [
    { header: "Name", accessorKey: "name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: "Description", accessorKey: "description", cell: ({ row }) => <span className="text-gray-600">{row.original.description || "-"}</span> },
    {
      header: "Status",
      cell: ({ row }) => {
        const ct = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleStatus(ct)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${ct.is_active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${ct.is_active ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-sm">{ct.is_active ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const ct = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(ct)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(ct.id)}>
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Cut Type Management</h1>
          <p className="text-gray-600">Create, edit, activate and manage cut types</p>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Cut Type
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Cut Type</DialogTitle>
            </DialogHeader>

            <CutTypeForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Cut Types</h2>
        </div>
        <div className="overflow-x-auto">
          <CustomTable data={cutTypes} columns={columns} />
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Cut Type</DialogTitle>
          </DialogHeader>

          <CutTypeForm
            key={editingCutType?.id || "new"}
            defaultValues={editingCutType}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingCutType(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
