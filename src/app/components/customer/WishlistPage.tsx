import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw, ShoppingBag, Sparkles, X } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import { ProductCard } from "../../components/product/ProductCard";
import { ProductSkeleton } from "../../components/product/ProductSkeleton";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { getProductsByIds } from "../../service/productApiService";
import { toast } from "react-toastify";
import { Toaster } from "../../components/ui/toaster";

export const WishlistPage = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
    const { wishlist, loading, isFavorite, toggleWishlist, refresh } = useWishlist(userId || "");

    const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
    const [productsLoading, setProductsLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWishlistProducts = async () => {
        if (!wishlist || wishlist.length === 0) {
            setWishlistProducts([]);
            return;
        }
        setProductsLoading(true);
        try {
            const productIds = wishlist.map((item) => item.product_id);
            const products = await getProductsByIds(productIds);
            setWishlistProducts(products);
        } catch (err) {
            console.error("Error fetching wishlist products:", err);
            toast.error("Failed to load wishlist products");
        } finally {
            setProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlistProducts();
    }, [wishlist]);

    const handleRefresh = async () => {
        setRefreshing(true);
        refresh();
        setTimeout(() => setRefreshing(false), 800);
        toast.success("Wishlist refreshed");
    };

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    const handleQuickView = (product: any, e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Quick view coming soon!");
    };

    const handleImageClick = (product: any, index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Gallery view coming soon!");
    };

    const handleShare = (product: any, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.share?.({
                title: product.name,
                text: product.description,
                url: window.location.origin + `/product/${product.id}`
            }).catch(() => {
                navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
                toast("Link copied to clipboard!");
            });
        } catch {
            toast("Share not available");
        }
    };

    const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const wasInList = isFavorite(id);
            toggleWishlist(id);
            toast(wasInList ? "Removed from wishlist" : "Added to wishlist!");
        } catch {
            toast.error("Failed to update wishlist");
        }
    };

    if (loading || productsLoading) {
        return (
            <div className="space-y-6">
                <WishlistHeader count={0} onRefresh={handleRefresh} refreshing={refreshing} />
                <ProductSkeleton />
            </div>
        );
    }

    if (!wishlistProducts.length) {
        return (
            <div className="space-y-6">
                <WishlistHeader count={0} onRefresh={handleRefresh} refreshing={refreshing} />
                <EmptyWishlist onBrowse={() => navigate("/")} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@600&display=swap');

                .wishlist-card-hover {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
                }
                .wishlist-card-hover:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(215, 61, 50, 0.05);
                }

                .count-badge {
                    background: linear-gradient(135deg, #D73D32, #ff5a4f);
                    box-shadow: 0 4px 12px rgba(215, 61, 50, 0.4);
                }

                .refresh-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.5);
                    transition: all 0.3s ease;
                }

                .refresh-btn:hover {
                    background: rgba(215, 61, 50, 0.1);
                    border-color: rgba(215, 61, 50, 0.3);
                    color: #D73D32;
                }

                .empty-glass {
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px dashed rgba(255, 255, 255, 0.08);
                }
            `}</style>

            <WishlistHeader count={wishlistProducts.length} onRefresh={handleRefresh} refreshing={refreshing} />

            <AnimatePresence>
                <motion.div
                    className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {wishlistProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="wishlist-card-hover"
                        >
                            <div className="relative">
                                {/* Remove button overlay */}
                                <button
                                    onClick={(e) => handleToggleFavorite(product.id, e)}
                                    className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-red-500/80 transition-all"
                                    title="Remove from wishlist"
                                >
                                    <X className="w-3.5 h-3.5 text-white" />
                                </button>

                                <ProductCard
                                    product={product}
                                    viewMode="grid"
                                    isFavorite={isFavorite(product.id)}
                                    onProductClick={handleProductClick}
                                    onQuickView={handleQuickView}
                                    onImageClick={handleImageClick}
                                    onToggleFavorite={handleToggleFavorite}
                                    onShare={handleShare}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <Toaster />
        </div>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const WishlistHeader = ({
    count,
    onRefresh,
    refreshing
}: {
    count: number;
    onRefresh: () => void;
    refreshing: boolean;
}) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D73D32]/10 border border-[#D73D32]/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#D73D32] fill-[#D73D32]" />
            </div>
            <div>
                <h2
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    My Wishlist
                </h2>
                {count > 0 && (
                    <p className="text-xs text-gray-500">{count} {count === 1 ? "item" : "items"} saved</p>
                )}
            </div>
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="count-badge text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                >
                    {count}
                </motion.span>
            )}
        </div>

        <button
            onClick={onRefresh}
            className="refresh-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
        >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
        </button>
    </div>
);

const EmptyWishlist = ({ onBrowse }: { onBrowse: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-glass rounded-3xl p-16 text-center"
    >
        <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full rounded-3xl bg-[#D73D32]/5 border border-[#D73D32]/10 flex items-center justify-center">
                <Heart className="w-9 h-9 text-[#D73D32]/40" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D73D32]/10 border border-[#D73D32]/20 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#D73D32]/60" />
            </div>
        </div>

        <h3
            className="text-xl font-bold text-gray-300 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            Your wishlist is empty
        </h3>
        <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
            Save items you love and come back to them anytime. Your curated list awaits.
        </p>

        <button
            onClick={onBrowse}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm text-white"
            style={{ background: "linear-gradient(135deg, #D73D32, #ff5a4f)", boxShadow: "0 8px 24px rgba(215,61,50,0.35)" }}
        >
            <ShoppingBag className="w-4 h-4" />
            Start browsing
        </button>
    </motion.div>
);