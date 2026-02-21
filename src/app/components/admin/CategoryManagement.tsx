import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
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
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    deactivateCategory,
    activateCategory,
} from "../../service/categoryApiService";

import { Category } from "../../types/category";
import { CategoryForm } from "../forms/CategoryForm";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../common/CustomTable";
import { useNavigate } from "react-router-dom";

export function  CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);

    const navigate = useNavigate();

    console.log("editcategory @@@@@@@@@@@@@@@@@@@@@@@@@@", editingCategory?.id);
    console.log("editcategory @@@@@@@@@@@@@@@@@@@@@@@@@@", editingCategory);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ---------- Save Handler ---------- */

    const handleSave = async (data: any) => {
        if (editingCategory) {
            await updateCategory(editingCategory.id, data);
        } else {
            await createCategory(data);
        }

        setShowAddDialog(false);
        setShowEditDialog(false);
        setEditingCategory(null);
        fetchCategories();
    };

    /* ---------- Edit ---------- */

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowEditDialog(true);
    };

    /* ---------- Delete ---------- */

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?"))
            return;

        await deleteCategory(id);
        fetchCategories();
    };

    /* ---------- Toggle ---------- */

    const toggleStatus = async (category: Category) => {
        await toggleCategoryStatus(category.id, !category.is_active); // switches automatically
        fetchCategories(); // refresh list
    };

    // activate button
    const activate = async (category: Category) => {
        await activateCategory(category.id);
        fetchCategories();
    };

    // deactivate button
    const deactivate = async (category: Category) => {
        await deactivateCategory(category.id);
        fetchCategories();
    };

    const handleSubcategory = (category: Category) => {
        navigate("/admin/SubCategory", { state: { categoryId: category.id } });
    };

    const columns: ColumnDef<Category>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.name}
                </span>
            ),
        },

        {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
                <span className="text-gray-600">
                    {row.original.description || "-"}
                </span>
            ),
        },

        {
            header: "Status",
            cell: ({ row }) => {
                const cat = row.original;

                return (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    // call the correct endpoint based on current status
                                    if (cat.is_active) {
                                        // currently active → deactivate
                                        await deactivateCategory(cat.id);
                                    } else {
                                        // currently inactive → activate
                                        await activateCategory(cat.id);
                                    }

                                    // refresh the categories list
                                    fetchCategories();
                                } catch (error) {
                                    console.error("Failed to toggle category status", error);
                                }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${cat.is_active ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${cat.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>

                        <span className="text-sm">
                            {cat.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "View Subcategory",
            cell: ({ row }) => {
                const cat = row.original;

                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleSubcategory(cat)}>
                            <Eye className="w-4 h-4 text-[#D73D32]" />
                        </Button>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const cat = row.original;

                return (
                    <div className="flex gap-2">

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(cat)}
                        >
                            <Edit className="w-4 h-4 text-[#D73D32]" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat.id)}
                        >
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
                    <h1 className="text-3xl items-center font-bold text-[#1A1A1A] mb-2">
                        Category Management
                    </h1>
                    <p className="text-gray-600">
                        Create, edit, activate and manage categories
                    </p>
                </div>

                {/* Add Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1A1A1A] hover:bg-[#1A1A11A]/90 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                                Add Category
                            </DialogTitle>
                        </DialogHeader>

                        <CategoryForm
                            onSubmit={handleSave}
                            onCancel={() => setShowAddDialog(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <Card className="bg-white shadow-sm border-0">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">All Categories</h2>
                </div>

                <div className="overflow-x-auto">
                    <CustomTable
                        data={categories}
                        columns={columns}
                    />
                </div>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md bg-white" aria-describedby="category-dialog-description"
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Edit Category
                        </DialogTitle>
                    </DialogHeader>

                    <CategoryForm
                        key={editingCategory?.id || "new"}
                        defaultValues={editingCategory}
                        onSubmit={handleSave}
                        onCancel={() => {
                            setShowEditDialog(false);
                            setEditingCategory(null);
                        }}
                    />

                </DialogContent>
            </Dialog>
        </div>
    );
}

