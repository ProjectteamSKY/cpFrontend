// wishlist.types.ts

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistCreatePayload {
  user_id: string;
  product_id: string;
}