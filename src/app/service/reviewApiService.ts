
import api from "./api";

export const getallReviews = async (productId: string) => {
  const res = await api.get(`/review/product/${productId}/latest`);
  return res.data;
};