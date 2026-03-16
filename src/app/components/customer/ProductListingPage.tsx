// pages/ProductListingPage.tsx
import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../../hooks/useProduct";
import { useWishlist } from "../../hooks/useWishlist";
import { ProductHeader } from "../../components/product/ProductHeader";
import { ProductFilters } from "../../components/product/ProductFilter";
import { ProductCard } from "../../components/product/ProductCard";
import { QuickViewModal } from "../../components/product/QuickViewModal";
import { ImageGalleryModal } from "../../components/product/ImageGalleryModal";
import { ProductSkeleton } from "../../components/product/ProductSkeleton";

/* ─────────────────────────────────────────
   Cross-browser scrollbar-hide styles
   injected once at module level so no extra
   CSS file / Tailwind plugin is needed.
───────────────────────────────────────── */
const SCROLLBAR_HIDE_STYLE = `
  .carousel-track {
    -ms-overflow-style: none;      /* IE 10+ */
    scrollbar-width: none;         /* Firefox */
  }
  .carousel-track::-webkit-scrollbar {
    display: none;                 /* Chrome / Safari / Edge */
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-appear {
    animation: fadeSlideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

if (typeof document !== "undefined") {
  const tag = document.getElementById("plp-styles");
  if (!tag) {
    const style = document.createElement("style");
    style.id = "plp-styles";
    style.textContent = SCROLLBAR_HIDE_STYLE;
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────
   Arrow Button — refined chevron
───────────────────────────────────────── */
function ArrowBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${dir}`}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1.5px solid #e2d9c8",
        background: disabled ? "#f5f0e8" : "#fff",
        boxShadow: disabled ? "none" : "0 2px 12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.4 : 1,
        color: "#6b5d4f",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = "#fdf8f0";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#d4af37";
          (e.currentTarget as HTMLButtonElement).style.color = "#d4af37";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#fff";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2d9c8";
        (e.currentTarget as HTMLButtonElement).style.color = "#6b5d4f";
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────
   Scroll progress dots
───────────────────────────────────────── */
function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const dots = Math.min(total, 8);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: dots }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === current % dots ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current % dots ? "#d4af37" : "#e2d9c8",
            transition: "all 0.3s ease",
            display: "block",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: 16,
      }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#e2d9c8" strokeWidth="2" />
        <path d="M22 32h20M32 22v20" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
      </svg>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#6b5d4f", margin: 0, letterSpacing: "0.02em" }}>
        No products found
      </p>
      <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: "#b0a090", margin: 0 }}>
        Try adjusting your filters or search terms
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export function ProductListingPage() {
  const navigate = useNavigate();
  const {
    filteredProducts,
    loading,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    clearFilters,
  } = useProducts();

  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || null;
  const { wishlist, isFavorite, toggleWishlist } = useWishlist(userId);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<any>(null);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [currentDot, setCurrentDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  /* ── scroll state sync ── */
  const syncScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);

    // dot index: which card is most visible
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card ? card.offsetWidth + 16 : 280;
    setCurrentDot(Math.round(scrollLeft / cardWidth));
  }, []);

  /* ── arrow scroll: move exactly one card ── */
  const scroll = useCallback((dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  /* ── handlers ── */
  const handleProductClick = (id: string) => navigate(`/product/${id}`);

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleImageClick = (product: any, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryProduct(product);
    setGalleryImageIndex(idx);
    setShowImageGallery(true);
  };

  const handleShare = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.share?.({ title: product.name, text: product.description, url })
      .catch(() => navigator.clipboard.writeText(url));
  };

  if (loading) return <ProductSkeleton />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "white",
        // fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      {/* Google Font import (safe inline) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* <ProductHeader /> */}

        {/* ── Decorative rule ── */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "28px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #d4af37, transparent)" }} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#d4af37" fillOpacity="0.6" />
          </svg>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #d4af37, transparent)" }} />
        </div> */}

        <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
          {/* ── Sidebar filters ── */}
          <div style={{ flexShrink: 0 }}>
            <ProductFilters
              filters={filters}
              searchQuery={searchQuery}
              showFilters={true}
              onSearchChange={(val) => setSearchQuery(val)}
              onFilterChange={(filterType, value) => {
                setFilters((prev) => {
                  const current = prev[filterType] as string[];
                  const exists = current.includes(value);
                  return {
                    ...prev,
                    [filterType]: exists
                      ? current.filter((item) => item !== value)
                      : [...current, value],
                  };
                });
              }}
              onClearFilters={() => clearFilters()}
              onPriceRangeChange={(min, max) => {
                setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
              }}
            />
          </div>

          {/* ── Carousel area ── */}
          {/* min-w-0 prevents flex child overflow */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── Toolbar: count + arrows + dots ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9e8c7a",
                  fontWeight: 500,
                }}
              >
                {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <ProgressDots
                  total={filteredProducts.length}
                  current={currentDot}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <ArrowBtn dir="left" onClick={() => scroll("left")} disabled={!canScrollLeft} />
                  <ArrowBtn dir="right" onClick={() => scroll("right")} disabled={!canScrollRight} />
                </div>
              </div>
            </div>

            {/* ── Carousel track ── */}
            {filteredProducts.length === 0 ? (
              <EmptyState />
            ) : (
              /*
                overflow-hidden on wrapper → no page-level scrollbar
                carousel-track class → scrollbar hidden on all browsers
              */
              <div style={{ overflow: "hidden", borderRadius: 4 }}>
                <div
                  ref={carouselRef}
                  className="carousel-track"
                  onScroll={syncScrollState}
                  style={{
                    display: "flex",
                    gap: 16,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    paddingBottom: 8,   /* room for card shadows */
                    paddingTop: 4,
                    paddingLeft: 2,
                    paddingRight: 2,
                  }}
                >
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      data-card
                      className="card-appear"
                      style={{
                        flexShrink: 0,
                        // Fixed widths — reliable at every breakpoint
                        width: "clamp(220px, 26vw, 290px)",
                        scrollSnapAlign: "start",
                        animationDelay: `${Math.min(idx * 60, 400)}ms`,
                        cursor: "pointer",
                        borderRadius: 8,
                        /* subtle lift on hover via JS since inline style */
                        transition: "transform 0.22s ease, box-shadow 0.22s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(180,150,100,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                    >
                      <ProductCard
                        product={product}
                        viewMode="grid"
                        isFavorite={isFavorite(product.id)}
                        onProductClick={handleProductClick}
                        onQuickView={handleQuickView}
                        onImageClick={handleImageClick}
                        onToggleFavorite={(id, e) => {
                          e.stopPropagation();
                          toggleWishlist(id);
                        }}
                        onShare={handleShare}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={showQuickView}
        favorites={wishlist.map((item) => item.product_id)}
        onClose={() => setShowQuickView(false)}
        onImageClick={handleImageClick}
        onToggleFavorite={(id, e) => {
          e.stopPropagation();
          toggleWishlist(id);
        }}
      />

      <ImageGalleryModal
        product={galleryProduct}
        isOpen={showImageGallery}
        initialImageIndex={galleryImageIndex}
        onClose={() => setShowImageGallery(false)}
        onIndexChange={setGalleryImageIndex}
      />
    </div>
  );
}