import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { DesignRequest, DesignFormData } from "../../types/design";
import { DesignForm } from "../forms/DesignForm";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import {
    getAllDesignRequests,
    createDesignRequest,
    deleteDesignRequest,
    approveDesignRequest,
    rejectDesignRequest,
    uploadDesignFiles,
    updateDesignStatus,
    editDesignRequest,
} from "../../service/Designapiservice";

export function DesignManagement() {
    const [designs, setDesigns] = useState<DesignRequest[]>([]);
    const [mode, setMode] = useState<"list" | "add" | "edit" | "view">("list");
    const [selectedDesign, setSelectedDesign] = useState<DesignRequest | null>(null);

    // Fetch Design Requests
    const fetchDesigns = async () => {
        try {
            const data = await getAllDesignRequests();
            setDesigns(data);
        } catch (error: any) {
            toast.error("Failed to fetch design requests");
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    // Save Design Request (Add / Edit)
    const handleSave = async (data: DesignFormData) => {
        try {
            if (selectedDesign) {
                await editDesignRequest(selectedDesign.id, data);
                toast.success("Design request updated successfully!");
            } else {
                await createDesignRequest(data);
                toast.success("Design request created successfully!");
            }

            setMode("list");
            setSelectedDesign(null);
            fetchDesigns();
        } catch (error: any) {
            toast.error(error.message || "Save failed");
        }
    };

    // Handle Design Upload
    const handleUploadDesigns = async (designId: string, files: File[]) => {
        try {
            await uploadDesignFiles(designId, files);
            toast.success("Design files uploaded successfully!");
            fetchDesigns();
        } catch (error: any) {
            toast.error(error.message || "Upload failed");
        }
    };

    // Edit
    const handleEdit = (design: DesignRequest) => {
        setSelectedDesign(design);
        setMode("edit");
    };

    // View Details
    const handleView = (design: DesignRequest) => {
        setSelectedDesign(design);
        setMode("view");
    };

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this design request?")) return;

        try {
            await deleteDesignRequest(id);
            toast.success("Design request deleted successfully!");
            fetchDesigns();
        } catch (error: any) {
            toast.error("Delete failed");
        }
    };

    // Toggle Approval Status
    const toggleApprovalStatus = async (design: DesignRequest) => {
        try {
            if (design.is_approved) {
                await rejectDesignRequest(design.id);
                toast.success("Design request rejected!");
            } else {
                await approveDesignRequest(design.id);
                toast.success("Design request approved!");
            }

            fetchDesigns();
        } catch (err: any) {
            toast.error(err.message || "Failed to toggle approval status");
        }
    };

    // Update Design Status
    const handleStatusChange = async (
        designId: string,
        newStatus: "NEW" | "IN_PROGRESS" | "DESIGN_COMPLETED" | "REJECTED"
    ) => {
        try {
            await updateDesignStatus(designId, newStatus);
            toast.success(`Design status updated to ${newStatus.replace("_", " ")}`);
            fetchDesigns();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    // Get Status Badge
    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { variant: any; color: string }> = {
            NEW: { variant: "default", color: "bg-blue-100 text-blue-800" },
            IN_PROGRESS: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
            DESIGN_COMPLETED: { variant: "secondary", color: "bg-green-100 text-green-800" },
            REJECTED: { variant: "destructive", color: "bg-red-100 text-red-800" },
        };

        const config = statusConfig[status] || statusConfig.NEW;
        return (
            <Badge className={config.color}>
                {status.replace("_", " ")}
            </Badge>
        );
    };

    // Table Columns
    const columns: ColumnDef<DesignRequest>[] = [
        { header: "Client Name", accessorKey: "name" },
        { header: "Product", accessorKey: "product_name" },
        { header: "Email", accessorKey: "email" },
        { header: "Phone", accessorKey: "phone" },
        {
            header: "Status",
            cell: ({ row }) => {
                const design = row.original;

                const statuses: Array<
                    "NEW" | "IN_PROGRESS" | "DESIGN_COMPLETED" | "APPROVED" | "REJECTED"
                > = [
                        "NEW",
                        "IN_PROGRESS",
                        "DESIGN_COMPLETED",
                        "APPROVED",
                        "REJECTED",
                    ];

                const handleChange = async (value: string) => {
                    await handleStatusChange(design.id, value);
                    await refetch();
                };

                return (
                    <div className="flex items-center gap-2">

                        {/* 🔥 APPROVED = BADGE (LOCKED STATE) */}
                        {design.status === "APPROVED" ? (
                            <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700 font-medium">
                                APPROVED
                            </span>
                        ) : (
                            /* 🔥 OTHER STATUSES = DROPDOWN */
                            <select
                                value={design.status}
                                onChange={(e) => handleChange(e.target.value)}
                                className="px-3 py-1 rounded-md border border-gray-300 text-sm bg-white hover:border-[#D73D32] focus:border-[#D73D32] focus:ring-1 focus:ring-[#D73D32] cursor-pointer transition-colors"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, " ")}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Approval",
            cell: ({ row }) => {
                const design = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-block h-3 w-3 rounded-full ${design.is_approved ? "bg-green-500" : "bg-gray-400"
                                }`}
                        />
                        <span className="text-sm font-medium">
                            {design.is_approved ? "Approved" : "Pending"}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const design = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(design)}
                            title="View Details"
                        >
                            <Eye className="w-4 h-4 text-[#D73D32]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(design)}
                            title="Edit"
                        >
                            <Edit className="w-4 h-4 text-[#D73D32]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(design.id)}
                            title="Delete"
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
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Design Requests Management</h1>

                
            </div>

            {/* FORM / VIEW MODES */}
            {(mode === "add" || mode === "edit" || mode === "view") && selectedDesign && mode !== "view" && (
                <Card className="p-6 space-y-6">
                    {/* Title + Back */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {mode === "add" ? "New Design Request" : "Edit Design Request"}
                        </h2>

                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                                setMode("list");
                                setSelectedDesign(null);
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Designs
                        </Button>
                    </div>

                    <DesignForm
                        key={selectedDesign?.id || "new"}
                        defaultValues={selectedDesign}
                        onSubmit={handleSave}
                        onCancel={() => {
                            setMode("list");
                            setSelectedDesign(null);
                        }}
                    />
                </Card>
            )}

            {/* VIEW MODE */}
            {mode === "view" && selectedDesign && (
                <Card className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">{selectedDesign.name}</h2>
                            <p className="text-gray-600 text-sm mt-1">{selectedDesign.product_name}</p>
                        </div>

                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                                setMode("list");
                                setSelectedDesign(null);
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>

                    {/* Client Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Client Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {selectedDesign.name}</p>
                                <p><span className="font-medium">Email:</span> {selectedDesign.email}</p>
                                <p><span className="font-medium">Phone:</span> {selectedDesign.phone}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Request Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Product:</span> {selectedDesign.product_name}</p>
                                <p><span className="font-medium">Status:</span> {getStatusBadge(selectedDesign.status)}</p>
                                <p><span className="font-medium">Approval:</span> {selectedDesign.is_approved ? "Approved" : "Pending"}</p>
                                <p><span className="font-medium">Design Price:</span> ₹{selectedDesign.design_price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Design Notes */}
                    {selectedDesign.design_notes && (
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Design Notes</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedDesign.design_notes}</p>
                        </div>
                    )}

                    {/* Logo Images */}
                    {selectedDesign.logo_images && selectedDesign.logo_images.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Logo Reference Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {selectedDesign.logo_images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`http://127.0.0.1:8000/${img}`}
                                        alt={`Logo ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Designed Images */}
                    {selectedDesign.designed_images && selectedDesign.designed_images.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Designed Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {selectedDesign.designed_images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`http://127.0.0.1:8000/${img}`}
                                        alt={`Design ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t pt-4 flex gap-3">
                        <Button
                            className="bg-[#D73D32] hover:bg-[#C83227] text-white"
                            onClick={() => {
                                setMode("edit");
                            }}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Request
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                handleDelete(selectedDesign.id);
                                setMode("list");
                                setSelectedDesign(null);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Request
                        </Button>
                    </div>
                </Card>
            )}

            {/* DESIGN TABLE */}
            {mode === "list" && (
                <Card>
                    <div className="overflow-x-auto">
                        <CustomTable data={designs} columns={columns} />
                    </div>
                </Card>
            )}

            <Toaster />
        </div>
    );
}