// wishlist.service.ts
import axios from "axios";
import { Wishlist, WishlistCreatePayload } from "../types/wishlist";

const API_BASE = "https://api.citizenprintz.in/api/wishlist_routes"; // adjust your base path
// -----------------
// CREATE
// -----------------
export const addToWishlist = async (payload: WishlistCreatePayload): Promise<Wishlist> => {
  const res = await axios.post(`${API_BASE}/create`, payload);
  return res.data.data;
};

// -----------------
// GET ALL
// -----------------
export const getAllWishlists = async (): Promise<Wishlist[]> => {
  const res = await axios.get(`${API_BASE}/list`);
  return res.data.wishlists;
};

// -----------------
// GET BY USER
// -----------------
export const getUserWishlist = async (userId: string): Promise<Wishlist[]> => {
  const res = await axios.get(`${API_BASE}/user/${userId}`);
  return res.data.wishlists;
};

// -----------------
// DELETE
// -----------------
export const deleteWishlistItem = async (id: string): Promise<{ id: string }> => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};