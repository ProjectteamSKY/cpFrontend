import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

const BASE_URL = "http://54.206.3.97/";

function getValidImage(image: any): string | null {
  if (!image) return null;
  if (image === "[" || image === '"' || image === "]") return null;
  if (typeof image === "string" && image.startsWith("http")) return image;
  if (typeof image === "string") return BASE_URL + image;
  return null;
}

function SkeletonCard() {
  return (
    <div className="fp-card fp-skeleton">
      <div className="fp-img-wrap fp-skel-img" />
      <div className="fp-body">
        <div className="fp-skel-line" style={{ width: "70%" }} />
        <div className="fp-skel-line" style={{ width: "45%", marginTop: "6px" }} />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://54.206.3.97/api/product/minimal/list")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll(".fp-card:not(.fp-skeleton)");
      cards.forEach((card, i) => {
        (card as HTMLElement).style.animationDelay = `${i * 80}ms`;
        card.classList.add("fp-animate");
      });
    }
  }, [loading]);

  const validProducts = products
    .filter((p) => getValidImage(p.image) !== null)
    .slice(0, 12);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .fp-section {
          font-family: 'Sora', sans-serif;
          padding-bottom: 2.5rem;
        }

        .fp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .fp-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E05C2A;
          margin-bottom: 4px;
        }

        .fp-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #111;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .fp-badge {
          background: #FFF0EA;
          color: #E05C2A;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 100px;
          border: 1px solid #F5C9B5;
          white-space: nowrap;
        }

        .fp-divider {
          height: 1px;
          background: linear-gradient(to right, #E5E0D9, transparent);
          margin-bottom: 1.75rem;
        }

        /* ── 3 columns fixed ── */
        .fp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 600px) {
          .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 0.875rem; }
        }

        .fp-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid #EBEBEB;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease,
                      border-color 0.2s ease;
          opacity: 0;
          transform: translateY(18px);
          display: flex;
          flex-direction: column;
        }

        .fp-animate {
          animation: fpReveal 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes fpReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        .fp-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 18px 40px rgba(0,0,0,0.11), 0 4px 12px rgba(0,0,0,0.06);
          border-color: transparent;
        }

        .fp-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #F5F2EE;
        }

        .fp-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .fp-card:hover .fp-img-wrap img {
          transform: scale(1.08);
        }

        .fp-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.28s ease;
        }

        .fp-card:hover .fp-overlay { opacity: 1; }

        .fp-cta {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: #fff;
          color: #111;
          font-family: 'Sora', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 6px 16px;
          border-radius: 100px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.22s ease, transform 0.22s ease;
          pointer-events: none;
        }

        .fp-card:hover .fp-cta {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .fp-body {
          padding: 0.875rem 1rem 1rem;
          flex: 1;
        }

        .fp-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1A1A1A;
          line-height: 1.4;
          margin: 0 0 3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .fp-cat {
          font-size: 0.7rem;
          color: #999;
          font-weight: 400;
        }

        /* Skeleton */
        .fp-skeleton {
          opacity: 1 !important;
          transform: none !important;
          cursor: default;
          pointer-events: none;
        }

        .fp-skel-img {
          aspect-ratio: 1/1;
          background: linear-gradient(90deg, #EDEBE7 25%, #E4E1DC 50%, #EDEBE7 75%);
          background-size: 200% 100%;
          animation: fpShimmer 1.5s infinite;
        }

        .fp-skel-line {
          height: 10px;
          border-radius: 6px;
          background: linear-gradient(90deg, #EDEBE7 25%, #E4E1DC 50%, #EDEBE7 75%);
          background-size: 200% 100%;
          animation: fpShimmer 1.5s infinite;
        }

        @keyframes fpShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .fp-empty {
          grid-column: 1/-1;
          text-align: center;
          padding: 3.5rem 1rem;
          color: #aaa;
          font-size: 0.9rem;
        }
      `}</style>

      <section className="fp-section">
        <div className="fp-header">
          <div>
            <p className="fp-label">Explore</p>
            <h2 className="fp-title">Our Products</h2>
          </div>
          {!loading && validProducts.length > 0 && (
            <span className="fp-badge">{validProducts.length} items</span>
          )}
        </div>

        <div className="fp-divider" />

        <div className="fp-grid" ref={sectionRef}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : validProducts.length === 0 ? (
            <div className="fp-empty">No products found.</div>
          ) : (
            validProducts.map((product) => {
              const imageUrl = getValidImage(product.image);
              return (
                <div
                  key={product.id}
                  className="fp-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="fp-img-wrap">
                    <img
                      src={imageUrl || "/placeholder.png"}
                      alt={product.name}
                      onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                    />
                    <div className="fp-overlay" />
                    <span className="fp-cta">View Product</span>
                  </div>
                  <div className="fp-body">
                    <p className="fp-name">{product.name}</p>
                    {product.category && (
                      <span className="fp-cat">{product.category}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}