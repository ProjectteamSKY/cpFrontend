import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
import { toast } from "react-toastify";

import {
  getAllAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  activateAttribute,
  deactivateAttribute,
} from "../../service/attributeApiService";

import { Attribute } from "../../types/attribute";
import { AttributeForm } from "../forms/AttributeForm";

export function AttributeManagement() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [editing, setEditing] = useState<Attribute | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getAllAttributes();
      setAttributes(data);
    } catch {
      toast.error("Failed to fetch attributes");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await updateAttribute(editing.id, data);
        toast.success("Updated successfully");
      } else {
        await createAttribute(data);
        toast.success("Created successfully");
      }
      setShowDialog(false);
      setEditing(null);
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Error saving");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      await deleteAttribute(id);
      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleStatus = async (attr: Attribute) => {
    try {
      if (attr.is_active) {
        await deactivateAttribute(attr.id);
        toast.error("Attribute deactivated");
      } else {
        await activateAttribute(attr.id);
        toast.success("Attribute activated");
      }
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns: ColumnDef<Attribute>[] = [
    { header: "Name", accessorKey: "name" },

    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => row.original.description || "-",
    },

    {
      header: "Status",
      cell: ({ row }) => {
        const attr = row.original;
        return (
          <button
            onClick={() => toggleStatus(attr)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              attr.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {attr.is_active ? "Active" : "Inactive"}
          </button>
        );
      },
    },

    // ✅ NEW VALUES COLUMN (ICON)
    {
      header: "Values",
      cell: ({ row }) => {
        const attr = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            title="View Values"
            onClick={() =>
              navigate(`/admin/attribute-values?attribute_id=${attr.id}`)
            }
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
        );
      },
    },

    {
      header: "Actions",
      cell: ({ row }) => {
        const attr = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(attr);
                setShowDialog(true);
              }}
            >
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(attr.id)}
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attribute Management</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/attribute-values")}
          >
            Manage Values
          </Button>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}>
                <Plus className="mr-2 w-4 h-4" />
                Add Attribute
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit" : "Add"} Attribute
                </DialogTitle>
              </DialogHeader>

              <AttributeForm
                defaultValues={editing}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowDialog(false);
                  setEditing(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <CustomTable data={attributes} columns={columns} />
      </Card>
    </div>
  );
}