import { useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "../../constants/productconstants";
import { ShoppingCart, Pencil } from "lucide-react";

export function DesignReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  if (!state || !state.designFile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No design data found</p>
      </div>
    );
  }

  const {
    product,
    variant,
    quantityId,
    totalPrice,
    designFile,
  } = state;

  const previewUrl =
    designFile?.type?.startsWith("image/")
      ? URL.createObjectURL(designFile)
      : null;

  const selectedPrice = variant.prices.find(
    (p: any) => String(p.id) === String(quantityId)
  );

  const handleAddToCart = async () => {
    const formData = new FormData();
    formData.append("product_id", String(product.id));
    formData.append("variant_id", String(variant.id));
    formData.append("price_id", String(quantityId));
    formData.append("design_file", designFile);

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SIDE - DESIGN PREVIEW */}
        <div className="flex items-center justify-center bg-white rounded-xl shadow-lg p-10">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Design Preview"
              className="max-h-[400px] rounded-xl shadow-xl"
            />
          ) : (
            <div className="text-gray-400 text-center">
              Preview not available
            </div>
          )}
        </div>

        {/* RIGHT SIDE - PRODUCT DETAILS */}
        <div className="space-y-6">

          <div>
            <h1 className="text-3xl font-bold">
              Product
              <span className="text-gray-500 text-lg ml-2">
                ({product.name})
              </span>
            </h1>
          </div>

          <Card className="p-6 space-y-4 shadow-md">

            <ul className="space-y-2 text-gray-700">
              <li>• Size: {variant.size?.name}</li>
              <li>• Paper: {variant.paperType?.name}</li>
              <li>• Quantity: {selectedPrice?.min_qty} - {selectedPrice?.max_qty}</li>
            </ul>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-lg">
                {selectedPrice?.max_qty} Pieces
              </p>
              <p className="text-lg font-semibold">
                ₹ {selectedPrice?.price}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
            >
              <Pencil size={14} />
              Edit Order
            </button>

          </Card>

          <div className="border-t pt-6 space-y-2">
            <p className="text-lg text-gray-600">
              Total Price
            </p>

            <p className="text-4xl font-bold">
              ₹ {Number(totalPrice).toFixed(2)}
            </p>

            <p className="text-sm text-gray-500">
              Including shipping and taxes
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-gray-900 text-white py-6 text-lg rounded-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </Button>

        </div>
      </div>
    </div>
  );
}