// components/FeaturedProducts.tsx
import { ProductCard } from "../product/ProductCard";
import { SectionHeader } from "./SectionHeader";
import { useNavigate } from "react-router";

interface FeaturedProductsProps {
  products: any[];
  loading: boolean;
  getValidImage: (p: any) => string | null;
}

export function FeaturedProducts({ products, loading, getValidImage }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const featured = products.filter((p: any) => getValidImage(p) !== null).slice(0, 8);

  return (
    <div className="mb-4">
      <SectionHeader title="🔥 Best Sellers" sub="Top-ordered products this month" />

      {loading ? (
        <div className="bg-white rounded-[10px] p-12 text-center text-[#bbb]">Loading…</div>
      ) : featured.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 text-center text-[#bbb]">No products found</div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-md:grid-cols-3 max-sm:grid-cols-2">
          {featured.map((p: any) => (
            <ProductCard
              key={p.id}
              product={p}
              viewMode="grid"
              isFavorite={false}
              onProductClick={(id) => navigate(`/product/${id}`)}
              onQuickView={() => {}}
              onImageClick={() => {}}
              onToggleFavorite={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}