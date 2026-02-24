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
    getAllProductVariantPrices,
    createProductVariantPrice,
    updateProductVariantPrice,
    deleteProductVariantPrice,
} from "../../service/productVariantPriceApiService";

import { ProductVariantPrice, ProductVariantPriceFormData } from "../../types/productVariantPrice";
import { ProductVariantPriceForm } from "../forms/ProductVariantPriceForm";

export function ProductVariantPriceManagement() {
    const [prices, setPrices] = useState<ProductVariantPrice[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingPrice, setEditingPrice] = useState<ProductVariantPrice | null>(null);

    const fetchPrices = async () => {
        const data = await getAllProductVariantPrices();
        setPrices(data);
    };

    useEffect(() => { fetchPrices(); }, []);

    const handleSave = async (data: ProductVariantPriceFormData) => {
        if (editingPrice) {
            await updateProductVariantPrice(editingPrice.id, data);
        } else {
            await createProductVariantPrice(data);
        }
        setShowAddDialog(false);
        setShowEditDialog(false);
        setEditingPrice(null);
        fetchPrices();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this price?")) return;
        await deleteProductVariantPrice(id);
        fetchPrices();
    };

    const columns: ColumnDef<ProductVariantPrice>[] = [
        { header: "Variant", accessorKey: "variant_name" },
        { header: "Min Qty", accessorKey: "min_qty" },
        { header: "Max Qty", accessorKey: "max_qty" },
        { header: "Price", accessorKey: "price" },
        { header: "Discount", accessorKey: "discount_name" },
        {
            header: "Status",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex items-center gap-3">
                        {/* Toggle Button */}
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    // toggle is_active
                                    await updateProductVariantPrice(item.id, {
                                        ...item,
                                        is_active: !item.is_active,
                                    });

                                    // refresh the prices list
                                    await fetchPrices();
                                } catch (error) {
                                    console.error("Failed to toggle status", error);
                                }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${item.is_active ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${item.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>

                        {/* Status Text */}
                        <span className="text-sm">
                            {item.is_active }
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingPrice(row.original); setShowEditDialog(true); }}>
                        <Edit className="w-4 h-4 text-[#D73D32]" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="w-4 h-4 text-[#D73D32]" />
                    </Button>
                </div>
            ),
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Variant Price Management</h1>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1A1A1A] text-white">
                            <Plus className="w-4 h-4 mr-2" /> Add Price
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Product Variant Price</DialogTitle></DialogHeader>
                        <ProductVariantPriceForm onSubmit={handleSave} onCancel={() => setShowAddDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white shadow-sm border-0">
                <CustomTable data={prices} columns={columns} />
            </Card>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Product Variant Price</DialogTitle></DialogHeader>
                    <ProductVariantPriceForm
                        key={editingPrice?.id || "new"}
                        defaultValues={editingPrice}
                        onSubmit={handleSave}
                        onCancel={() => { setShowEditDialog(false); setEditingPrice(null); }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}