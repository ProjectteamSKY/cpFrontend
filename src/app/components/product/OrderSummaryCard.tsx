import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface Props {
  productName: string;
  variant: any;
  quantityId: string;
  totalPrice: number;
  uploadedFile: File | null;
  onAddToCart: () => void;
}

export const OrderSummaryCard = ({
  productName,
  variant,
  quantityId,
  totalPrice,
  uploadedFile,
  onAddToCart
}: Props) => {

  const selectedPrice = variant?.prices?.find(
    (p: any) => String(p.id) === String(quantityId)
  );

  return (
    <Card className="p-6 sticky top-24 shadow-xl rounded-2xl border bg-white space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your configuration
        </p>
      </div>

      {/* Product */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Product</span>
          <span className="font-medium">{productName}</span>
        </div>

        {variant && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Size</span>
              <span>{variant.size?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Paper</span>
              <span>{variant.paperType?.name}</span>
            </div>
          </>
        )}

        {selectedPrice && (
          <div className="flex justify-between">
            <span className="text-gray-500">Quantity</span>
            <span>
              {selectedPrice.min_qty} - {selectedPrice.max_qty}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t pt-4">

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-[#D73D32]">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Inclusive of all taxes
        </p>

      </div>

      {/* Upload Status */}
      <div className="text-sm">
        {uploadedFile ? (
          <p className="text-green-600 font-medium">
            ✔ Design Uploaded
          </p>
        ) : (
          <p className="text-red-500">
            Please upload your design to continue
          </p>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={onAddToCart}
        disabled={!uploadedFile}
        className="w-full h-12 text-lg bg-[#D73D32] hover:bg-[#B83227] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploadedFile ? "Add to Cart" : "Upload Design First"}
      </Button>

    </Card>
  );
};