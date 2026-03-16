import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
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

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

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
        gradient: "from-slate-600 via-slate-400 to-slate-300",
        badge: "from-slate-700 to-slate-500",
        text: "text-slate-100",
        glow: "shadow-slate-300/40",
        icon: Shield,
        perks: "Exclusive platinum benefits & priority support"
    },
    Gold: {
        gradient: "from-yellow-500 via-amber-400 to-yellow-300",
        badge: "from-yellow-600 to-amber-500",
        text: "text-yellow-900",
        glow: "shadow-yellow-300/50",
        icon: Crown,
        perks: "Free shipping on all orders & early access"
    },
    Silver: {
        gradient: "from-gray-500 via-gray-300 to-gray-200",
        badge: "from-gray-600 to-gray-400",
        text: "text-gray-100",
        glow: "shadow-gray-300/40",
        icon: Star,
        perks: "10% bonus points & member discounts"
    },
    Bronze: {
        gradient: "from-amber-700 via-amber-500 to-amber-400",
        badge: "from-amber-800 to-amber-600",
        text: "text-amber-100",
        glow: "shadow-amber-400/40",
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
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-[#D73D32]/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D73D32] animate-spin"></div>
                        <div className="absolute inset-3 rounded-full bg-[#D73D32]/10 animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Loading profile</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                background: "white",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:wght@600;700&display=swap');

                .noise-overlay {
                    position: fixed;
                    inset: 0;
                    opacity: 0.03;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.04);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .glass-card-light {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .red-glow {
                    box-shadow: 0 0 40px rgba(215, 61, 50, 0.15), 0 20px 60px rgba(0,0,0,0.5);
                }

                .stat-card {
                    background: rgba(215, 61, 50, 0.06);
                    border: 1px solid rgba(215, 61, 50, 0.15);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    background: rgba(215, 61, 50, 0.1);
                    border-color: rgba(215, 61, 50, 0.3);
                    transform: translateY(-2px);
                }

                .tab-active {
                    background: linear-gradient(135deg, #D73D32, #ff5a4f);
                    box-shadow: 0 4px 20px rgba(215, 61, 50, 0.4);
                }

                .avatar-ring {
                    background: conic-gradient(from 0deg, #D73D32, #ff6b5e, #D73D32);
                    animation: spin-slow 4s linear infinite;
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .points-bar {
                    background: linear-gradient(90deg, #D73D32, #ff6b5e);
                    box-shadow: 0 0 10px rgba(215, 61, 50, 0.5);
                }

                .tier-badge {
                    position: relative;
                    overflow: hidden;
                }

                .tier-badge::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
                }

                .logout-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    background: rgba(215, 61, 50, 0.1);
                    border-color: rgba(215, 61, 50, 0.3);
                    color: #ff6b5e;
                }

                .placeholder-content {
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                }
            `}</style>

            <div className="noise-overlay"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">

                {/* Profile Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                >
                    <div className="glass-card red-glow rounded-3xl overflow-hidden">
                        {/* Decorative header strip */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`}></div>

                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">

                                {/* Avatar with animated ring */}
                                <div className="relative flex-shrink-0">
                                    <div className="avatar-ring w-28 h-28 rounded-full p-[3px]">
                                        <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                                            {profile?.avatar ? (
                                                <img
                                                    src={`${MEDIA_BASE}${profile.avatar}`}
                                                    alt={profile?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#D73D32]/30 to-[#ff6b5e]/10 flex items-center justify-center">
                                                    <User className="w-12 h-12 text-[#D73D32]/70" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Online indicator */}
                                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#1a1a1a] shadow-lg shadow-emerald-400/50"></div>
                                </div>

                                {/* Name, tier, contacts */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h1
                                            className="text-4xl font-bold text-white tracking-tight"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {profile?.name}
                                        </h1>

                                        {/* Tier badge */}
                                        <div className={`tier-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.badge} shadow-lg`}>
                                            <TierIcon className={`w-3.5 h-3.5 ${config.text}`} />
                                            <span className={`text-xs font-semibold tracking-wider uppercase ${config.text}`}>
                                                {tier}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-[#D73D32]" />
                                            <span>{profile?.email}</span>
                                        </div>
                                        {profile?.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-[#D73D32]" />
                                                <span>{profile?.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[#D73D32]" />
                                            <span>Member since {new Date(profile?.join_date || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                                        </div>
                                    </div>

                                    {/* Loyalty points progress */}
                                    <div className="max-w-xs">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                            <span className="flex items-center gap-1">
                                                <Sparkles className="w-3 h-3 text-[#D73D32]" />
                                                {profile?.loyalty_points || 0} pts
                                            </span>
                                            <span>Next: {tier === "Platinum" ? "Max" : `${tier === "Gold" ? 5000 : tier === "Silver" ? 2000 : 500} pts`}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(((profile?.loyalty_points || 0) / (tier === "Bronze" ? 500 : tier === "Silver" ? 2000 : 5000)) * 100, 100)}%` }}
                                                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                                className="points-bar h-full rounded-full"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{config.perks}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap lg:flex-col gap-3 lg:items-end">
                                    <div className="flex gap-3">
                                        {[
                                            { value: profile?.total_orders || 0, label: "Orders", icon: ShoppingBag },
                                            { value: `₹${((profile?.total_spent || 0) / 1000).toFixed(1)}k`, label: "Spent", icon: TrendingUp },
                                            { value: profile?.loyalty_points || 0, label: "Points", icon: Star }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                className="stat-card rounded-2xl px-5 py-4 text-center min-w-[80px]"
                                            >
                                                <stat.icon className="w-4 h-4 text-[#D73D32] mx-auto mb-1" />
                                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="logout-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-1"
                >
                    {tabs.map((tab, i) => (
                        <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "tab-active text-white"
                                    : "glass-card-light text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.span
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 rounded-2xl tab-active -z-10"
                                />
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {activeTab === "profile" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="glass-card rounded-3xl p-6">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Personal Information</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: User, label: "Full Name", value: profile?.name },
                                            { icon: Mail, label: "Email Address", value: profile?.email },
                                            { icon: Phone, label: "Phone Number", value: profile?.phone || "Not added" },
                                            { icon: Calendar, label: "Member Since", value: new Date(profile?.join_date || "").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) }
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                <div className="w-9 h-9 rounded-xl bg-[#D73D32]/10 flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="w-4 h-4 text-[#D73D32]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500">{item.label}</p>
                                                    <p className="text-sm text-white font-medium truncate">{item.value}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#D73D32] transition-colors opacity-0 group-hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Membership Card */}
                                <div className={`relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 -ml-8 -mb-8"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <p className="text-xs font-semibold opacity-70 uppercase tracking-widest">Membership</p>
                                                <h3 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                    {tier} Member
                                                </h3>
                                            </div>
                                            <TierIcon className="w-8 h-8 text-white/80" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-xs text-white/60">Loyalty Points</span>
                                                <span className="text-sm font-bold text-white">{profile?.loyalty_points || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-white/60">Total Orders</span>
                                                <span className="text-sm font-bold text-white">{profile?.total_orders || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-white/60">Total Spent</span>
                                                <span className="text-sm font-bold text-white">₹{profile?.total_spent?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/20">
                                            <p className="text-xs text-white/60">{config.perks}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && <OrderHistoryPage />}

                        {activeTab === "addresses" && (
                            <div className="placeholder-content rounded-3xl p-16 text-center">
                                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-gray-400 font-semibold text-lg mb-2">No addresses saved</h3>
                                <p className="text-gray-600 text-sm">Add a delivery address to speed up your checkout</p>
                                <button className="mt-6 px-6 py-2.5 rounded-xl bg-[#D73D32]/10 border border-[#D73D32]/20 text-[#D73D32] text-sm font-medium hover:bg-[#D73D32]/20 transition-colors">
                                    Add Address
                                </button>
                            </div>
                        )}

                        {activeTab === "wishlist" && <WishlistPage />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Toaster />
        </div>
    );
}