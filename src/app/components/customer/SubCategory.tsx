import { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────
interface SubcategoryImage {
  id: string;
  url: string;
  is_default: boolean;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
  is_active: number;
  is_deleted: number;
  images: SubcategoryImage[];
}

interface Product {
  id: string;
  name: string;
  price?: number;
  original_price?: number;
  rating?: number;
  review_count?: number;
  badge?: string;
  images?: { url: string; is_default: boolean }[];
}

interface ApiResponse {
  subcategories: Subcategory[];
}

// ── Config ─────────────────────────────────────────────
const BASE_URL = "http://54.206.3.97";

// ── Skeleton Loader ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="group">
      <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden mb-4" style={{ paddingBottom: "125%" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-200% animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/4 animate-pulse" />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────
export default function SubcategoryListPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = location.state?.categoryId || params.get("category");
  const subcategoryId = location.state?.subcategoryId || params.get("subcategory");
  const categoryName = location.state?.categoryName || params.get("categoryName") || "Category";

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Sync URL
  useEffect(() => {
    if (categoryId) {
      navigate(
        `/subcategorylist?category=${categoryId}${subcategoryId ? `&subcategory=${subcategoryId}` : ""}`,
        { replace: true }
      );
    }
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (subcategoryId) {
          const res = await fetch(`${BASE_URL}/api/product/subcategory/${subcategoryId}`);
          const data = await res.json();
          let productList = data.products || [];

          if (sortBy === "price_asc") {
            productList = [...productList].sort((a, b) => (a.price || 0) - (b.price || 0));
          } else if (sortBy === "price_desc") {
            productList = [...productList].sort((a, b) => (b.price || 0) - (a.price || 0));
          } else if (sortBy === "name") {
            productList = [...productList].sort((a, b) => a.name.localeCompare(b.name));
          }

          setProducts(productList);
        } else if (categoryId) {
          const res = await fetch(`${BASE_URL}/api/subcategory/list?category_id=${categoryId}`);
          const data: ApiResponse = await res.json();
          const filtered = data.subcategories.filter((s) => s.is_active === 1 && s.is_deleted === 0);
          setSubcategories(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId, subcategoryId, sortBy]);

  const getImageUrl = (s: Subcategory) => {
    const img = s.images?.find((i) => i.is_default) || s.images?.[0];
    return img ? `${BASE_URL}/${img.url}` : null;
  };

  const getProductImage = (p: Product) => {
    const img = p.images?.find((i) => i.is_default) || p.images?.[0];
    return img ? `${BASE_URL}/${img.url}` : null;
  };

  const filteredSubcategories = subcategories.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isProductMode = !!subcategoryId;
  const count = isProductMode ? filteredProducts.length : filteredSubcategories.length;

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    navigate(
      `/products?subcategory=${subcategory.id}&subcategoryName=${encodeURIComponent(subcategory.name)}`,
      {
        state: {
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
          categoryId: subcategory.category_id,
          // ✅ ADD THIS (if available)
        }
      }
    );
  };
  // products?subcategory=029fab9f-6bc2-4dd8-822f-a8dfd1fe1e38
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white ">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .bg-200% {
          background-size: 200% 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        } 
      `}</style>

      {/* ── Premium Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fadeIn">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <button onClick={() => navigate("/")} className="hover:text-black transition-colors">
                Home
              </button>
              <span className="text-gray-300">/</span>
              <button onClick={() => navigate(-1)} className="hover:text-black transition-colors">
                {categoryName}
              </button>
              {isProductMode && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-black font-medium">Products</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {isProductMode ? "Products" : categoryName}
            </h1>
            <p className="text-gray-500 text-sm">
              {loading ? "Loading..." : `${count.toLocaleString()} ${count === 1 ? "item" : "items"}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Premium Toolbar ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Premium Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-6">
              {isProductMode && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium tracking-wide">SORT BY</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-transparent border-none text-gray-900 font-medium cursor-pointer outline-none focus:ring-0"
                  >
                    <option value="default">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-full transition-all duration-200 ${view === "grid"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-full transition-all duration-200 ${view === "list"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">

        {/* Loading State */}
        {loading && (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "space-y-4"}>
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Premium Subcategory View ── */}
        {!loading && !isProductMode && (
          <>
            {filteredSubcategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-400">Try adjusting your search</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn">
                {filteredSubcategories.map((s, index) => (
                  <div
                    key={s.id}
                    onClick={() => handleSubcategoryClick(s)}
                    className="group cursor-pointer animate-scaleIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative w-full bg-gray-50 rounded-2xl overflow-hidden mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500" style={{ paddingBottom: "125%" }}>
                      {getImageUrl(s) ? (
                        <>
                          <img
                            src={getImageUrl(s)!}
                            alt={s.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                          <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-24" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <span className="text-white text-xs font-medium tracking-wider px-4 py-2 bg-black/80 rounded-full backdrop-blur-sm">
                          EXPLORE
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 text-center group-hover:text-gray-600 transition-colors">
                      {s.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                {filteredSubcategories.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSubcategoryClick(s)}
                    className="group cursor-pointer flex items-center gap-6 p-4 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                      {getImageUrl(s) ? (
                        <img
                          src={getImageUrl(s)!}
                          alt={s.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                        {s.name}
                      </h3>
                      {s.description && s.description !== s.name && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{s.description}</p>
                      )}
                    </div>
                    <div className="text-gray-300 group-hover:text-black transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Premium Product View ── */}
        {!loading && isProductMode && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn">
                {filteredProducts.map((p, index) => {
                  const imgUrl = getProductImage(p);
                  const discount = p.original_price && p.price ? Math.round((1 - p.price / p.original_price) * 100) : null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.id)}
                      className="group cursor-pointer animate-scaleIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onMouseEnter={() => setSelectedProduct(p.id)}
                      onMouseLeave={() => setSelectedProduct(null)}
                    >
                      <div className="relative w-full bg-gray-50 rounded-2xl overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500" style={{ paddingBottom: "125%" }}>
                        {imgUrl ? (
                          <>
                            <img
                              src={imgUrl}
                              alt={p.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent transition-all duration-500" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-50">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Premium Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {p.badge && (
                            <span className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${p.badge.toLowerCase() === "sale" ? "bg-red-500 text-white" :
                              p.badge.toLowerCase() === "new" ? "bg-emerald-500 text-white" :
                                "bg-black/80 text-white"
                              }`}>
                              {p.badge.toUpperCase()}
                            </span>
                          )}
                          {discount && (
                            <span className="text-[10px] font-semibold tracking-wider bg-white/90 backdrop-blur-sm text-red-600 px-2.5 py-1 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        {/* Quick Add Button */}
                        <div className={`absolute bottom-0 left-0 right-0 transform transition-all duration-500 ${selectedProduct === p.id ? "translate-y-0" : "translate-y-full"
                          }`}>
                          <button
                            className="w-full bg-black text-white text-sm font-medium py-3.5 hover:bg-gray-900 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          {p.price !== undefined && (
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{p.price.toLocaleString()}
                            </span>
                          )}
                          {p.original_price && p.original_price !== p.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{p.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {filteredProducts.map((p) => {
                  const imgUrl = getProductImage(p);
                  const discount = p.original_price && p.price ? Math.round((1 - p.price / p.original_price) * 100) : null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.id)}
                      className="group cursor-pointer flex gap-6 p-5 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                    >
                      <div className="relative w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {discount && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                            {p.name}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            {p.price !== undefined && (
                              <span className="text-xl font-bold text-gray-900">
                                ₹{p.price.toLocaleString()}
                              </span>
                            )}
                            {p.original_price && p.original_price !== p.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{p.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="p-2.5 border border-gray-200 rounded-full hover:border-gray-300 transition-all hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}