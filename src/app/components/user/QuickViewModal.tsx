import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";

export default function QuickViewModal({ product, open, onClose }: any) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={product.images?.[0]?.image_url}
            className="rounded-xl"
          />

          <div>
            <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-[#D73D32] mb-6">
              ₹{product.price}
            </p>

            <Button className="bg-[#D73D32] text-white w-full">
              Customize Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}