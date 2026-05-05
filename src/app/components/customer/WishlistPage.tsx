import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw, ShoppingBag, X } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import { ProductCard } from "../../components/product/ProductCard";
import { ProductSkeleton } from "../../components/product/ProductSkeleton";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { getProductsByIds } from "../../service/productApiService";
import { toast } from "react-toastify";
import { Toaster } from "../../components/ui/toaster";
import { getUserId } from "../../utils/authStorage";

export const WishlistPage = () => {
    const navigate = useNavigate();
    const userId = getUserId();

    const { wishlist, loading, isFavorite, toggleWishlist, refresh } =
        useWishlist(userId || "");

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

            const normalized = products.map((product: any) => {
                const images = [
                    ...(product.images || []),
                    ...(product.related_images || [])
                ];

                return {
                    ...product,
                    images
                };
            });

            setWishlistProducts(normalized);
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
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <WishlistHeader
                    count={0}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                />
                <ProductSkeleton />
            </div>
        );
    }

    if (!wishlistProducts.length) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <WishlistHeader
                    count={0}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                />
                <EmptyWishlist onBrowse={() => navigate("/")} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <WishlistHeader
                count={wishlistProducts.length}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />

            {/* GRID */}
            <AnimatePresence>
                <motion.div
                    className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8"
                >
                    {wishlistProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                delay: i * 0.05,
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="group relative"
                        >
                            {/* PRODUCT CARD */}
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
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <Toaster />
        </div>
    );
};

/* ───────────── HEADER ───────────── */

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
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    My Wishlist
                </h1>
                {count > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        {count} {count === 1 ? "item" : "items"} saved
                    </p>
                )}
            </div>
        </div>

        <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-white border border-gray-300 text-gray-700
            hover:bg-gray-50 hover:border-gray-400
            transition duration-200"
        >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
        </button>
    </div>
);

/* ───────────── EMPTY STATE ───────────── */

const EmptyWishlist = ({ onBrowse }: { onBrowse: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20">
        <Heart className="w-16 h-16 text-gray-300 mb-6" />

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
        </h3>

        <p className="text-gray-600 max-w-sm text-center mb-8">
            Start adding items to your wishlist and save them for later.
        </p>

        <button
            onClick={onBrowse}
            className="px-6 py-2 rounded-lg text-white font-medium
            bg-red-600 hover:bg-red-700
            transition duration-200"
        >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Browse Products
        </button>
    </div>
);