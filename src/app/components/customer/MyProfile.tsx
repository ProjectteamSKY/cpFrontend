import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Heart,
    LogOut,
    Award,
    Star,
    Shield,
    ChevronRight,
    Crown,
    Paintbrush,
    Edit3,
    Check,
    X,
    Camera,
    Loader2,
    Save,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { OrderHistoryPage } from "./OrderTrackingPage";
import { WishlistPage } from "./WishlistPage";
import { AddressPage } from "./AddressPage";
import DesignRequestTracking from "./Designrequesttracking";
import { getUserId, getUserRoles } from "../../utils/authStorage";

const API_BASE = "https://api.citizenprintz.in/api";
const MEDIA_BASE = "https://api.citizenprintz.in";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UserProfile {
    id: string;
    name: string;
    full_name?: string;
    email: string;
    phone: string;
    avatar: string | null;
    join_date: string;
    total_orders: number;
    total_spent: number;
    loyalty_points: number;
    membership_tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface ExtendedProfile {
    user_id: string;
    profile_picture: string | null;
    phone_number: string | null;
    gender: string;
    date_of_birth: string | null;
}

interface DesignRequestSummary {
    id: string;
    product_name: string;
    status: string;
    created_at: string;
}

// ---------------------------------------------------------------------------
// Tier config
// ---------------------------------------------------------------------------
const tierConfig = {
    Platinum: {
        badgeBg: "bg-slate-600",
        badgeText: "text-white",
        icon: Shield,
    },
    Gold: {
        badgeBg: "bg-yellow-500",
        badgeText: "text-yellow-900",
        icon: Crown,
    },
    Silver: {
        badgeBg: "bg-gray-400",
        badgeText: "text-gray-900",
        icon: Star,
    },
    Bronze: {
        badgeBg: "bg-amber-600",
        badgeText: "text-white",
        icon: Award,
    },
};

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
const STATUS_COLORS: Record<string, { color: string; bg: string; dot: string }> = {
    NEW: { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
    IN_PROGRESS: { color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
    REVIEW: { color: "text-purple-600", bg: "bg-purple-50", dot: "bg-purple-500" },
    APPROVED: { color: "text-green-600", bg: "bg-green-50", dot: "bg-green-500" },
    PRINTING: { color: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-500" },
    COMPLETED: { color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
};

function StatusPill({ status }: { status: string }) {
    const s = STATUS_COLORS[status] ?? { color: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-400" };
    const label = status.replace("_", " ");
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.color} ${s.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
type TabId = "profile" | "orders" | "addresses" | "wishlist" | "designs";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "designs", label: "My Designs Request", icon: Paintbrush },
];

// ---------------------------------------------------------------------------
// Inline editable field component
// ---------------------------------------------------------------------------
interface EditableFieldProps {
    label: string;
    value: string;
    icon: React.ElementType;
    fieldKey: string;
    type?: string;
    onSave: (key: string, value: string) => Promise<void>;
    readOnly?: boolean;
}

function EditableField({ label, value, icon: Icon, fieldKey, type = "text", onSave, readOnly }: EditableFieldProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const handleSave = async () => {
        if (draft === value) {
            setEditing(false);
            return;
        }
        setSaving(true);
        try {
            await onSave(fieldKey, draft);
            setEditing(false);
        } catch {
            setDraft(value);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(value);
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                {editing ? (
                    <input
                        ref={inputRef}
                        type={type}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-red-400 outline-none py-0.5"
                    />
                ) : (
                    <p className="text-sm font-medium text-gray-900 truncate">{value || <span className="text-gray-400 italic">Not added</span>}</p>
                )}
            </div>
            {!readOnly && (
                <div className="flex items-center gap-1 shrink-0">
                    {editing ? (
                        <>
                            {saving ? (
                                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                            ) : (
                                <>
                                    <button onClick={handleSave} className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition-colors">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleCancel} className="p-1 rounded-lg hover:bg-red-100 text-red-500 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Avatar Upload Component
// ---------------------------------------------------------------------------
interface AvatarUploadProps {
    avatarUrl: string | null;
    name: string | undefined;
    userId: string;
    onUpdated: (newUrl: string) => void;
}

function AvatarUpload({ avatarUrl, name, userId, onUpdated }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("profile_picture", file);

            let res;
            try {
                res = await axios.put(`${API_BASE}/user-profile/${userId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch (putErr: any) {
                if (putErr.response?.status === 404) {
                    res = await axios.post(`${API_BASE}/user-profile/`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } else {
                    throw putErr;
                }
            }

            const newUrl = res.data?.data?.profile_picture ?? res.data?.profile_picture ?? null;
            if (newUrl) {
                onUpdated(newUrl);
                toast.success("Profile picture updated!");
            }
        } catch (err) {
            console.error("Avatar upload failed", err);
            toast.error("Failed to upload profile picture.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {avatarUrl ? (
                    <img
                        src={avatarUrl.startsWith("http") ? avatarUrl : `${MEDIA_BASE}${avatarUrl}`}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-red-50 flex items-center justify-center">
                        <User className="w-10 h-10 text-red-400" />
                    </div>
                )}
            </div>

            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                    <Camera className="w-6 h-6 text-white" />
                )}
            </div>

            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Design Requests List subpage
// ---------------------------------------------------------------------------
function DesignRequestsList({
    userId,
    onOpen,
}: {
    userId: string;
    onOpen: (id: string) => void;
}) {
    const [requests, setRequests] = useState<DesignRequestSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDesigns = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/design_request/user/${userId}`);
                const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                setRequests(list);
            } catch {
                setError("Failed to load design requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchDesigns();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-16 text-sm text-red-500">{error}</div>;
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <Paintbrush className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No design requests yet</p>
                <p className="text-xs text-gray-400 max-w-xs">
                    When you place an order without a design, your requests will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {requests.map((req) => (
                <button
                    key={req.id}
                    onClick={() => onOpen(req.id)}
                    className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <Paintbrush className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{req.product_name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(req.created_at).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <StatusPill status={req.status} />
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Extended Profile Form (separate card)
// ---------------------------------------------------------------------------
interface ExtendedProfileFormProps {
    userId: string;
    extProfile: ExtendedProfile | null;
    onSaved: (updated: ExtendedProfile) => void;
}

function ExtendedProfileForm({
    userId,
    extProfile,
    onSaved,
}: ExtendedProfileFormProps) {
    const [form, setForm] = useState({
        phone_number: extProfile?.phone_number ?? "",
        gender: extProfile?.gender ?? "Not Specified",
        date_of_birth: extProfile?.date_of_birth ?? "",
    });

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (extProfile) {
            setForm({
                phone_number: extProfile.phone_number ?? "",
                gender: extProfile.gender ?? "Not Specified",
                date_of_birth: extProfile.date_of_birth ?? "",
            });
        }
    }, [extProfile]);

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        } else if (!/^[0-9]{10,15}$/.test(form.phone_number)) {
            newErrors.phone_number = "Enter valid phone number (10-15 digits)";
        }

        if (!form.date_of_birth.trim()) {
            newErrors.date_of_birth = "Date of birth is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("phone_number", form.phone_number);
            formData.append("gender", form.gender);
            if (form.date_of_birth) {
                formData.append("date_of_birth", form.date_of_birth);
            }

            let res;
            try {
                // Try to update first
                res = await axios.put(`${API_BASE}/user-profile/${userId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch (err: any) {
                if (err.response?.status === 404) {
                    // Create if not exists
                    res = await axios.post(`${API_BASE}/user-profile/`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } else {
                    throw err;
                }
            }

            const updatedProfile = res.data?.data ?? res.data;
            onSaved(updatedProfile);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Extended profile save failed", err);
            toast.error("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition";
    const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-100";

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Extended Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => handleChange("phone_number", e.target.value)}
                        className={`${inputClass} ${errors.phone_number ? errorClass : ""}`}
                        placeholder="Enter phone number"
                    />
                    {errors.phone_number && (
                        <span className="text-xs text-red-500 mt-1">{errors.phone_number}</span>
                    )}
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Gender</label>
                    <select
                        value={form.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className={inputClass}
                    >
                        {["Not Specified", "Male", "Female", "Other"].map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => handleChange("date_of_birth", e.target.value)}
                        className={`${inputClass} ${errors.date_of_birth ? errorClass : ""}`}
                    />
                    {errors.date_of_birth && (
                        <span className="text-xs text-red-500 mt-1">{errors.date_of_birth}</span>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ProfilePage
// ---------------------------------------------------------------------------
export function ProfilePage() {
    const navigate = useNavigate();
    const userId = getUserId();

    console.log("ProfilePage mounted. User ID:", userId);
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [extProfile, setExtProfile] = useState<ExtendedProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [extLoading, setExtLoading] = useState(false);

    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingRequestId, setTrackingRequestId] = useState<string>("");

    useEffect(() => {
        if (!userId) {
            toast.error("Please login to view your profile");
            navigate("/login");
            return;
        }
        fetchProfile();
        fetchExtendedProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users/${userId}`);
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchExtendedProfile = async () => {
        setExtLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/user-profile/${userId}`);
            console.log("Extended profile data:", res.data);
            setExtProfile(res.data);
        } catch (err: any) {
            if (err.response?.status !== 404) {
                console.error("Failed to fetch extended profile", err);
            }
        } finally {
            setExtLoading(false);
        }
    };

    const handleCoreFieldSave = async (key: string, value: string) => {
        try {
            const res = await axios.patch(`${API_BASE}/users/${userId}`, { [key]: value });
            setProfile((prev) => (prev ? { ...prev, ...res.data } : prev));
            toast.success("Updated successfully!");
        } catch (err) {
            console.error("Failed to update field", err);
            toast.error("Failed to update. Please try again.");
            throw err;
        }
    };

    const handleAvatarUpdated = (newUrl: string) => {
        setProfile((prev) => (prev ? { ...prev, avatar: newUrl } : prev));
        setExtProfile((prev) => (prev ? { ...prev, profile_picture: newUrl } : prev));
    };

    const handleExtProfileSaved = (updated: ExtendedProfile) => {
        setExtProfile(updated);
        if (updated.phone_number) {
            setProfile((prev) => (prev ? { ...prev, phone: updated.phone_number! } : prev));
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem("user_id");
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    const openTracking = (requestId: string) => {
        setTrackingRequestId(requestId);
        setTrackingOpen(true);
    };

    const tier = (profile?.membership_tier ?? "Bronze") as keyof typeof tierConfig;
    const config = tierConfig[tier];
    const TierIcon = config.icon;

    const avatarUrl = profile?.avatar
        ? profile.avatar.startsWith("http")
            ? profile.avatar
            : `${MEDIA_BASE}${profile.avatar}`
        : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Hero Card */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-6">
                    <div className="h-1 w-full bg-red-600" />
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <AvatarUpload
                                avatarUrl={avatarUrl}
                                name={profile?.full_name}
                                userId={userId}
                                onUpdated={handleAvatarUpdated}
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold text-gray-900">{profile?.full_name}</h2>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText}`}>
                                        <TierIcon className="w-3 h-3" />
                                        {tier}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-red-500" />
                                        {profile?.email}
                                    </span>
                                    {profile?.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-red-500" />
                                            {profile.phone}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    Click on your photo to update it
                                </p>
                            </div>

                            <div className="flex flex-col items-start lg:items-end gap-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "profile" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                    Account Information
                                </h3>
                                <div className="space-y-1">
                                    <EditableField
                                        icon={User}
                                        label="Full Name"
                                        value={profile?.full_name ?? profile?.name ?? ""}
                                        fieldKey="full_name"
                                        onSave={handleCoreFieldSave}
                                        readOnly
                                    />
                                    <EditableField
                                        icon={Mail}
                                        label="Email Address"
                                        value={profile?.email ?? ""}
                                        fieldKey="email"
                                        type="email"
                                        onSave={handleCoreFieldSave}
                                        readOnly
                                    />
                                    
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                {extLoading ? (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center gap-2 text-gray-400 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading extended profile...
                                    </div>
                                ) : (
                                    <ExtendedProfileForm
                                        userId={userId}
                                        extProfile={extProfile}
                                        onSaved={handleExtProfileSaved}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && <OrderHistoryPage />}
                    {activeTab === "addresses" && <AddressPage isEmbedded />}
                    {activeTab === "wishlist" && <WishlistPage />}

                    {activeTab === "designs" && (
                        <DesignRequestsList userId={userId} onOpen={openTracking} />
                    )}
                </div>
            </div>

            <DesignRequestTracking
                open={trackingOpen}
                onClose={() => setTrackingOpen(false)}
                requestId={trackingRequestId}
                userId={userId}
                mediaBaseUrl={MEDIA_BASE}
            />

            <Toaster />
        </div>
    );
}