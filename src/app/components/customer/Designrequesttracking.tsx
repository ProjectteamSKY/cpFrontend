import {
    ArrowLeft, X, Sparkles, FileText, Clock, CheckCircle2,
    AlertCircle, Eye, Download, MessageCircle, ZoomIn,
    Package, Paintbrush, Printer, ChevronRight, Star, RefreshCw,
    ThumbsUp, ThumbsDown, User, Phone, Mail, ChevronLeft,
    ImageIcon, CalendarDays, BadgeIndianRupee,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface DesignedImageItem {
    images: string[];
    status: string;
    version: number;
    created_at: string;
}

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
    logo_images: string | string[];
    designed_images: string | string[] | DesignedImageItem[];
    status: "NEW" | "IN_PROGRESS" | "DESIGN_COMPLETED" | "APPROVED" | "REJECTED" | "PRINTING" | "COMPLETED";
    is_approved: number;
    design_price: number;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
    selected_attributes?: string;
    variant_price_id?: string;
    revision_count?: number;
}

export interface DesignRequestTrackingProps {
    open: boolean;
    onClose: () => void;
    requestId: string;
    userId?: string;
    mediaBaseUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
type StatusKey = DesignRequest["status"];

const BRAND = "#D73D32";

const STATUS_CFG: Record<StatusKey, {
    label: string;
    hex: string; bgHex: string; borderHex: string;
    icon: React.ReactNode; desc: string;
}> = {
    NEW: {
        label: "Request Received",
        hex: "#0369a1", bgHex: "#f0f9ff", borderHex: "#bae6fd",
        icon: <Clock className="w-4 h-4" />,
        desc: "Your request is received. Our team will start shortly.",
    },
    IN_PROGRESS: {
        label: "Design In Progress",
        hex: "#b45309", bgHex: "#fffbeb", borderHex: "#fde68a",
        icon: <Paintbrush className="w-4 h-4" />,
        desc: "Our designer is actively crafting your design. Hang tight!",
    },
    DESIGN_COMPLETED: {
        label: "Ready for Review",
        hex: "#6d28d9", bgHex: "#f5f3ff", borderHex: "#ddd6fe",
        icon: <Eye className="w-4 h-4" />,
        desc: "Your design is ready! Review the images and approve or request changes.",
    },
    APPROVED: {
        label: "Design Approved",
        hex: "#047857", bgHex: "#ecfdf5", borderHex: "#a7f3d0",
        icon: <CheckCircle2 className="w-4 h-4" />,
        desc: "Great! Your approved design is being prepared for printing.",
    },
    REJECTED: {
        label: "Changes Requested",
        hex: "#b91c1c", bgHex: "#fef2f2", borderHex: "#fecaca",
        icon: <ThumbsDown className="w-4 h-4" />,
        desc: "Changes noted. Our designer will revise and send it back soon.",
    },
    PRINTING: {
        label: "Printing",
        hex: "#c2410c", bgHex: "#fff7ed", borderHex: "#fed7aa",
        icon: <Printer className="w-4 h-4" />,
        desc: "Your cards are being printed with premium quality inks.",
    },
    COMPLETED: {
        label: "Order Completed",
        hex: "#0f766e", bgHex: "#f0fdfa", borderHex: "#99f6e4",
        icon: <Package className="w-4 h-4" />,
        desc: "Order complete and ready for dispatch. Thank you!",
    },
};

const STATUS_ORDER: StatusKey[] = ["NEW", "IN_PROGRESS", "DESIGN_COMPLETED", "APPROVED", "PRINTING", "COMPLETED"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function parseImages(raw: string | string[] | DesignedImageItem[]): string[] {
    if (!raw) return [];
    
    // If it's an array
    if (Array.isArray(raw)) {
        // Check if it's array of DesignedImageItem objects
        if (raw.length > 0 && typeof raw[0] === 'object' && 'images' in raw[0]) {
            // Get the latest version's images (assuming last item is latest or we want all)
            const latestItem = raw[raw.length - 1] as DesignedImageItem;
            return latestItem.images || [];
        }
        // If it's array of strings
        return raw as string[];
    }
    
    // If it's a JSON string
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                // Check if parsed is array of objects with images property
                if (parsed.length > 0 && typeof parsed[0] === 'object' && 'images' in parsed[0]) {
                    const latestItem = parsed[parsed.length - 1];
                    return latestItem.images || [];
                }
                return parsed;
            }
            return [];
        } catch {
            return [];
        }
    }
    
    return [];
}

