import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

import {
  getAllPrintTypes,
  createPrintType,
  updatePrintType,
  deletePrintType,
  activatePrintType,
  deactivatePrintType,
} from "../../service/printTypeApiService";

import { PrintType } from "../../types/printType";
import { PrintTypeForm } from "../forms/PrintTypeForm";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";

export function PrintTypeManagement() {
  const [printTypes, setPrintTypes] = useState<PrintType[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPrintType, setEditingPrintType] = useState<PrintType | null>(null);

  const fetchPrintTypes = async () => {
    const data = await getAllPrintTypes();
    setPrintTypes(data);
  };

  useEffect(() => { fetchPrintTypes(); }, []);

  const handleSave = async (data: any) => {
    if (editingPrintType) await updatePrintType(editingPrintType.id, data);
    else await createPrintType(data);

    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingPrintType(null);
    fetchPrintTypes();
  };

  const handleEdit = (pt: PrintType) => { setEditingPrintType(pt); setShowEditDialog(true); };
  const handleDelete = async (id: string) => { if (!confirm("Delete this print type?")) return; await deletePrintType(id); fetchPrintTypes(); };
  const toggleStatus = async (pt: PrintType) => { pt.is_active ? await deactivatePrintType(pt.id) : await activatePrintType(pt.id); fetchPrintTypes(); };

  const columns: ColumnDef<PrintType>[] = [
    { header: "Name", accessorKey: "name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: "Description", accessorKey: "description", cell: ({ row }) => <span className="text-gray-600">{row.original.description || "-"}</span> },
    {
      header: "Status",
      cell: ({ row }) => {
        const pt = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleStatus(pt)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${pt.is_active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${pt.is_active ? "translate-x-6" : "translate-x-1"}`} />
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
            <Button variant="ghost" size="icon" onClick={() => handleEdit(pt)}><Edit className="w-4 h-4 text-[#D73D32]" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(pt.id)}><Trash2 className="w-4 h-4 text-[#D73D32]" /></Button>
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Print Type Management</h1>
          <p className="text-gray-600">Create, edit, activate and manage print types</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Print Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader><DialogTitle className="text-2xl font-bold">Add Print Type</DialogTitle></DialogHeader>
            <PrintTypeForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b"><h2 className="text-xl font-semibold">All Print Types</h2></div>
        <div className="overflow-x-auto"><CustomTable data={printTypes} columns={columns} /></div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-bold">Edit Print Type</DialogTitle></DialogHeader>
          <PrintTypeForm
            key={editingPrintType?.id || "new"}
            defaultValues={editingPrintType}
            onSubmit={handleSave}
            onCancel={() => { setShowEditDialog(false); setEditingPrintType(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}