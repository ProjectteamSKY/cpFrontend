import { useState, useEffect } from "react";
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
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { OrderHistoryPage } from "./OrderTrackingPage";
import { WishlistPage } from "./WishlistPage";
import { AddressPage } from "./AddressPage";
import DesignRequestTracking from "./Designrequesttracking";

const API_BASE = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    join_date: string;
    total_orders: number;
    total_spent: number;
    loyalty_points: number;
    membership_tier: "Bronze" | "Silver" | "Gold" | "Platinum";
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
// Status badge helper (reused from tracking component style)
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
    { id: "designs", label: "My Designs", icon: Paintbrush },
];

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
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/design_request/user/${userId}`);
                // Support both { data: [...] } and direct array
                const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                setRequests(list);
            } catch (e: any) {
                setError("Failed to load design requests.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 text-sm text-red-500">{error}</div>
        );
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
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {req.product_name}
                                </p>
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
// ProfilePage
// ---------------------------------------------------------------------------
export function ProfilePage() {
    const navigate = useNavigate();
    const userId =
        sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || "";

    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Tracking slide-over state
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingRequestId, setTrackingRequestId] = useState<string>("");

    useEffect(() => {
        if (!userId) {
            toast.error("Please login to view your profile");
            navigate("/login");
            return;
        }
        fetchProfile();
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Profile Hero Card */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-6">
                    <div className="h-1 w-full bg-red-600" />
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                    {profile?.avatar ? (
                                        <img
                                            src={`${MEDIA_BASE}${profile.avatar}`}
                                            alt={profile?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-red-50 flex items-center justify-center">
                                            <User className="w-10 h-10 text-red-400" />
                                        </div>
                                    )}
                                </div>
                                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold text-gray-900">{profile?.name}</h2>
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
                            </div>

                            {/* Logout */}
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
                    {/* Profile */}
                    {activeTab === "profile" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                    Personal Information
                                </h3>
                                <div className="space-y-1">
                                    {[
                                        { icon: User, label: "Full Name", value: profile?.name },
                                        { icon: Mail, label: "Email Address", value: profile?.email },
                                        { icon: Phone, label: "Phone Number", value: profile?.phone || "Not added" },
                                        {
                                            icon: Calendar,
                                            label: "Member Since",
                                            value: new Date(profile?.join_date || "").toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }),
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-4 h-4 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400">{item.label}</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.value}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && <OrderHistoryPage />}

                    {activeTab === "addresses" && <AddressPage isEmbedded />}

                    {activeTab === "wishlist" && <WishlistPage />}

                    {/* My Designs tab — shows list, clicking opens slide-over */}
                    {activeTab === "designs" && (
                        <DesignRequestsList userId={userId} onOpen={openTracking} />
                    )}
                </div>
            </div>

            {/* Design Request Tracking Slide-Over */}
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