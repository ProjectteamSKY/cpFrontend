import {
    ArrowLeft, X, Sparkles, FileText, Clock, CheckCircle2,
    AlertCircle, Image, RefreshCw, Eye, Download, MessageCircle,
    Package, Paintbrush, Printer, Truck, ChevronRight, Star
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DesignRequest {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    email: string;
    product_id: string;
    product_name: string;
    variant_id: string;
    product_variant_price_id: string;
    design_notes: string;
    logo_images: string; // JSON string array
    designed_images: string; // JSON string array
    status: "NEW" | "IN_PROGRESS" | "REVIEW" | "APPROVED" | "PRINTING" | "COMPLETED";
    is_approved: number;
    design_price: number;
    created_at: string;
    updated_at: string;
}

export interface DesignRequestTrackingProps {
    open: boolean;
    onClose: () => void;
    requestId: string;
    userId?: string;
    /** Base URL for media files e.g. "http://54.206.3.97/" */
    mediaBaseUrl?: string;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------
type StatusKey = DesignRequest["status"];

const STATUS_CONFIG: Record<StatusKey, {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    description: string;
}> = {
    NEW: {
        label: "Request Received",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <Clock className="w-4 h-4" />,
        description: "Your design request has been received. Our team will review it shortly.",
    },
    IN_PROGRESS: {
        label: "Design In Progress",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: <Paintbrush className="w-4 h-4" />,
        description: "Our designer is actively working on your design. Hang tight!",
    },
    REVIEW: {
        label: "Ready for Your Review",
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: <Eye className="w-4 h-4" />,
        description: "Your design is ready! Please review it and let us know if any changes are needed.",
    },
    APPROVED: {
        label: "Design Approved",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: "Design approved! Your order is being prepared for printing.",
    },
    PRINTING: {
        label: "Printing",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: <Printer className="w-4 h-4" />,
        description: "Your cards are being printed with premium quality.",
    },
    COMPLETED: {
        label: "Order Completed",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: <Package className="w-4 h-4" />,
        description: "Your order is complete and ready for dispatch!",
    },
};

const STATUS_ORDER: StatusKey[] = ["NEW", "IN_PROGRESS", "REVIEW", "APPROVED", "PRINTING", "COMPLETED"];

const STEP_LABELS: Record<StatusKey, string> = {
    NEW: "Received",
    IN_PROGRESS: "Designing",
    REVIEW: "Review",
    APPROVED: "Approved",
    PRINTING: "Printing",
    COMPLETED: "Done",
};

const STEP_ICONS: Record<StatusKey, React.ReactNode> = {
    NEW: <Clock className="w-3.5 h-3.5" />,
    IN_PROGRESS: <Paintbrush className="w-3.5 h-3.5" />,
    REVIEW: <Eye className="w-3.5 h-3.5" />,
    APPROVED: <CheckCircle2 className="w-3.5 h-3.5" />,
    PRINTING: <Printer className="w-3.5 h-3.5" />,
    COMPLETED: <Package className="w-3.5 h-3.5" />,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseJsonArray(raw: string): string[] {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: StatusKey }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

function ProgressStepper({ currentStatus }: { currentStatus: StatusKey }) {
    const currentIdx = STATUS_ORDER.indexOf(currentStatus);
    return (
        <div className="flex items-center w-full overflow-x-auto pb-1">
            {STATUS_ORDER.map((s, idx) => {
                const done = idx < currentIdx;
                const active = idx === currentIdx;
                const isLast = idx === STATUS_ORDER.length - 1;
                return (
                    <div key={s} className="flex items-center flex-shrink-0">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                    ${done
                                        ? "bg-[#D73D32] border-[#D73D32] text-white"
                                        : active
                                            ? "bg-white border-[#D73D32] text-[#D73D32]"
                                            : "bg-white border-neutral-200 text-neutral-400"
                                    }`}
                            >
                                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : STEP_ICONS[s]}
                            </div>
                            <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-[#D73D32]" : done ? "text-neutral-600" : "text-neutral-400"}`}>
                                {STEP_LABELS[s]}
                            </span>
                        </div>
                        {!isLast && (
                            <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 rounded-full transition-all ${done ? "bg-[#D73D32]" : "bg-neutral-200"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function ImageGallery({ images, title, mediaBase }: { images: string[]; title: string; mediaBase: string }) {
    const [selected, setSelected] = useState<string | null>(null);

    if (images.length === 0) return null;

    const toUrl = (path: string) => {
        const cleaned = path.replace(/\\/g, "/");
        return `${mediaBase}${cleaned}`;
    };

    return (
        <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">{title}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(toUrl(img))}
                        className="relative group aspect-square rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 cursor-pointer hover:border-[#D73D32] transition-all"
                    >
                        <img
                            src={toUrl(img)}
                            alt={`${title} ${i + 1}`}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f5f5f5'/%3E%3Ctext x='40' y='45' text-anchor='middle' fill='%23ccc' font-size='12'%3ENo Preview%3C/text%3E%3C/svg%3E`;
                            }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selected && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute -top-10 right-0 text-white/70 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img src={selected} alt="Preview" className="w-full rounded-2xl" />
                        <a
                            href={selected}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function DesignRequestTracking({
    open,
    onClose,
    requestId,
    userId,
    mediaBaseUrl = "http://54.206.3.97/",
}: DesignRequestTrackingProps) {
    const [request, setRequest] = useState<DesignRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [approving, setApproving] = useState(false);
    const [approveSuccess, setApproveSuccess] = useState(false);

    const fetchRequest = useCallback(async () => {
        if (!requestId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://54.206.3.97/api/design_request/${requestId}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const json = await res.json();
            setRequest(json.data || json);
            setLastRefreshed(new Date());
        } catch (err: any) {
            setError(err.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        if (open) {
            fetchRequest();
            setApproveSuccess(false);
        }
    }, [open, fetchRequest]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const handleApprove = async () => {
        if (!request) return;
        setApproving(true);
        try {
            const res = await fetch(`http://54.206.3.97/api/design_request/${request.id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
            });
            if (!res.ok) throw new Error("Approval failed");
            setApproveSuccess(true);
            await fetchRequest();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setApproving(false);
        }
    };

    const logoImages = request ? parseJsonArray(request.logo_images) : [];
    const designedImages = request ? parseJsonArray(request.designed_images) : [];
    const cfg = request ? STATUS_CONFIG[request.status] : null;

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
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 text-white" />
                    </button>
                    <div>
                        <h3 className="text-base font-bold text-white">Track Design Request</h3>
                        <p className="text-xs text-white/60 mt-0.5">
                            {request ? `ID: ${request.id.slice(0, 8).toUpperCase()}` : "Loading..."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchRequest}
                        disabled={loading}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 text-white ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                {/* Loading */}
                {loading && !request && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-10 h-10 border-3 border-[#D73D32] border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
                        <p className="text-sm text-neutral-500">Loading your request...</p>
                    </div>
                )}

                {/* Error */}
                {error && !request && (
                    <div className="flex flex-col items-center justify-center h-full px-6 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-neutral-800">Failed to load request</p>
                            <p className="text-sm text-neutral-500 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={fetchRequest}
                            style={{ background: "#D73D32" }}
                            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Content */}
                {request && cfg && (
                    <div className="max-w-2xl mx-auto p-5 space-y-6 pb-10">
                        {/* Refresh timestamp */}
                        {lastRefreshed && (
                            <p className="text-[10px] text-neutral-400 text-right">
                                Last updated: {formatDate(lastRefreshed.toISOString())}
                            </p>
                        )}

                        {/* Status Banner */}
                        <div className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center ${cfg.color}`}>
                                    {cfg.icon}
                                </div>
                                <div>
                                    <StatusBadge status={request.status} />
                                    <p className={`text-xs mt-1 ${cfg.color}`}>{cfg.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stepper */}
                        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Progress</p>
                            <ProgressStepper currentStatus={request.status} />
                        </div>

                        {/* Approve Button — shown only when in REVIEW state & not yet approved */}
                        {request.status === "REVIEW" && request.is_approved === 0 && !approveSuccess && (
                            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-4">
                                <div className="flex items-start gap-3">
                                    <Star className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-purple-800">Your design is ready for review!</p>
                                        <p className="text-xs text-purple-600 mt-1 mb-3">
                                            Please review the designed images below. If you're happy with them, approve to move to printing.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={handleApprove}
                                                disabled={approving}
                                                style={{ background: "#D73D32" }}
                                                className="flex-1 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                                            >
                                                {approving ? (
                                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Approving...</>
                                                ) : (
                                                    <><CheckCircle2 className="w-4 h-4" /> Approve Design</>
                                                )}
                                            </button>
                                            <a
                                                href={`https://wa.me/?text=Hi, I need changes to my design request ${request.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-purple-300 text-purple-700 hover:bg-purple-100 transition-colors"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Request Changes
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Approve success */}
                        {approveSuccess && (
                            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <p className="text-sm text-green-700 font-semibold">Design approved! Moving to printing soon.</p>
                            </div>
                        )}

                        {/* API Error inline */}
                        {error && request && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Designed Images */}
                        {designedImages.length > 0 && (
                            <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                                <ImageGallery images={designedImages} title="Your Design" mediaBase={mediaBaseUrl} />
                            </div>
                        )}

                        {/* No designs yet placeholder */}
                        {designedImages.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
                                <Paintbrush className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-neutral-500">Design not ready yet</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    {request.status === "NEW"
                                        ? "Our team will start working on it soon."
                                        : "We'll notify you when your design is ready for review."}
                                </p>
                            </div>
                        )}

                        {/* Request Details */}
                        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> Request Details
                            </p>
                            <div className="space-y-0">
                                {[
                                    { label: "Product", value: request.product_name },
                                    { label: "Name", value: request.name },
                                    { label: "Phone", value: request.phone },
                                    { label: "Email", value: request.email || "—" },
                                    { label: "Submitted", value: formatDate(request.created_at) },
                                    { label: "Last Updated", value: formatDate(request.updated_at) },
                                    ...(request.design_price > 0
                                        ? [{ label: "Design Fee", value: `₹${request.design_price.toFixed(2)}` }]
                                        : []),
                                ].map((item, idx, arr) => (
                                    <div
                                        key={item.label}
                                        className={`flex justify-between items-start py-2.5 ${idx !== arr.length - 1 ? "border-b border-neutral-50" : ""}`}
                                    >
                                        <span className="text-xs text-neutral-500 shrink-0 w-28">{item.label}</span>
                                        <span className="text-xs font-semibold text-neutral-800 text-right">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Design Notes */}
                        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Your Brief</p>
                            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{request.design_notes}</p>
                        </div>

                        {/* Uploaded Logo */}
                        {logoImages.length > 0 && (
                            <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                                <ImageGallery images={logoImages} title="Uploaded Logo" mediaBase={mediaBaseUrl} />
                            </div>
                        )}

                        {/* Help CTA */}
                        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#D73D32]/10 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-[#D73D32]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-neutral-800">Need help?</p>
                                    <p className="text-xs text-neutral-500">Contact us on WhatsApp for quick support</p>
                                </div>
                                <a
                                    href={`https://wa.me/?text=Hi, I need help with my design request ID: ${request.id.slice(0, 8).toUpperCase()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-[#D73D32] hover:underline shrink-0"
                                >
                                    Chat <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex gap-2">
                                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    <span className="font-semibold">Tip:</span> Pull-to-refresh or tap the refresh icon above to get the latest status update on your design.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}