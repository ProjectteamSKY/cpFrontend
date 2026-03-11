import { useState, useEffect } from "react";
import { Wishlist } from "../types/wishlist";
import { addToWishlist, getUserWishlist, deleteWishlistItem } from "../service/wishlistApiService";

export const useWishlist = (userId: string | null) => {
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserWishlist(userId);
      setWishlist(data || []); // ✅ ensure array
    } catch (err) {
      console.error("Error fetching wishlist: - useWishlist.ts:16", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const isFavorite = (productId: string) => wishlist?.some(item => item.product_id === productId) ?? false;

  const toggleWishlist = async (productId: string) => {
    if (!userId) return;
    try {
      const existing = wishlist.find(item => item.product_id === productId);
      if (existing) {
        await deleteWishlistItem(existing.id);
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
      } else {
        const newItem = await addToWishlist({ user_id: userId, product_id: productId });
        setWishlist(prev => [...prev, newItem]);
      }
    } catch (err) {
      console.error("Error updating wishlist: - useWishlist.ts:40", err);
    }
  };

  return { wishlist, loading, isFavorite, toggleWishlist, refresh: fetchWishlist };
};