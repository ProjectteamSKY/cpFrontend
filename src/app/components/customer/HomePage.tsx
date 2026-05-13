
// pages/HomePage.tsx
import { useProducts } from "../../hooks/useProduct";
import { BannerCarousel } from "../home/BannerCarousel";
import { CategoryGrid } from "../home/CategoryGrid";
import { FeaturedProducts } from "../home/FeaturedProducts";
import { Footer } from "../home/Footer";
import { HowItWorks } from "../home/HowItWorks";
import { Navbar } from "../home/Navbar";
import { NewArrivals } from "../home/NewArrivals";
import { Newsletter } from "../home/Newsletter";
import { OurCategoryList } from "../home/Ourcategorylist";
import { PromoBar } from "../home/PromoBar";
import { ServiceBand } from "../home/ServiceBand";
import { SplitBanners } from "../home/SplitBanners";
import { Testimonials } from "../home/Testimonials";
import { WhyUs } from "../home/WhyUs";


// ── Helper: extract a valid product image URL ──────────────────────────────
function getValidImage(product: any): string | null {
  let images = product.images;
  if (typeof images === "string") {
    try { images = JSON.parse(images); } catch { return null; }
  }
  if (!Array.isArray(images) || images.length === 0) return null;
  for (const img of images) {
    if (img && typeof img === "object" && typeof img.url === "string" && img.url.startsWith("media/products/"))
      return img.url;
    if (typeof img === "string" && img.startsWith("media/products/"))
      return img;
  }
  return null;
}

export function HomePage() {
  const { filteredProducts, loading } = useProducts();

  return (
    <div className="overflow-x-hidden">
      {/* ── Top bar ── */}
      {/* <PromoBar /> */}

      {/* ── Navigation ── */}
      {/* <Navbar /> */}

      {/* ── Hero carousel ── */}
      <BannerCarousel />

      {/* ── Trust band ── */}
      <ServiceBand />

      {/* ── Main content ── */}
      <div className="max-w-full mx-auto px-6">

        {/* Shop by category */}
        {/* <CategoryGrid /> */}

        {/* Best sellers */}
        <FeaturedProducts
          products={filteredProducts}
          loading={loading}
          getValidImage={getValidImage}
        />

        {/* Why us */}
        <WhyUs />
        <OurCategoryList />
        {/* How it works */}
        <HowItWorks />

        {/* New arrivals */}


        {/* Split promo banners */}

        {/* Testimonials */}
        <Testimonials />
        <SplitBanners />

        {/* Newsletter */}

      </div>


    </div>
  );
}