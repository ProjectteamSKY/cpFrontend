import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { CustomTable } from "../common/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";

import {
  getAllAttributeValues,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  activateAttributeValue,
  deactivateAttributeValue,
} from "../../service/attributeValueApiService";

import { getAllAttributes } from "../../service/attributeApiService";
import { AttributeValue } from "../../types/attributeValue";
import { Attribute } from "../../types/attribute";
import { AttributeValueForm } from "../forms/AttributeValueForm";

export function AttributeValueManagement() {
  const [values, setValues] = useState<AttributeValue[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const attributeId = searchParams.get("attribute_id");

  const fetchData = async () => {
    const [vals, attrs] = await Promise.all([
      getAllAttributeValues(),
      getAllAttributes(),
    ]);

    let filtered = vals;

    if (attributeId) {
      filtered = vals.filter(
        (v: any) => v.attribute_id === attributeId
      );
    }

    setValues(filtered);
    setAttributes(attrs);
  };

  useEffect(() => {
    fetchData();
  }, [attributeId]);

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await updateAttributeValue(editing.id, data);
        toast.success("Updated successfully");
      } else {
        await createAttributeValue(data);
        toast.success("Created successfully");
      }
      setOpen(false);
      setEditing(null);
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Error");
    }
  };

  const toggleStatus = async (row: AttributeValue) => {
    if (row.is_active) {
      await deactivateAttributeValue(row.id);
    } else {
      await activateAttributeValue(row.id);
    }
    fetchData();
  };

  const columns: ColumnDef<AttributeValue>[] = [
    { header: "Attribute", accessorKey: "attribute_name" },
    { header: "Value", accessorKey: "value" },
    {
      header: "Status",
      cell: ({ row }) => {
        const v = row.original;
        return (
          <button onClick={() => toggleStatus(v)}>
            {v.is_active ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => { setEditing(v); setOpen(true); }}>
              <Edit size={16} />
            </Button>
            <Button onClick={() => deleteAttributeValue(v.id).then(fetchData)}>
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          {attributeId ? "Filtered Attribute Values" : "Attribute Values"}
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2" /> Add Value
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Value</DialogTitle>
            </DialogHeader>

            <AttributeValueForm
              attributes={attributes}
              defaultValues={editing}
              onSubmit={handleSave}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CustomTable data={values} columns={columns} />
      </Card>
    </div>
  );
}