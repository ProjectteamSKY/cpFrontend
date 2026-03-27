// components/NewArrivals.tsx
import { ProductCard } from "../product/ProductCard";
import { SectionHeader } from "./SectionHeader";

const PRICES = [149, 249, 199, 349];

interface NewArrivalsProps {
  products: any[];
  getValidImage: (p: any) => string | null;
}

export function NewArrivals({ products, getValidImage }: NewArrivalsProps) {
  const arrivals = products.filter((p: any) => getValidImage(p) !== null).slice(0, 4);
  if (!arrivals.length) return null;

  return (
    <div className="mb-4">
      <SectionHeader title="✨ New Arrivals" sub="Just added to our catalogue" />
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        {arrivals.map((p: any, i: number) => (
          <ProductCard
            key={`na-${p.id}`}
            product={p}
            imageUrl={getValidImage(p)!}
            tag="new"
            price={PRICES[i % PRICES.length]}
            showDesc={false}
          />
        ))}
      </div>
    </div>
  );
}