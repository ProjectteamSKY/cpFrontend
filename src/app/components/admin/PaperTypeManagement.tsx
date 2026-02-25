import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

import {
  getAllPaperTypes,
  createPaperType,
  updatePaperType,
  deletePaperType,
  activatePaperType,
  deactivatePaperType,
} from "../../service/paperTypeApiService";

import { PaperType } from "../../types/paperType";
import { PaperTypeForm } from "../forms/PaperTypeForm";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { SizeManagement } from "./SizeManagement";

export function PaperTypeManagement() {
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPaperType, setEditingPaperType] = useState<PaperType | null>(null);

  const fetchPaperTypes = async () => {
    const data = await getAllPaperTypes();
    setPaperTypes(data);
  };

  useEffect(() => {
    fetchPaperTypes();
  }, []);

  /* ---------- Save Handler ---------- */
  const handleSave = async (data: any) => {
    if (editingPaperType) {
      await updatePaperType(editingPaperType.id, data);
    } else {
      await createPaperType(data);
    }
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingPaperType(null);
    fetchPaperTypes();
  };

  /* ---------- Edit ---------- */
  const handleEdit = (pt: PaperType) => {
    setEditingPaperType(pt);
    setShowEditDialog(true);
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paper type?")) return;
    await deletePaperType(id);
    fetchPaperTypes();
  };

  /* ---------- Toggle ---------- */
  const toggleStatus = async (pt: PaperType) => {
    if (pt.is_active) {
      await deactivatePaperType(pt.id);
    } else {
      await activatePaperType(pt.id);
    }
    fetchPaperTypes();
  };

  const columns: ColumnDef<PaperType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => <span className="text-gray-600">{row.original.description || "-"}</span>,
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const pt = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleStatus(pt)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                pt.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  pt.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm">{pt.is_active ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const pt = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(pt)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(pt.id)}>
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Paper Type Management</h1>
          <p className="text-gray-600">Create, edit, activate and manage paper types</p>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Paper Type
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Paper Type</DialogTitle>
            </DialogHeader>

            <PaperTypeForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Paper Types</h2>
        </div>
        <div className="overflow-x-auto">
          <CustomTable data={paperTypes} columns={columns} />
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Paper Type</DialogTitle>
          </DialogHeader>

          <PaperTypeForm
            key={editingPaperType?.id || "new"}
            defaultValues={editingPaperType}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingPaperType(null);
            }}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}