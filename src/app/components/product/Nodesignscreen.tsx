// NoDesignScreen.tsx
import {
    ArrowRight, X, Sparkles, FileText, Image,
    CheckCircle2, AlertCircle, Upload, Trash2
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Product } from "../../types/productlist";
import { fmt } from "./Configurepanel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface NoDesignFormData {
    name: string;
    phone: string;
    email: string;
    designNotes: string;
    hasLogo: boolean;
    logoNotes: string;
    logoFile?: File;
    logoPreview?: string;
}

export interface NoDesignScreenProps {
    open: boolean;
    onClose: () => void;
    product: Product;
    selectedAttributes: Record<string, string>; // Dynamic attributes
    sidesMultiplier: number; // Dynamic number of sides
    selectedTierLabel: string;
    total: number;
    userId?: string;
    selectedVariant: {
        id: string;
        name: string;
        prices: Array<{
            min_qty: number;
            max_qty?: number;
            price: number;
            id?: string;
        }>;
    } | null;
    selectedQuantity: string;
    onSubmit: (data: NoDesignFormData) => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function NoDesignScreen({
    open,
    onClose,
    product,
    selectedAttributes,
    sidesMultiplier,
    selectedTierLabel,
    total,
    userId,
    selectedVariant,
    selectedQuantity,
    onSubmit,
}: NoDesignScreenProps) {

    const [form, setForm] = useState<NoDesignFormData>({
        name: "",
        phone: "",
        email: "",
        designNotes: "",
        hasLogo: false,
        logoNotes: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof NoDesignFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        if (open) {
            setSubmitted(false);
            setErrors({});
            setApiError(null);
            setForm({
                name: "",
                phone: "",
                email: "",
                designNotes: "",
                hasLogo: false,
                logoNotes: "",
            });
        }
    }, [open]);

    const setField = (field: keyof NoDesignFormData, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (apiError) setApiError(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof NoDesignFormData, string>> = {};

        if (!form.name.trim()) newErrors.name = "Name is required";

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(form.phone)) newErrors.phone = "Enter valid 10-digit phone number";

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = "Invalid email address";

        if (!form.designNotes.trim()) {
            newErrors.designNotes = "Design brief is required";
        } else if (form.designNotes.length < 10) {
            newErrors.designNotes = "Please provide at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitToAPI = async (formData: NoDesignFormData) => {
        const fd = new FormData();

        // User details
        fd.append("user_id", userId || "guest");
        fd.append("name", formData.name);
        fd.append("phone", formData.phone);
        fd.append("email", formData.email || "");

        // Product details
        fd.append("product_id", product.id || "");
        fd.append("product_name", product.name);

        // Variant and pricing
        const variantId = selectedVariant?.id || "";
        fd.append("variant_id", variantId);
        fd.append("variant_name", selectedVariant?.name || "");

        // Find price ID from selected quantity tier
        const priceTier = selectedVariant?.prices?.find((p) => {
            if (selectedQuantity === String(p.min_qty)) return true;
            if (p.id === selectedQuantity) return true;
            return false;
        });
        
        fd.append("product_variant_price_id", priceTier?.id || "");
        fd.append("selected_quantity", selectedQuantity);

        // Configuration details - dynamic sides multiplier
        fd.append("sides_multiplier", String(sidesMultiplier));
        fd.append("total_price", String(total));

        // Add all dynamic attributes
        Object.entries(selectedAttributes).forEach(([key, value]) => {
            fd.append(`attribute_${key.toLowerCase().replace(/\s/g, "_")}`, value);
        });

        // Design brief
        fd.append("design_notes", formData.designNotes);
        fd.append("has_logo", String(formData.hasLogo));
        
        if (formData.logoNotes) {
            fd.append("logo_notes", formData.logoNotes);
        }

        // Logo file
        if (formData.hasLogo && formData.logoFile) {
            fd.append("logo_file", formData.logoFile);
        }

        const response = await fetch("http://127.0.0.1:8000/api/design_request/create", {
            method: "POST",
            body: fd,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to submit design request");
        }

        return response.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setApiError(null);

        try {
            await submitToAPI(form);
            onSubmit(form);
            setSubmitted(true);
        } catch (err: any) {
            setApiError(err.message || "Something went wrong. Please try again.");
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setApiError("Logo file size should be less than 5MB");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            setApiError("Please upload JPEG, PNG, JPG, or SVG file");
            return;
        }

        const preview = URL.createObjectURL(file);
        setField("logoFile", file);
        setField("logoPreview", preview);
    };

    const removeLogo = () => {
        if (form.logoPreview) URL.revokeObjectURL(form.logoPreview);
        setField("logoFile", undefined);
        setField("logoPreview", undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const inputClass = (hasError?: boolean) =>
        `w-full h-10 px-3 border rounded-xl text-sm text-neutral-900 
        focus:outline-none focus:ring-2 transition-all bg-white placeholder:text-neutral-400
        ${hasError
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-neutral-200 focus:border-[#D73D32] focus:ring-[#D73D32]/20"
        }`;

    const textareaClass = (hasError?: boolean) =>
        `w-full px-3 py-2.5 border rounded-xl text-sm text-neutral-900 
        focus:outline-none focus:ring-2 transition-all bg-white placeholder:text-neutral-400 resize-none
        ${hasError
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-neutral-200 focus:border-[#D73D32] focus:ring-[#D73D32]/20"
        }`;

    // Generate side label dynamically
    const getSidesLabel = () => {
        if (sidesMultiplier === 1) return "Single Sided";
        if (sidesMultiplier === 2) return "Double Sided";
        return `${sidesMultiplier}-Sided`;
    };

    // Build configuration items dynamically
    const configItems = [
        { label: "Product", value: product.name },
        ...Object.entries(selectedAttributes).map(([key, value]) => ({ label: key, value })),
        { label: "Sides", value: `${getSidesLabel()} (×${sidesMultiplier} multiplier)` },
        { label: "Quantity", value: selectedTierLabel },
        { label: "Total", value: `₹${fmt(total)}` },
    ];

    function toggleLogoStatus(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        const nextValue = !form.hasLogo;
        if (!nextValue) {
            removeLogo();
        }
        setField("hasLogo", nextValue);
    }

    return (
        <div
            className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-neutral-100"
                style={{ background: "#D73D32" }}
            >
                <div>
                    <h3 className="text-base font-bold text-white">Order Without Design</h3>
                    <p className="text-xs text-white/60 mt-0.5">Our team will create your design</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {submitted ? (
                <div className="flex flex-col items-center justify-center flex-1 px-6 gap-5 text-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg"
                        style={{ background: "#D73D32" }}
                    >
                        ✓
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-neutral-900">Request Received!</h4>
                        <p className="text-sm text-neutral-500 mt-2 max-w-xs">
                            Our design team will reach out within 24 hours via WhatsApp or email to craft your perfect design.
                        </p>
                    </div>
                    <div className="w-full max-w-xs space-y-2 text-left rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs">
                        <p className="font-semibold text-neutral-600">What happens next?</p>
                        {["We review your brief", "Designer creates a draft", "You approve or request changes", "We print & deliver"].map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#D73D32" }}>{i + 1}</span>
                                <span className="text-neutral-600">{s}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: "#D73D32" }}
                        className="w-full max-w-xs h-12 rounded-2xl text-white font-bold text-sm"
                    >
                        Done
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* LEFT COLUMN - Configuration Summary (Dynamic) */}
                            <div className="lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-neutral-100 bg-neutral-50/30 p-5">
                                <div className="sticky top-0 lg:top-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-4 h-4 text-[#D73D32]" />
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            Your Configuration
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                                        {configItems.map((item, idx) => (
                                            <div
                                                key={item.label}
                                                className={`flex justify-between items-center px-4 py-3 ${idx !== configItems.length - 1 ? "border-b border-neutral-50" : ""
                                                    }`}
                                            >
                                                <span className="text-xs text-neutral-500">{item.label}</span>
                                                <span className={`text-xs font-semibold text-neutral-800 text-right ${item.label === "Total" ? "text-[#D73D32] text-sm" : ""
                                                    }`}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <div className="flex gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700">
                                                <span className="font-semibold">Pro tip:</span> Add specific details about your brand colors and logo placement for faster turnaround.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN - Form Fields */}
                            <div className="flex-1 p-5 lg:p-6">
                                <div className="max-w-3xl mx-auto">
                                    {apiError && (
                                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-red-600 font-medium">Submission Error</p>
                                                <p className="text-xs text-red-500 mt-0.5">{apiError}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setApiError(null)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Contact Details */}
                                    <div className="mb-8">
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                            Contact Details
                                        </p>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                    Full Name <span className="text-[#D73D32]">*</span>
                                                </label>
                                                <input
                                                    required
                                                    className={inputClass(!!errors.name)}
                                                    placeholder="Enter your full name"
                                                    value={form.name}
                                                    onChange={(e) => setField("name", e.target.value)}
                                                    disabled={isSubmitting}
                                                />
                                                {errors.name && (
                                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                        Phone Number <span className="text-[#D73D32]">*</span>
                                                    </label>
                                                    <input
                                                        required
                                                        type="tel"
                                                        className={inputClass(!!errors.phone)}
                                                        placeholder="9876543210"
                                                        value={form.phone}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                            setField("phone", value);
                                                        }}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.phone && (
                                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.phone}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-neutral-400 mt-1">Enter 10-digit mobile number</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className={inputClass(!!errors.email)}
                                                        placeholder="you@example.com"
                                                        value={form.email}
                                                        onChange={(e) => setField("email", e.target.value)}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.email && (
                                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-neutral-400 mt-1">Optional, but recommended for design updates</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Design Brief */}
                                    <div>
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                            Design Brief
                                        </p>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                    What should appear on your {product.name}? <span className="text-[#D73D32]">*</span>
                                                </label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    className={textareaClass(!!errors.designNotes)}
                                                    placeholder={`Example: Business name "Priya's Bakery", tagline "Fresh Daily", phone number 9876543210, website www.priyasbakery.com, logo at top-right corner...`}
                                                    value={form.designNotes}
                                                    onChange={(e) => setField("designNotes", e.target.value)}
                                                    disabled={isSubmitting}
                                                />
                                                {errors.designNotes && (
                                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.designNotes}
                                                    </p>
                                                )}
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Include text content, placement preferences, and any specific requirements
                                                </p>
                                            </div>

                                            {/* Logo Section */}
                                            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                                                <div className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#D73D32]/10 flex items-center justify-center">
                                                            <Image className="w-5 h-5 text-[#D73D32]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-neutral-800">Do you have a logo?</p>
                                                            <p className="text-xs text-neutral-500 mt-0.5">We'll use it in your design</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={toggleLogoStatus}
                                                        disabled={isSubmitting}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 
                                                            ${form.hasLogo ? "bg-green-500" : "bg-gray-300"}
                                                            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 
                                                                ${form.hasLogo ? "translate-x-6" : "translate-x-1"}`}
                                                        />
                                                    </button>
                                                </div>

                                                {form.hasLogo && (
                                                    <div className="border-t border-neutral-100 p-4 space-y-4 bg-neutral-50/50">
                                                        <div>
                                                            <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                                Upload Logo
                                                            </label>
                                                            {!form.logoPreview ? (
                                                                <div
                                                                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                                                    className={`border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center 
                                                                        ${!isSubmitting ? "cursor-pointer hover:border-[#D73D32] hover:bg-white" : "cursor-not-allowed opacity-50"} 
                                                                        transition-all`}
                                                                >
                                                                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                                                    <p className="text-sm text-neutral-600 mb-1">Click to upload your logo</p>
                                                                    <p className="text-xs text-neutral-400">PNG, JPG, or SVG (max 5MB)</p>
                                                                </div>
                                                            ) : (
                                                                <div className="relative">
                                                                    <div className="border rounded-xl p-4 bg-white">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-16 h-16 rounded-lg border border-neutral-200 flex items-center justify-center bg-neutral-50">
                                                                                <img
                                                                                    src={form.logoPreview}
                                                                                    alt="Logo preview"
                                                                                    className="max-w-full max-h-full object-contain"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-sm font-medium text-neutral-700">
                                                                                    {form.logoFile?.name}
                                                                                </p>
                                                                                <p className="text-xs text-neutral-400">
                                                                                    {(form.logoFile?.size || 0) / 1024 < 1024
                                                                                        ? `${((form.logoFile?.size || 0) / 1024).toFixed(1)} KB`
                                                                                        : `${((form.logoFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB`
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={removeLogo}
                                                                                disabled={isSubmitting}
                                                                                className="p-2 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                                                                onChange={handleLogoUpload}
                                                                className="hidden"
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                                                Logo Placement & Notes
                                                            </label>
                                                            <textarea
                                                                rows={2}
                                                                className={textareaClass()}
                                                                placeholder="Example: Logo at top-center, prefer transparent background, high-res PNG available..."
                                                                value={form.logoNotes}
                                                                onChange={(e) => setField("logoNotes", e.target.value)}
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    style={{ background: "#D73D32" }}
                                                    className={`w-full h-12 rounded-2xl text-white font-bold text-sm
                                                           flex items-center justify-center gap-2.5 transition-all
                                                           ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"}`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Design Request
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                                <div className="flex items-center justify-center gap-2 mt-3">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    <p className="text-center text-[10px] text-neutral-400">
                                                        No payment required now — we'll confirm details before processing
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}