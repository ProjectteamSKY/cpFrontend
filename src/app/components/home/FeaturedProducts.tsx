import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

const BASE_URL = "http://127.0.0.1:8000";

// ---------------- IMAGE HELPERS ----------------

function cleanImageString(image: any): string | null {
  if (!image || typeof image !== "string") return null;

  let cleaned = image.replace(/^["[\]]+|["[\]]+$/g, "").trim();

  if (!cleaned || cleaned === "null" || cleaned === "undefined") {
    return null;
  }

  return cleaned;
}

function getValidImageUrl(image: any): string | null {
  const cleaned = cleanImageString(image);

  if (!cleaned) return null;

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  if (cleaned.startsWith("/media/")) {
    return `${BASE_URL}${cleaned}`;
  }

  if (cleaned.startsWith("media/")) {
    return `${BASE_URL}/${cleaned}`;
  }

  if (cleaned.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return `${BASE_URL}/media/products/${cleaned}`;
  }

  return `${BASE_URL}/${cleaned}`;
}

// ---------------- TYPES ----------------

interface Product {
  id: string;
  name: string;
  image: string | null;
  category?: string;
}

// ---------------- SKELETON ----------------

function SkeletonCard() {
  return (
    <div className="fp-card fp-skeleton">
      <div className="fp-img-wrap fp-skel-img" />
      <div className="fp-body">
        <div className="fp-skel-line w-70" />
        <div className="fp-skel-line w-40 mt-2" />
      </div>
    </div>
  );
}

