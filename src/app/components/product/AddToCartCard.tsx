import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { API_BASE_URL } from "../../constants/productconstants";

interface Props {
  productId: string;
  variantId: string;
  priceId: string;
  totalPrice: number;
  uploadedFile: File | null;
}

export const AddToCartCard = ({
  productId,
  variantId,
  priceId,
  totalPrice,
  uploadedFile
}: Props) => {

  const handleAddToCart = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("variant_id", variantId);
    formData.append("price_id", priceId);
    formData.append("design_file", uploadedFile);

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Added to cart successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-[#D73D32] to-[#B83227] text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">Total Price</p>
          <p className="text-3xl font-bold">
            ₹{totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Delivery</p>
          <p className="font-semibold">3-5 Business Days</p>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!uploadedFile}
        className="w-full bg-white text-[#D73D32] hover:bg-white/90 h-14 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploadedFile ? "Add to Cart" : "Upload Design to Continue"}
      </Button>
    </Card>
  );
};