function parseLogoImages(raw: string | string[]): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { 
        const p = JSON.parse(raw); 
        return Array.isArray(p) ? p : []; 
    } catch { 
        return []; 
    }
}

function toUrl(path: string, base: string): string {
    if (!path) return "";
    // Handle Windows backslashes
    const clean = path.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    return `${base.replace(/\/$/, "")}/${clean}`;
}

function fmtDate(iso: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────────────────────
function Lightbox({ images, index, mediaBase, onClose }: {
    images: string[]; index: number; mediaBase: string; onClose: () => void;
}) {
    const [cur, setCur] = useState(index);
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setCur(c => Math.max(0, c - 1));
            if (e.key === "ArrowRight") setCur(c => Math.min(images.length - 1, c + 1));
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [images.length, onClose]);

    const src = toUrl(images[cur], mediaBase);
    return (
        <div className="fixed inset-0 z-[99999] bg-black/93 flex items-center justify-center p-4" style={{ animation: 'drtFI 0.18s ease' }} onClick={onClose}>
            <div className="relative max-w-[min(88vw,680px)] w-full flex flex-col items-center gap-3.5" style={{ animation: 'drtSI 0.22s cubic-bezier(0.34,1.3,0.64,1)' }} onClick={e => e.stopPropagation()}>
                <button className="absolute -top-11 right-0 bg-white/10 border-none cursor-pointer w-8.5 h-8.5 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20" onClick={onClose}>
                    <X size={15} />
                </button>
                {cur > 0 && (
                    <button className="absolute top-1/2 -translate-y-1/2 left-[-52px] max-sm:left-0.5 bg-white/10 border-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20" onClick={() => setCur(c => c - 1)}>
                        <ChevronLeft size={19} />
                    </button>
                )}
                <img src={src} alt={`Design ${cur + 1}`} className="w-full rounded-xl object-contain max-h-[75vh] shadow-2xl" />
                {cur < images.length - 1 && (
                    <button className="absolute top-1/2 -translate-y-1/2 right-[-52px] max-sm:right-0.5 bg-white/10 border-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20" onClick={() => setCur(c => c + 1)}>
                        <ChevronRight size={19} />
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/45">{cur + 1} / {images.length}</span>
                    <a href={src} download target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-white/10 text-white text-xs font-semibold no-underline">
                        <Download size={12} /> Download
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Grid
// ─────────────────────────────────────────────────────────────────────────────
function ImageGrid({ images, mediaBase, emptyText }: {
    images: string[]; mediaBase: string; emptyText?: string;
}) {
    const [lbIdx, setLbIdx] = useState<number | null>(null);
    if (images.length === 0) return (
        <div className="flex flex-col items-center justify-center py-7.5 px-4 gap-1.5 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
            <ImageIcon size={26} color="#d4d4d0" />
            <p className="text-xs font-semibold text-stone-400">{emptyText ?? "No images yet"}</p>
        </div>
    );
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50 cursor-pointer relative transition-all hover:border-[#D73D32] hover:shadow-[0_0_0_3px_rgba(215,61,50,0.10)]" onClick={() => setLbIdx(i)}>
                        <img src={toUrl(img, mediaBase)} alt={`img-${i}`} className="w-full h-full object-contain p-1.5 block" />
                        <div className="absolute inset-0 bg-black/0 flex items-center justify-center transition-colors hover:bg-black/34">
                            <ZoomIn size={18} className="text-white opacity-0 transition-opacity hover:opacity-100" />
                        </div>
                    </div>
                ))}
            </div>
            {lbIdx !== null && (
                <Lightbox images={images} index={lbIdx} mediaBase={mediaBase} onClose={() => setLbIdx(null)} />
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Images Panel (reused in right sidebar + mobile section)
// ─────────────────────────────────────────────────────────────────────────────
function ImagesPanel({ designedImages, logoImages, mediaBase, status }: {
    designedImages: string[]; logoImages: string[];
    mediaBase: string; status: StatusKey;
}) {
    const cfg = STATUS_CFG[status];
    return (
        <div className="flex flex-col gap-5.5">
            {/* Designed images */}
            <div>
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bgHex, border: `1px solid ${cfg.borderHex}`, color: cfg.hex }}>
                        <Paintbrush size={14} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-stone-900 leading-tight">Your Design</p>
                        <p className="text-[10px] text-stone-400">
                            {designedImages.length} file{designedImages.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ImageGrid
                    images={designedImages}
                    mediaBase={mediaBase}
                    emptyText={status === "NEW" ? "Work starts soon…" : "Design in progress…"}
                />
            </div>

            {/* Logo / references */}
            {logoImages.length > 0 && (
                <>
                    <div className="h-px bg-stone-100" />
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-stone-50 border border-stone-200 text-stone-500">
                                <ImageIcon size={14} />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-stone-900 leading-tight">Reference Images</p>
                                <p className="text-[10px] text-stone-400">Logo & brand assets</p>
                            </div>
                        </div>
                        <ImageGrid images={logoImages} mediaBase={mediaBase} />
                    </div>
                </>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress Stepper
// ─────────────────────────────────────────────────────────────────────────────
function Stepper({ status }: { status: StatusKey }) {
    const disp = status === "REJECTED" ? "DESIGN_COMPLETED" : status;
    const curIdx = STATUS_ORDER.indexOf(disp);
    const isRej = status === "REJECTED";

    const labelMap: Record<string, string> = {
        NEW: "Received", IN_PROGRESS: "Designing", DESIGN_COMPLETED: "Review",
        APPROVED: "Approved", PRINTING: "Printing", COMPLETED: "Done",
    };
    const iconMap: Record<string, React.ReactNode> = {
        NEW: <Clock size={11} />, IN_PROGRESS: <Paintbrush size={11} />,
        DESIGN_COMPLETED: <Eye size={11} />, APPROVED: <CheckCircle2 size={11} />,
        PRINTING: <Printer size={11} />, COMPLETED: <Package size={11} />,
    };

    return (
        <div className="flex items-start overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            <style>{`.stepper-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="flex items-start stepper-scroll" style={{ scrollbarWidth: 'none' }}>
                {STATUS_ORDER.map((s, idx) => {
                    const done = idx < curIdx;
                    const active = idx === curIdx;
                    const isLast = idx === STATUS_ORDER.length - 1;
                    return (
                        <div key={s} className="flex items-center shrink-0">
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                                    done ? "bg-[#D73D32] border-[#D73D32] text-white" : 
                                    active ? "bg-white border-[#D73D32] text-[#D73D32]" : 
                                    "border-stone-300 bg-white text-stone-400"
                                } ${active ? "shadow-[0_0_0_4px_rgba(215,61,50,0.12)]" : ""}`}>
                                    {done ? <CheckCircle2 size={12} /> : (active && isRej) ? <ThumbsDown size={11} /> : iconMap[s]}
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${
                                    done ? "text-stone-600" : active ? "text-[#D73D32]" : "text-stone-400"
                                }`}>
                                    {active && isRej ? "Changes" : labelMap[s]}
                                </span>
                            </div>
                            {!isLast && <div className={`h-0.5 rounded-full w-6 sm:w-8 md:w-11 mx-0.75 mb-4 transition-colors ${done ? "bg-[#D73D32]" : "bg-stone-200"}`} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rejection Reason Modal
// ─────────────────────────────────────────────────────────────────────────────
function RejectionReasonModal({ isOpen, onClose, onSubmit, isSubmitting }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    isSubmitting: boolean;
}) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <MessageCircle size={16} color="#b91c1c" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900">Request Changes</h3>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-stone-600 mb-4">
                    Please let us know what changes you'd like. This helps our designer understand your requirements better.
                </p>
                
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Example: Please increase logo size, change background color to blue, use a different font style..."
                    className="w-full p-3 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#D73D32] focus:ring-1 focus:ring-[#D73D32] min-h-[150px] resize-y"
                    autoFocus
                />
                
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(reason)}
                        disabled={!reason.trim() || isSubmitting}
                        className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 rounded-full border-2 border-white/35 border-t-white drt-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <ThumbsDown size={14} />
                                Submit Changes Request
                            </>
                        )}
                    </button>
                </div>
                
                <p className="text-xs text-stone-400 mt-4 text-center">
                    Our designer will review your feedback and update the design accordingly.
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DesignRequestTracking({
    open, onClose, requestId, userId,
    mediaBaseUrl = "https://api.citizenprintz.in/",
}: DesignRequestTrackingProps) {
    const navigate = useNavigate();
    const [request, setRequest] = useState<DesignRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [actionResult, setActionResult] = useState<"approved" | "rejected" | null>(null);
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const fetchRequest = useCallback(async () => {
        if (!requestId) return;
        setLoading(true); setError(null);
        try {
            const res = await fetch(`https://api.citizenprintz.in/api/design_request/${requestId}`);
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
        if (open) { fetchRequest(); setActionResult(null); }
    }, [open, fetchRequest]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const handleApprove = async () => {
        if (!request) return;
        setApproving(true); setError(null);
        try {
            const res = await fetch(`https://api.citizenprintz.in/api/design_request/designedimage/${request.id}/approve`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
            });
            if (!res.ok) throw new Error(`Approval failed (${res.status})`);
            setRequest(p => p ? { ...p, status: "APPROVED", is_approved: 1 } : p);
            setActionResult("approved");
        } catch (err: any) {
            setError(err.message || "Failed to approve design");
        } finally { setApproving(false); }
    };

    const handleRejectWithReason = async (rejectionReason: string) => {
        if (!request) return;
        setRejecting(true); setError(null);
        try {
            const formData = new FormData();
            formData.append("user_id", userId || "");
            formData.append("rejection_reason", rejectionReason);
            
            const res = await fetch(`https://api.citizenprintz.in/api/design_request/designedimage/${request.id}/reject`, {
                method: "PUT",
                body: formData,
            });
            if (!res.ok) throw new Error(`Rejection failed (${res.status})`);
            const responseData = await res.json();
            setRequest(p => p ? { ...p, status: "REJECTED", is_approved: 0, rejection_reason: rejectionReason } : p);
            setActionResult("rejected");
            setShowRejectionModal(false);
        } catch (err: any) {
            setError(err.message || "Failed to reject design");
        } finally { setRejecting(false); }
    };

    // Parse images with the new helper functions
    const designedImages = request ? parseImages(request.designed_images) : [];
    const logoImages = request ? parseLogoImages(request.logo_images) : [];
    const cfg = request ? STATUS_CFG[request.status] : null;
    const showReview = request?.status === "DESIGN_COMPLETED" && !request?.is_approved && !actionResult;

    // Add keyframe animations
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drtFI { from { opacity: 0; } to { opacity: 1; } }
            @keyframes drtSI { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
            @keyframes drtFU { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes drtSpin { to { transform: rotate(360deg); } }
            .animate-drt-fu { animation: drtFU 0.38s ease both; }
            .drt-spin { animation: drtSpin 0.75s linear infinite; }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    return (
        <div className="drt">
            {/* Rejection Reason Modal */}
            <RejectionReasonModal
                isOpen={showRejectionModal}
                onClose={() => !rejecting && setShowRejectionModal(false)}
                onSubmit={handleRejectWithReason}
                isSubmitting={rejecting}
            />

            {/* Slide-in panel */}
            <div className={`fixed inset-0 z-[9999] bg-stone-50 flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-[#D73D32]" style={{ boxShadow: '0 2px 16px rgba(215,61,50,0.22)' }}>
                    <div className="flex items-center gap-2.5">
                        <button className="w-8.5 h-8.5 rounded-full bg-white/12 border-none cursor-pointer text-white flex items-center justify-center transition-colors hover:bg-white/22 disabled:opacity-40" onClick={onClose}>
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <p className="font-['Fraunces',Georgia,serif] text-[15px] font-bold text-white leading-tight">
                                Design Request
                            </p>
                            <p className="text-[10px] text-white/55 mt-0.5">
                                {request ? `ID: ${request.id.slice(0, 8).toUpperCase()}` : "Loading…"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <button className="w-8.5 h-8.5 rounded-full bg-white/12 border-none cursor-pointer text-white flex items-center justify-center transition-colors hover:bg-white/22 disabled:opacity-40" onClick={fetchRequest} disabled={loading}>
                            <RefreshCw size={14} className={loading ? "drt-spin" : ""} />
                        </button>
                        <button className="w-8.5 h-8.5 rounded-full bg-white/12 border-none cursor-pointer text-white flex items-center justify-center transition-colors hover:bg-white/22" onClick={onClose}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Body - two column layout */}
                <div className="flex-1 flex overflow-hidden min-h-0">

                    {/* Full loading */}
                    {loading && !request && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3.5">
                            <div className="w-9.5 h-9.5 rounded-full border-3 border-[#D73D32] border-t-transparent drt-spin" />
                            <p className="text-[13px] text-stone-400">Loading your request…</p>
                        </div>
                    )}

                    {/* Full error */}
                    {error && !request && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <div className="w-15 h-15 rounded-full bg-red-50 flex items-center justify-center">
                                <AlertCircle size={26} color="#dc2626" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-stone-900">Failed to load</p>
                                <p className="text-[13px] text-stone-400 mt-1">{error}</p>
                            </div>
                            <button onClick={fetchRequest} className="py-2.5 px-5.5 rounded-lg bg-[#D73D32] text-white border-none font-bold text-[13px] cursor-pointer font-inherit">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Two-column 50/50 layout */}
                    {request && cfg && (
                        <>
                            {/* LEFT — info + actions (50%) */}
                            <div className="flex-1 lg:flex-[0_0_50%] lg:max-w-[50%] overflow-y-auto p-5 pb-10 sm:p-6 sm:pb-12 lg:p-7 lg:pb-14 xl:p-8 xl:pb-16 animate-drt-fu">
                                {/* Refresh timestamp */}
                                {lastRefreshed && (
                                    <p className="text-[10px] text-stone-400 text-right mb-2.5">
                                        Updated {fmtDate(lastRefreshed.toISOString())}
                                    </p>
                                )}

                                {/* Status banner */}
                                <div className="rounded-xl p-3.5 pl-4 flex items-start gap-3 mb-3" style={{ background: cfg.bgHex, border: `1px solid ${cfg.borderHex}` }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bgHex, border: `1px solid ${cfg.borderHex}`, color: cfg.hex }}>
                                        {cfg.icon}
                                    </div>
                                    <div className="flex-1">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide py-0.5 px-2 rounded-full" style={{ color: cfg.hex, background: `${cfg.hex}15`, border: `1px solid ${cfg.borderHex}` }}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.hex }} />
                                            {cfg.label}
                                        </span>
                                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: cfg.hex }}>{cfg.desc}</p>
                                    </div>
                                </div>

                                {/* Show rejection reason if status is REJECTED */}
                                {request.status === "REJECTED" && request.rejection_reason && (
                                    <div className="rounded-xl p-3.5 pl-4 mb-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-100 border border-red-200">
                                                <MessageCircle size={14} color="#b91c1c" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-red-900 mb-1">Change Request Details:</p>
                                                <p className="text-xs text-red-800 leading-relaxed">{request.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stepper */}
                                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-3">
                                    <div className="p-3.5 pb-3.5 pl-4">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-stone-400 mb-3">
                                            Order Progress
                                        </p>
                                        <Stepper status={request.status} />

                                        {/* Show button only if approved */}
                                        {request.status === "APPROVED" && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => navigate("/cart")}
                                                    className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold border-none cursor-pointer"
                                                >
                                                    Go to Cart
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Inline error */}
                                {error && (
                                    <div className="p-2.5 pl-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 mb-3">
                                        <AlertCircle size={14} color="#dc2626" className="shrink-0" />
                                        <p className="text-[13px] text-red-600 flex-1">{error}</p>
                                        <button onClick={() => setError(null)} className="bg-none border-none cursor-pointer text-red-600"><X size={13} /></button>
                                    </div>
                                )}

                                {/* Action result banners */}
                                {actionResult === "approved" && (
                                    <div className="rounded-xl p-3.5 pl-4 flex items-start gap-2.5 mb-3" style={{ background: "#ecfdf5", border: "1.5px solid #a7f3d0" }}>
                                        <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 bg-emerald-100 border border-emerald-200">
                                            <ThumbsUp size={15} color="#047857" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-emerald-900">Design approved!</p>
                                            <p className="text-xs text-emerald-700 mt-0.5">Moving to printing. We'll update you every step of the way.</p>
                                        </div>
                                    </div>
                                )}

                                {actionResult === "rejected" && (
                                    <div className="rounded-xl p-3.5 pl-4 flex items-start gap-2.5 mb-3" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
                                        <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 bg-red-100 border border-red-200">
                                            <ThumbsDown size={15} color="#b91c1c" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] font-bold text-red-900">Changes requested</p>
                                            <p className="text-xs text-red-700 mt-0.5">Our designer will revise and send it back soon.</p>
                                            {request.rejection_reason && (
                                                <div className="mt-2 pt-2 border-t border-red-200">
                                                    <p className="text-xs font-semibold text-red-800">Your feedback:</p>
                                                    <p className="text-xs text-red-700 mt-0.5">{request.rejection_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                        <a href={`https://wa.me/?text=Changes needed for design ID: ${request.id.slice(0, 8).toUpperCase()}. Notes: ${encodeURIComponent(request.rejection_reason || "")}`}
                                            target="_blank" rel="noreferrer"
                                            className="flex items-center gap-1 text-[11px] font-bold text-red-700 no-underline shrink-0">
                                            <MessageCircle size={12} /> Add notes
                                        </a>
                                    </div>
                                )}

                                {/* Review action panel */}
                                {showReview && (
                                    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-50/50 p-4 mb-3">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 bg-purple-100 border border-purple-200">
                                                <Star size={15} color="#7c3aed" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-purple-900">Your design is ready!</p>
                                                <p className="text-xs text-purple-700 leading-relaxed mt-1 mb-3">
                                                    Check the images on the right (or below on mobile). Approve to proceed to printing, or request changes.
                                                </p>
                                                <div className="flex gap-2.5">
                                                    <button className="h-10.5 rounded-lg flex items-center justify-center gap-1.5 flex-1 font-bold text-[13px] border-none transition-all duration-200 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleApprove} disabled={approving || rejecting}>
                                                        {approving
                                                            ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/35 border-t-white drt-spin" /> Approving…</>
                                                            : <><ThumbsUp size={13} /> Approve</>}
                                                    </button>
                                                    <button className="h-10.5 rounded-lg flex items-center justify-center gap-1.5 flex-1 font-bold text-[13px] border-2 border-red-300 bg-white text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowRejectionModal(true)} disabled={approving || rejecting}>
                                                        <ThumbsDown size={13} /> Request Changes
                                                    </button>
                                                </div>
                                                <a href={`https://wa.me/?text=I need design changes. ID: ${request.id.slice(0, 8).toUpperCase()}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-purple-700 font-semibold no-underline">
                                                    <MessageCircle size={12} /> Prefer to explain changes via WhatsApp?
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Request details card */}
                                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-3">
                                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-stone-400 flex items-center gap-1.5 p-3.5 pb-2.5 border-b border-stone-100">
                                        <FileText size={11} /> Request Details
                                    </div>
                                    {[
                                        { icon: <Package size={11} />, k: "Product", v: request.product_name },
                                        { icon: <User size={11} />, k: "Name", v: request.name },
                                        { icon: <Phone size={11} />, k: "Phone", v: request.phone },
                                        { icon: <Mail size={11} />, k: "Email", v: request.email || "—" },
                                        { icon: <CalendarDays size={11} />, k: "Submitted", v: fmtDate(request.created_at) },
                                        { icon: <CalendarDays size={11} />, k: "Updated", v: fmtDate(request.updated_at) },
                                        ...(request.design_price > 0
                                            ? [{ icon: <BadgeIndianRupee size={11} />, k: "Design Fee", v: `₹${request.design_price.toFixed(2)}` }]
                                            : []),
                                    ].map(({ icon, k, v }) => (
                                        <div key={k} className="flex justify-between items-start py-2 px-4 gap-2.5 text-[13px] border-b border-stone-50 last:border-none">
                                            <span className="text-stone-500 font-medium shrink-0 min-w-[86px] flex items-center gap-1.5"><span className="text-stone-400">{icon}</span>{k}</span>
                                            <span className="text-stone-800 font-semibold text-right break-all">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Design notes */}
                                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-3">
                                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-stone-400 flex items-center gap-1.5 p-3.5 pb-2.5 border-b border-stone-100">
                                        <Sparkles size={11} /> Your Brief
                                    </div>
                                    <div className="p-3 pl-4">
                                        <p className="text-[13px] text-stone-700 leading-relaxed whitespace-pre-wrap">
                                            {request.design_notes || <span className="text-stone-400">No notes provided.</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Help */}
                                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-3.5 pl-4 mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${BRAND}12` }}>
                                            <MessageCircle size={16} color={BRAND} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] font-bold text-stone-900">Need help?</p>
                                            <p className="text-[11px] text-stone-400">Chat with us on WhatsApp for quick support</p>
                                        </div>
                                        <a href={`https://wa.me/?text=Hi, help needed for design ID: ${request.id.slice(0, 8).toUpperCase()}`}
                                            target="_blank" rel="noreferrer"
                                            className="flex items-center gap-0.5 text-xs font-bold text-[#D73D32] no-underline shrink-0">
                                            Chat <ChevronRight size={13} />
                                        </a>
                                    </div>
                                </div>

                                {/* Tip */}
                                <div className="p-2.5 pl-3.5 rounded-xl flex gap-2 bg-amber-50 border border-amber-200">
                                    <Sparkles size={13} color="#d97706" className="shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-amber-800 leading-relaxed">
                                        <strong>Tip:</strong> Tap the refresh icon in the header to get the latest status on your design.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT — desktop image panel (50%) */}
                            <div className="hidden lg:block lg:flex-[0_0_50%] lg:w-[50%] overflow-y-auto bg-white border-l border-stone-200 p-7 pb-14 xl:p-8 xl:pb-16">
                                {/* Sticky heading */}
                                <div className="sticky top-0 z-10 bg-white pb-3.5 mb-1 border-b border-stone-100">
                                    <p className="font-['Fraunces',Georgia,serif] text-base font-bold text-stone-900">
                                        Design Images
                                    </p>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                        {designedImages.length} design · {logoImages.length} reference
                                    </p>
                                </div>
                                <ImagesPanel
                                    designedImages={designedImages}
                                    logoImages={logoImages}
                                    mediaBase={mediaBaseUrl}
                                    status={request.status}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile image section — shown below body, only <900px */}
                {request && (
                    <div className="block lg:hidden shrink-0 bg-white border-t border-stone-200 p-4 pb-8">
                        <p className="font-['Fraunces',Georgia,serif] text-sm font-bold text-stone-900 mb-3.5">
                            Design Images
                        </p>
                        <ImagesPanel
                            designedImages={designedImages}
                            logoImages={logoImages}
                            mediaBase={mediaBaseUrl}
                            status={request.status}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}