import { ShoppingCart, Eye, Star } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function ProductCard({ product, view, onClick, onQuickView }: any) {
  const image = product.images?.[0]?.image_url;

  return (
    <Card
      className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition ${
        view === "list" ? "flex" : ""
      }`}
      onClick={onClick}
    >
      <div className={`${view === "list" ? "w-64" : "aspect-[4/3]"} bg-gray-100`}>
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <div className="p-5 flex-1">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (product.rating || 4)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-[#D73D32]">
              ₹{product.price}
            </span>
          </div>

          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={e => {
              e.stopPropagation();
              onQuickView();
            }}>
              <Eye className="w-4 h-4" />
            </Button>

            <Button size="sm" className="bg-[#D73D32] text-white">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Order
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}