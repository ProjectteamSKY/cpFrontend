import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

const BASE_URL = "https://api.citizenprintz.in";

// ---------------- IMAGE HELPERS ----------------

function getValidImageUrl(image: any): string | null {
  if (!image || typeof image !== "string") return null;

  const cleaned = image.trim();

  if (!cleaned) return null;

  // full url
  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://")
  ) {
    return cleaned;
  }

  // /media/abc.jpg
  if (cleaned.startsWith("/media/")) {
    return `${BASE_URL}${cleaned}`;
  }

  // media/abc.jpg
  if (cleaned.startsWith("media/")) {
    return `${BASE_URL}/${cleaned}`;
  }

  // fallback
  return `${BASE_URL}/${cleaned}`;
}

// ---------------- TYPES ----------------

interface SubcategoryImage {
  id: string;
  url: string;
  is_default: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  is_active?: boolean;
  images?: SubcategoryImage[];
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

export function OurCategoryList() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [imageErrors, setImageErrors] = useState<
    Record<string, boolean>
  >({});

  const sectionRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // ---------------- FETCH ----------------

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/subcategory/minimal/list`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const list: Subcategory[] =
          data?.subcategories || [];

        // keep only active categories
        const activeSubcategories = list.filter(
          (item) => item?.is_active
        );

        setSubcategories(activeSubcategories);
      } catch (error) {
        console.error(
          "Failed to fetch subcategories:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  // ---------------- CARD ANIMATION ----------------

  useEffect(() => {
    if (!loading && sectionRef.current) {
      const cards =
        sectionRef.current.querySelectorAll(
          ".fp-card:not(.fp-skeleton)"
        );

      cards.forEach((card, i) => {
        (card as HTMLElement).style.animationDelay = `${i * 70}ms`;

        card.classList.add("fp-animate");
      });
    }
  }, [loading]);

  // ---------------- IMAGE ERROR ----------------

  const handleImageError = (subcategoryId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [subcategoryId]: true,
    }));
  };

  // ---------------- NAVIGATION ----------------

  const handleNavigate = (subcategory: Subcategory) => {
    const encodedName = encodeURIComponent(
      subcategory.name.toLowerCase()
    );

    navigate(
      `/products?subcategory=${subcategory.id}&subcategoryName=${encodedName}`
    );
  };

  // limit display
  const displaySubcategories = subcategories.slice(0, 12);

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
      }

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

      .fp-cta{
        position:absolute;
        left:50%;
        bottom:18px;

        transform:
          translateX(-50%)
          translateY(14px);

        background:rgba(255,255,255,.95);

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

        transform:
          translateX(-50%)
          translateY(0);
      }

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

        text-transform:capitalize;
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

      .fp-empty{
        grid-column:1/-1;

        padding:80px 20px;

        text-align:center;

        border-radius:24px;

        background:#fafafa;

        color:#999;

        font-weight:500;
      }

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
        <div className="fp-header">
          <div>
            <p className="fp-label">
              Premium Collection
            </p>

            <h2 className="fp-title">
              Featured Categories
            </h2>

            <p className="fp-subtitle">
              Discover premium printing categories
              for your business.
            </p>
          </div>

          <div className="fp-badge">
            {displaySubcategories.length}+ Categories
          </div>
        </div>

        <div className="fp-grid" ref={sectionRef}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : displaySubcategories.length === 0 ? (
            <div className="fp-empty">
              No categories found.
            </div>
          ) : (
            displaySubcategories.map((subcategory) => {
              // get default image
              const defaultImage =
                subcategory.images?.find(
                  (img) => img.is_default
                )?.url ||
                subcategory.images?.[0]?.url;

              // convert to full url
              const imageUrl =
                getValidImageUrl(defaultImage);

              const hasError =
                imageErrors[subcategory.id];

              return (
                <div
                  key={subcategory.id}
                  className="fp-card"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    handleNavigate(subcategory)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === " "
                    ) {
                      e.preventDefault();

                      handleNavigate(subcategory);
                    }
                  }}
                >
                  <div className="fp-img-wrap">
                    {!hasError && imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={subcategory.name}
                        loading="lazy"
                        onError={() =>
                          handleImageError(
                            subcategory.id
                          )
                        }
                      />
                    ) : (
                      <div className="fp-placeholder">
                        No Image
                      </div>
                    )}

                    <div className="fp-overlay" />

                    <span className="fp-cta">
                      View Category
                    </span>
                  </div>

                  <div className="fp-body">
                    <p className="fp-name">
                      {subcategory.name}
                    </p>

                    <div className="fp-bottom">
                      <span className="fp-cat">
                        {subcategory.category_name ||
                          "Premium"}
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