// ---------------- COMPONENT ----------------

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ---------------- FETCH PRODUCTS ----------------

  useEffect(() => {
    fetch(`${BASE_URL}/api/product/minimal/list`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        let productList = data.products || data.data?.products || data;

        if (!Array.isArray(productList)) {
          productList = [];
        }

        const validProducts = productList.filter((product: Product) => {
          return getValidImageUrl(product.image);
        });

        setProducts(validProducts);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ---------------- ANIMATION ----------------

  useEffect(() => {
    if (!loading && sectionRef.current) {
      const cards =
        sectionRef.current.querySelectorAll(".fp-card:not(.fp-skeleton)");

      cards.forEach((card, i) => {
        (card as HTMLElement).style.animationDelay = `${i * 70}ms`;
        card.classList.add("fp-animate");
      });
    }
  }, [loading]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const displayProducts = products.slice(0, 12);

  return (
    <>
      <style>{`
      
      :root{
        --primary:#0F172A;
        --secondary:#64748B;
        --accent:#ff6b35;
        --border:#EAEAEA;
        --bg:#ffffff;
      }

      *{
        box-sizing:border-box;
      }

      .fp-section{
        width:100%;
        padding:40px 0;
        background:#fff;
      }

      /* ---------------- HEADER ---------------- */

      .fp-header{
        display:flex;
        align-items:end;
        justify-content:space-between;
        gap:20px;
        margin-bottom:28px;
      }

      .fp-label{
        font-size:.75rem;
        text-transform:uppercase;
        letter-spacing:.18em;
        color:var(--accent);
        font-weight:700;
        margin-bottom:8px;
      }

      .fp-title{
        font-size:clamp(1.8rem,4vw,3rem);
        font-weight:800;
        color:var(--primary);
        line-height:1;
        margin:0;
        letter-spacing:-0.04em;
      }

      .fp-subtitle{
        color:var(--secondary);
        margin-top:12px;
        font-size:.95rem;
      }

      .fp-badge{
        padding:10px 18px;
        border-radius:999px;
        background:#fff5f1;
        border:1px solid #ffd8ca;
        color:var(--accent);
        font-size:.75rem;
        font-weight:700;
        backdrop-filter:blur(12px);
      }

      /* ---------------- GRID ---------------- */

      .fp-grid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:24px;
      }

      @media(max-width:1200px){
        .fp-grid{
          grid-template-columns:repeat(3,1fr);
        }
      }

      @media(max-width:768px){
        .fp-grid{
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        }
      }

      @media(max-width:500px){
        .fp-grid{
          grid-template-columns:1fr;
        }
      }

      /* ---------------- CARD ---------------- */

      .fp-card{
        position:relative;
        overflow:hidden;
        border-radius:28px;
        background:#fff;
        border:1px solid rgba(0,0,0,.06);
        cursor:pointer;
        opacity:0;
        transform:translateY(30px);

        transition:
          transform .45s cubic-bezier(.22,1,.36,1),
          box-shadow .35s ease,
          border-color .25s ease;
      }

      .fp-animate{
        animation:fpReveal .7s cubic-bezier(.22,1,.36,1) forwards;
      }

      @keyframes fpReveal{
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      .fp-card:hover{
        transform:translateY(-10px);
        box-shadow:
          0 25px 50px rgba(0,0,0,.12),
          0 8px 20px rgba(0,0,0,.08);

        border-color:rgba(255,107,53,.2);
      }

      /* ---------------- IMAGE ---------------- */

      .fp-img-wrap{
        position:relative;
        width:100%;
        aspect-ratio:1/1;
        overflow:hidden;
        background:#f6f6f6;
      }

      .fp-img-wrap img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;

        transition:
          transform .7s cubic-bezier(.22,1,.36,1),
          filter .4s ease;
      }

      .fp-card:hover img{
        transform:scale(1.08);
      }

      /* ---------------- OVERLAY ---------------- */

      .fp-overlay{
        position:absolute;
        inset:0;

        background:
          linear-gradient(
            to top,
            rgba(0,0,0,.5),
            rgba(0,0,0,.1),
            transparent
          );

        opacity:0;
        transition:opacity .35s ease;
      }

      .fp-card:hover .fp-overlay{
        opacity:1;
      }

      /* ---------------- QUICK BUTTON ---------------- */

      .fp-cta{
        position:absolute;
        left:50%;
        bottom:18px;

        transform:translateX(-50%) translateY(14px);

        background:rgba(255,255,255,.95);
        backdrop-filter:blur(16px);

        color:#111;

        border-radius:999px;

        padding:11px 18px;

        font-size:.72rem;
        font-weight:700;

        opacity:0;

        transition:
          opacity .3s ease,
          transform .3s ease;
      }

      .fp-card:hover .fp-cta{
        opacity:1;
        transform:translateX(-50%) translateY(0);
      }

      /* ---------------- BODY ---------------- */

      .fp-body{
        padding:18px;
      }

      .fp-name{
        font-size:1rem;
        font-weight:700;
        line-height:1.4;
        color:var(--primary);

        margin:0 0 8px;

        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
      }

      .fp-bottom{
        display:flex;
        align-items:center;
        justify-content:space-between;
      }

      .fp-cat{
        font-size:.78rem;
        color:#64748B;
        font-weight:500;
      }

      .fp-arrow{
        width:36px;
        height:36px;

        display:flex;
        align-items:center;
        justify-content:center;

        border-radius:50%;

        background:#f5f5f5;

        transition:
          background .25s ease,
          transform .25s ease;
      }

      .fp-card:hover .fp-arrow{
        background:var(--accent);
        color:#fff;
        transform:translateX(4px);
      }

      /* ---------------- SKELETON ---------------- */

      .fp-skeleton{
        opacity:1 !important;
        transform:none !important;
        pointer-events:none;
      }

      .fp-skel-img,
      .fp-skel-line{
        background:
          linear-gradient(
            90deg,
            #ececec 25%,
            #f5f5f5 50%,
            #ececec 75%
          );

        background-size:200% 100%;

        animation:fpShimmer 1.4s infinite linear;
      }

      .fp-skel-img{
        aspect-ratio:1/1;
      }

      .fp-skel-line{
        height:10px;
        border-radius:999px;
      }

      .w-70{
        width:70%;
      }

      .w-40{
        width:40%;
      }

      .mt-2{
        margin-top:10px;
      }

      @keyframes fpShimmer{
        0%{
          background-position:200% 0;
        }
        100%{
          background-position:-200% 0;
        }
      }

      /* ---------------- EMPTY ---------------- */

      .fp-empty{
        grid-column:1/-1;
        padding:80px 20px;
        text-align:center;
        border-radius:24px;
        background:#fafafa;
        color:#999;
        font-weight:500;
      }

      /* ---------------- PLACEHOLDER ---------------- */

      .fp-placeholder{
        width:100%;
        height:100%;

        display:flex;
        align-items:center;
        justify-content:center;

        background:
          linear-gradient(
            135deg,
            #f4f4f4,
            #ececec
          );

        color:#bbb;
        font-size:.8rem;
      }

      `}</style>

      <section className="fp-section">
        {/* HEADER */}

        <div className="fp-header">
          <div>
            <p className="fp-label">Premium Collection</p>

            <h2 className="fp-title">
              Featured Products
            </h2>

            <p className="fp-subtitle">
              Discover trending products crafted for modern shoppers.
            </p>
          </div>

          <div className="fp-badge">
            {displayProducts.length}+ Products
          </div>
        </div>

        {/* GRID */}

        <div className="fp-grid" ref={sectionRef}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : displayProducts.length === 0 ? (
            <div className="fp-empty">
              No products found.
            </div>
          ) : (
            displayProducts.map((product) => {
              const imageUrl = getValidImageUrl(product.image);

              const hasError = imageErrors[product.id];

              return (
                <div
                  key={product.id}
                  className="fp-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/product/${product.id}`);
                    }
                  }}
                >
                  {/* IMAGE */}

                  <div className="fp-img-wrap">
                    {!hasError && imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="fp-placeholder">
                        No Image
                      </div>
                    )}

                    <div className="fp-overlay" />

                    <span className="fp-cta">
                      View Product
                    </span>
                  </div>

                  {/* BODY */}

                  <div className="fp-body">
                    <p className="fp-name">
                      {product.name}
                    </p>

                    <div className="fp-bottom">
                      <span className="fp-cat">
                        {product.category || "Premium"}
                      </span>

                      <div className="fp-arrow">
                        →
                      </div>
                    </div>
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