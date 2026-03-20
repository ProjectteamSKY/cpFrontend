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
import { CustomTable } from "../common/CustomTable";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { ColumnDef } from "@tanstack/react-table";
import {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} from "../../service/faqApiService";
import { FAQ, FAQFormData } from "../../types/faq";
import { FAQForm } from "../forms/FAQForm";

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  /* ─── FETCH ───────────────────────────────────── */
  const fetchFAQs = async () => {
    try {
      const data = await getAllFAQs();
      setFaqs(data);
    } catch {
      toast.error("Failed to fetch FAQs");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  /* ─── SAVE ───────────────────────────────────── */
  const handleSave = async (data: FAQFormData) => {
    try {
      if (editingFaq) {
        await updateFAQ(editingFaq.id, data);
        toast.success("FAQ updated successfully!");
      } else {
        await createFAQ(data);
        toast.success("FAQ created successfully!");
      }
      setShowAddDialog(false);
      setShowEditDialog(false);
      setEditingFaq(null);
      fetchFAQs();
    } catch (error: any) {
      toast.error(error.message || "Failed to save FAQ");
    }
  };

  /* ─── EDIT ───────────────────────────────────── */
  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setShowEditDialog(true);
  };

  /* ─── DELETE ─────────────────────────────────── */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await deleteFAQ(id);
      toast.success("FAQ deleted!");
      fetchFAQs();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  /* ─── TOGGLE ACTIVE ──────────────────────────── */
  const toggleStatus = async (faq: FAQ) => {
    try {
      setLoadingId(faq.id);
      await toggleFAQStatus(faq.id);
      toast.success("Status updated!");
      fetchFAQs();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  /* ─── TABLE COLUMNS ─────────────────────────── */
  const columns: ColumnDef<FAQ>[] = [
    {
      header: "Question",
      accessorKey: "question",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.question}</span>
      ),
    },
    {
      header: "Answer",
      accessorKey: "answer",
      cell: ({ row }) => (
        <span className="text-gray-600 line-clamp-2">{row.original.answer}</span>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.original.type;
        const colorMap: Record<string, string> = {
          category: "bg-blue-100 text-blue-700",
          product: "bg-purple-100 text-purple-700",
          general: "bg-gray-100 text-gray-600",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              colorMap[type] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {type}
          </span>
        );
      },
    },
    {
      header: "Sort",
      accessorKey: "sort_order",
      cell: ({ row }) => (
        <span className="text-gray-500 text-sm">{row.original.sort_order}</span>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const f = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              disabled={loadingId === f.id}
              onClick={() => toggleStatus(f)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                f.is_active ? "bg-green-500" : "bg-gray-300"
              } ${loadingId === f.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform bg-white rounded-full shadow transition-transform duration-200 ${
                  f.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium ${
                f.is_active ? "text-green-600" : "text-gray-400"
              }`}
            >
              {f.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const f = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(f)}>
              <Edit className="w-4 h-4 text-[#D73D32]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(f.id)}
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-500 mt-1">Manage your frequently asked questions</p>
        </div>

        {/* ADD */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#D73D32] hover:bg-[#c0342a] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg p-0 overflow-hidden">
            <FAQForm
              onSubmit={handleSave}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">All FAQs</h2>
          <span className="text-sm text-gray-400">{faqs.length} entries</span>
        </div>
        <CustomTable data={faqs} columns={columns} />
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <FAQForm
            key={editingFaq?.id}
            defaultValues={editingFaq}
            onSubmit={handleSave}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingFaq(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}