import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
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
    TrendingUp,
    Shield,
    ChevronRight,
    Sparkles,
    Crown
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { OrderHistoryPage } from "./OrderTrackingPage";
import { WishlistPage } from "./WishlistPage";
import { AddressPage } from "./AddressPage";

const API_BASE = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

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

const tierConfig = {
    Platinum: {
        badgeBg: "bg-slate-600",
        badgeText: "text-white",
        cardBg: "bg-gradient-to-br from-slate-600 to-slate-400",
        icon: Shield,
        perks: "Exclusive platinum benefits & priority support"
    },
    Gold: {
        badgeBg: "bg-yellow-500",
        badgeText: "text-yellow-900",
        cardBg: "bg-gradient-to-br from-yellow-500 to-amber-400",
        icon: Crown,
        perks: "Free shipping on all orders & early access"
    },
    Silver: {
        badgeBg: "bg-gray-400",
        badgeText: "text-gray-900",
        cardBg: "bg-gradient-to-br from-gray-500 to-gray-300",
        icon: Star,
        perks: "10% bonus points & member discounts"
    },
    Bronze: {
        badgeBg: "bg-amber-600",
        badgeText: "text-white",
        cardBg: "bg-gradient-to-br from-amber-700 to-amber-500",
        icon: Award,
        perks: "Earn points on every purchase"
    }
};

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart }
];

export function ProfilePage() {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

    const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">("profile");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

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

    const tier = profile?.membership_tier || "Bronze";
    const config = tierConfig[tier];
    const TierIcon = config.icon;

    const nextTierPoints =
        tier === "Platinum" ? null :
        tier === "Gold" ? 5000 :
        tier === "Silver" ? 2000 : 500;

    const progressPercent = nextTierPoints
        ? Math.min(((profile?.loyalty_points || 0) / nextTierPoints) * 100, 100)
        : 100;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
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
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-red-600"></div>

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
                                {/* Online dot */}
                                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
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

                            {/* Stats + Logout */}
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
                <div className="flex gap-1 mb-6 border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
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
                            {/* Personal Info */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Personal Information</h3>
                                <div className="space-y-1">
                                    {[
                                        { icon: User, label: "Full Name", value: profile?.name },
                                        { icon: Mail, label: "Email Address", value: profile?.email },
                                        { icon: Phone, label: "Phone Number", value: profile?.phone || "Not added" },
                                        {
                                            icon: Calendar,
                                            label: "Member Since",
                                            value: new Date(profile?.join_date || "").toLocaleDateString("en-US", {
                                                day: "numeric", month: "long", year: "numeric"
                                            })
                                        }
                                    ].map(item => (
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

                            {/* Membership Card */}
                            
                        </div>
                    )}

                    {activeTab === "orders" && <OrderHistoryPage />}

                    {activeTab === "addresses" && <AddressPage isEmbedded />}

                    {activeTab === "wishlist" && <WishlistPage />}
                </div>
            </div>

            <Toaster />
        </div>
    );
}