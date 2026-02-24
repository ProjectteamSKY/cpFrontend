import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";

import { ProductDiscount, ProductDiscountFormData } from "../../types/productDiscount";
import { ProductDiscountForm } from "../forms/ProductDiscountForm";
import { getAllProductDiscounts, createProductDiscount, updateProductDiscount, deleteProductDiscount ,activateProductDiscount} from "../../service/productDiscountApiService";

export function ProductDiscountManagement() {
    const [discounts, setDiscounts] = useState<ProductDiscount[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<ProductDiscount | null>(null);

    const fetchDiscounts = async () => {
        const data = await getAllProductDiscounts();
        setDiscounts(data);
    };

    useEffect(() => { fetchDiscounts(); }, []);

    const handleSave = async (data: ProductDiscountFormData) => {
        if (editingDiscount) {
            await updateProductDiscount(editingDiscount.id, data);
        } else {
            await createProductDiscount(data);
        }
        setShowAddDialog(false);
        setShowEditDialog(false);
        setEditingDiscount(null);
        fetchDiscounts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this discount?")) return;
        await deleteProductDiscount(id);
        fetchDiscounts();
    };

    const columns: ColumnDef<ProductDiscount>[] = [
        { header: "Product", accessorKey: "product_name" },
        { header: "Description", accessorKey: "description" },
        { header: "Discount", accessorKey: "discount" },
        { header: "Start Date", accessorKey: "start_date" },
        { header: "End Date", accessorKey: "end_date" },
        {
            header: "Status",
            cell: ({ row }) => {
                const discount = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleStatus(discount)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${discount.is_active ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${discount.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                        <span className="text-sm">{discount.is_active ? "Active" : "Inactive"}</span>
                    </div>
                );
            },
        }, {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingDiscount(row.original); setShowEditDialog(true); }}>
                        <Edit className="w-4 h-4 text-[#D73D32]" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="w-4 h-4 text-[#D73D32]" />
                    </Button>
                </div>
            )
        }
    ];
    const toggleStatus = async (discount: ProductDiscount) => {
        try {
            await activateProductDiscount(discount.id); // hits /activate endpoint
            // Optimistically update the UI
            setDiscounts(prev =>
                prev.map(d =>
                    d.id === discount.id ? { ...d, is_active: !d.is_active } : d
                )
            );
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Failed to toggle status. Try again.");
        }
    };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Discount Management</h1>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1A1A1A] text-white"><Plus className="w-4 h-4 mr-2" /> Add Discount</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Product Discount</DialogTitle></DialogHeader>
                        <ProductDiscountForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white shadow-sm border-0">
                <CustomTable data={discounts} columns={columns} />
            </Card>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Product Discount</DialogTitle></DialogHeader>
                    <ProductDiscountForm
                        key={editingDiscount?.id || "new"}
                        defaultValues={editingDiscount}
                        onSubmit={handleSave}
                        onCancel={() => { setShowEditDialog(false); setEditingDiscount(null); }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}