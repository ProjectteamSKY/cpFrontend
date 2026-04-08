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
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";

import {
    getProductAttributes,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
    activateProductAttribute,
    deactivateProductAttribute,
    getProductAttributesall,
} from "../../service/productAttributeApiService";

import { ProductAttribute } from "../../types/productAttribute";
import { ProductAttributeForm } from "../forms/ProductAttributeForm";

export function ProductAttributeManagement({ productId }: { productId: string }) {
    const [data, setData] = useState<ProductAttribute[]>([]);
    const [editing, setEditing] = useState<ProductAttribute | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const fetchData = async () => {
        const res = await getProductAttributesall();
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, [productId]);

    const handleSave = async (form: any) => {
        try {
            if (editing) {
                await updateProductAttribute(editing.id, form);
                toast.success("Updated successfully");
            } else {
                await createProductAttribute(form);
                toast.success("Created successfully");
            }
            setShowAdd(false);
            setShowEdit(false);
            setEditing(null);
            fetchData();
        } catch {
            toast.error("Error saving");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete?")) return;
        await deleteProductAttribute(id);
        fetchData();
    };

    const toggle = async (row: ProductAttribute) => {
        if (row.is_active) {
            await deactivateProductAttribute(row.id);
        } else {
            await activateProductAttribute(row.id);
        }
        fetchData();
    };

    const columns: ColumnDef<ProductAttribute>[] = [
        {
            header: "Product",
            accessorKey: "product_name",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    {row.original.product_name || "-"}
                </span>
            ),
        },

        {
            header: "Attribute",
            accessorKey: "attribute_name",
            cell: ({ row }) => (
                <span className="text-gray-700">
                    {row.original.attribute_name || "-"}
                </span>
            ),
        },

        {
            header: "Sort",
            accessorKey: "sort_order",
        },

        {
            header: "Required",
            cell: ({ row }) => (
                <span
                    className={`text-xs px-2 py-1 rounded-full ${row.original.is_required
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {row.original.is_required ? "Required" : "Optional"}
                </span>
            ),
        },

        {
            header: "Status",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toggle(item)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${item.is_active ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${item.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>

                        <span className="text-sm">
                            {item.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>
                );
            },
        },

        {
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setEditing(item);
                                setShowEdit(true);
                            }}
                        >
                            <Edit className="w-4 h-4 text-[#D73D32]" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Product Attributes</h2>

                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Attribute</DialogTitle>
                        </DialogHeader>
                        <ProductAttributeForm
                            onSubmit={handleSave}
                            onCancel={() => setShowAdd(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CustomTable data={data} columns={columns} />
            </Card>

            {/* Edit */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Attribute</DialogTitle>
                    </DialogHeader>
                    <ProductAttributeForm
                        defaultValues={editing}
                        onSubmit={handleSave}
                        onCancel={() => setShowEdit(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}