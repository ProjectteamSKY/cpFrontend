import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CustomTable } from "../common/CustomTable";

import { Size, SizeFormData } from "../../types/size";
import { SizeForm } from "../forms/SizeForm";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import {
  getAllSizes,
  createSize,
  updateSize,
  deleteSize,
  activateSize,
} from "../../service/sizeApiService";

export function SizeManagement() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const navigate = useNavigate();

  const fetchSizes = async () => {
    const data = await getAllSizes();
    setSizes(data);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  /* ---------- Save Handler ---------- */
  const handleSave = async (data: SizeFormData) => {
    if (editingSize) {
      await updateSize(editingSize.id, data);
    } else {
      await createSize(data);
    }
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingSize(null);
    fetchSizes();
  };

  /* ---------- Edit ---------- */
  const handleEdit = (size: Size) => {
    setEditingSize(size);
    setShowEditDialog(true);
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;
    await deleteSize(id);
    fetchSizes();
  };

  /* ---------- Toggle / Activate ---------- */
  const toggleStatus = async (size: Size) => {
    await activateSize(size.id);
    fetchSizes();
  };

  const columns: ColumnDef<Size>[] = [
    { header: "Name", accessorKey: "name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: "Width", accessorKey: "width", cell: ({ row }) => <span>{row.original.width}</span> },
    { header: "Height", accessorKey: "height", cell: ({ row }) => <span>{row.original.height}</span> },
    { header: "Unit", accessorKey: "unit", cell: ({ row }) => <span>{row.original.unit}</span> },
    { header: "Description", accessorKey: "description", cell: ({ row }) => <span>{row.original.description || "-"}</span> },
    {
      header: "Status",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleStatus(s)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                s.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  s.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm">{s.is_active ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Size Management</h1>
          <p className="text-gray-600">Create, edit, activate and manage sizes</p>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Size
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Size</DialogTitle>
            </DialogHeader>
            <SizeForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Sizes</h2>
        </div>
        <div className="overflow-x-auto">
          <CustomTable data={sizes} columns={columns} />
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Size</DialogTitle>
          </DialogHeader>
          <SizeForm
            key={editingSize?.id || "new"}
            defaultValues={editingSize}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingSize(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}