// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router";
// import { useWishlist } from "../../hooks/useWishlist";

// /* ─────────────────────────────────────────
//    Types based on your actual response
// ───────────────────────────────────────── */
// interface ProductImage {
//   id: string;
//   url: string;
//   is_default?: boolean;
// }

// interface Price {
//   id: string;
//   price: number;
//   min_qty: number;
// }

// interface Variant {
//   id: string;
//   size_id: string;
//   paper_type_id: string;
//   print_type_id: string;
//   cut_type_id: string;
//   sides: number;
//   orientation: string;
//   prices: Price[];
// }

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   category_id: string;
//   subcategory_id: string;
//   image: ProductImage;
//   images: ProductImage[];
//   related_images: ProductImage[];
//   variants: Variant[];
// }

// /* ─────────────────────────────────────────
//    Constants
// ───────────────────────────────────────── */
// const BASE_URL = "http://54.206.3.97";

// /* ─────────────────────────────────────────
//    Helper Functions
// ───────────────────────────────────────── */
// function getImageUrl(image?: ProductImage): string {
//   if (!image || !image.url) {
//     return "https://placehold.co/600x800/f5f5f7/e5e5e8?text=No+Image";
//   }
//   if (image.url.startsWith("http")) {
//     return image.url;
//   }
//   return `${BASE_URL}/${image.url}`;
// }

// function getAllImages(product: Product): ProductImage[] {
//   const images = [];
//   if (product.image) images.push(product.image);
//   if (product.images && product.images.length > 0) {
//     images.push(...product.images);
//   }
//   if (product.related_images && product.related_images.length > 0) {
//     images.push(...product.related_images);
//   }
//   return images.filter((img, index, self) => 
//     index === self.findIndex((i) => i.id === img.id)
//   );
// }

// function getMinPrice(variants?: Variant[]): number | null {
//   if (!variants?.length) return null;
//   const all = variants.flatMap((v) => v.prices.map((p) => p.price));
//   return all.length ? Math.min(...all) : null;
// }

// function getMaxPrice(variants?: Variant[]): number | null {
//   if (!variants?.length) return null;
//   const all = variants.flatMap((v) => v.prices.map((p) => p.price));
//   return all.length ? Math.max(...all) : null;
// }

// function getMinQty(variants?: Variant[]): number | null {
//   if (!variants?.length) return null;
//   const all = variants.flatMap((v) => v.prices.map((p) => p.min_qty));
//   return all.length ? Math.min(...all) : null;
// }

// /* ─────────────────────────────────────────
//    Breadcrumb Component
// ───────────────────────────────────────── */
// function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
//   return (
//     <nav className="flex items-center gap-1.5 text-xs sm:text-sm flex-wrap mb-6">
//       {items.map((item, idx) => (
//         <React.Fragment key={idx}>
//           {idx > 0 && (
//             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//             </svg>
//           )}
//           {item.href ? (
//             <a href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
//               {item.label}
//             </a>
//           ) : (
//             <span className="text-gray-900 font-medium">{item.label}</span>
//           )}
//         </React.Fragment>
//       ))}
//     </nav>
//   );
// }

// /* ─────────────────────────────────────────
//    Filter Sidebar - Apple Style
// ───────────────────────────────────────── */
// function FilterSidebar({
//   priceRange,
//   onPriceRangeChange,
//   sortBy,
//   onSortChange,
//   showInStockOnly,
//   onInStockChange,
//   onClearFilters,
//   hasActiveFilters,
// }: {
//   priceRange: { min: number; max: number };
//   onPriceRangeChange: (range: { min: number; max: number }) => void;
//   sortBy: string;
//   onSortChange: (value: string) => void;
//   showInStockOnly: boolean;
//   onInStockChange: (value: boolean) => void;
//   onClearFilters: () => void;
//   hasActiveFilters: boolean;
// }) {
//   return (
//     <div className="space-y-8">
//       {/* Sort Section */}
//       <div>
//         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sort By</h3>
//         <div className="space-y-2">
//           {[
//             { value: "default", label: "Recommended" },
//             { value: "price_asc", label: "Price: Low to High" },
//             { value: "price_desc", label: "Price: High to Low" },
//             { value: "name_asc", label: "Name: A to Z" },
//             { value: "name_desc", label: "Name: Z to A" },
//           ].map((option) => (
//             <button
//               key={option.value}
//               onClick={() => onSortChange(option.value)}
//               className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
//                 sortBy === option.value
//                   ? "bg-gray-900 text-white font-medium"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Price Range Section */}
//       <div>
//         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Price Range</h3>
//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <div className="relative flex-1">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={priceRange.min || ''}
//                 onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
//                 className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50"
//               />
//             </div>
//             <span className="text-gray-400">—</span>
//             <div className="relative flex-1">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={priceRange.max || ''}
//                 onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
//                 className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Availability Section */}
//       <div>
//         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Availability</h3>
//         <label className="flex items-center gap-3 cursor-pointer group">
//           <div className="relative">
//             <input
//               type="checkbox"
//               checked={showInStockOnly}
//               onChange={(e) => onInStockChange(e.target.checked)}
//               className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
//             />
//           </div>
//           <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
//             In Stock Only
//           </span>
//         </label>
//       </div>

//       {/* Clear Filters Button */}
//       {hasActiveFilters && (
//         <button
//           onClick={onClearFilters}
//           className="w-full mt-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all"
//         >
//           Clear All Filters
//         </button>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Mobile Filter Drawer
// ───────────────────────────────────────── */
// function MobileFilterDrawer({
//   isOpen,
//   onClose,
//   priceRange,
//   onPriceRangeChange,
//   sortBy,
//   onSortChange,
//   showInStockOnly,
//   onInStockChange,
//   onApply,
//   onClear,
//   hasChanges,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   priceRange: { min: number; max: number };
//   onPriceRangeChange: (range: { min: number; max: number }) => void;
//   sortBy: string;
//   onSortChange: (value: string) => void;
//   showInStockOnly: boolean;
//   onInStockChange: (value: boolean) => void;
//   onApply: () => void;
//   onClear: () => void;
//   hasChanges: boolean;
// }) {
//   const [localSortBy, setLocalSortBy] = useState(sortBy);
//   const [localPriceRange, setLocalPriceRange] = useState(priceRange);
//   const [localInStock, setLocalInStock] = useState(showInStockOnly);

//   useEffect(() => {
//     if (isOpen) {
//       setLocalSortBy(sortBy);
//       setLocalPriceRange(priceRange);
//       setLocalInStock(showInStockOnly);
//     }
//   }, [isOpen, sortBy, priceRange, showInStockOnly]);

//   const handleApply = () => {
//     onSortChange(localSortBy);
//     onPriceRangeChange(localPriceRange);
//     onInStockChange(localInStock);
//     onApply();
//   };

//   const handleClear = () => {
//     setLocalSortBy("default");
//     setLocalPriceRange({ min: 0, max: 0 });
//     setLocalInStock(false);
//     onClear();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 lg:hidden">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//           <button onClick={onClose} className="p-1">
//             <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {/* Sort */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
//             <div className="space-y-2">
//               {[
//                 { value: "default", label: "Recommended" },
//                 { value: "price_asc", label: "Price: Low to High" },
//                 { value: "price_desc", label: "Price: High to Low" },
//                 { value: "name_asc", label: "Name: A to Z" },
//                 { value: "name_desc", label: "Name: Z to A" },
//               ].map((option) => (
//                 <button
//                   key={option.value}
//                   onClick={() => setLocalSortBy(option.value)}
//                   className={`block w-full text-left py-3 px-4 rounded-xl transition-all ${
//                     localSortBy === option.value
//                       ? "bg-gray-900 text-white"
//                       : "bg-gray-50 text-gray-700"
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Price Range */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
//             <div className="flex gap-3">
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 value={localPriceRange.min || ''}
//                 onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: parseInt(e.target.value) || 0 })}
//                 className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50"
//               />
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 value={localPriceRange.max || ''}
//                 onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: parseInt(e.target.value) || 0 })}
//                 className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50"
//               />
//             </div>
//           </div>

//           {/* Availability */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
//             <label className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 checked={localInStock}
//                 onChange={(e) => setLocalInStock(e.target.checked)}
//                 className="w-5 h-5 rounded border-gray-300"
//               />
//               <span className="text-gray-700">In Stock Only</span>
//             </label>
//           </div>
//         </div>

//         <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
//           <button
//             onClick={handleClear}
//             className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleApply}
//             className="flex-1 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Product Card - Apple/Nike Style (Light Grey Background)
// ───────────────────────────────────────── */
// function ProductCard({
//   product,
//   isFavorite,
//   onToggleWishlist,
//   onClick,
//   index,
// }: {
//   product: Product;
//   isFavorite: boolean;
//   onToggleWishlist: () => void;
//   onClick: () => void;
//   index: number;
// }) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [imgError, setImgError] = useState(false);

//   const allImages = useMemo(() => getAllImages(product), [product]);
//   const mainImage = allImages[currentImageIndex] || product.image;
//   const minPrice = getMinPrice(product.variants);
//   const maxPrice = getMaxPrice(product.variants);
//   const minQty = getMinQty(product.variants);

//   useEffect(() => {
//     if (!isHovered || allImages.length <= 1) return;
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isHovered, allImages.length]);

//   const priceDisplay = minPrice ? (
//     maxPrice && maxPrice > minPrice ? (
//       <div className="flex items-baseline gap-1">
//         <span className="text-base font-semibold text-gray-900">₹{minPrice.toLocaleString()}</span>
//         <span className="text-xs text-gray-400">-</span>
//         <span className="text-base font-semibold text-gray-900">₹{maxPrice.toLocaleString()}</span>
//       </div>
//     ) : (
//       <span className="text-base font-semibold text-gray-900">₹{minPrice.toLocaleString()}</span>
//     )
//   ) : (
//     <span className="text-sm text-gray-500">Contact for price</span>
//   );

//   return (
//     <div
//       className="group cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => {
//         setIsHovered(false);
//         setCurrentImageIndex(0);
//       }}
//       onClick={onClick}
//       style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
//     >
//       {/* Image Container - Light Grey Background like Apple/Nike */}
//       <div className="relative bg-[#f5f5f7] rounded-2xl overflow-hidden mb-4">
//         <div className="aspect-square">
//           <img
//             src={imgError ? "https://placehold.co/600x800/f5f5f7/e5e5e8?text=No+Image" : getImageUrl(mainImage)}
//             onError={() => setImgError(true)}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//             loading="lazy"
//           />
//         </div>

//         {/* Image Indicators */}
//         {allImages.length > 1 && (
//           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//             {allImages.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={`h-0.5 rounded-full transition-all duration-200 ${
//                   currentImageIndex === idx ? 'w-4 bg-gray-900' : 'w-1.5 bg-gray-400'
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Wishlist Button */}
//         <button
//           onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
//           className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 hover:scale-110 ${
//             isFavorite ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
//           }`}
//         >
//           <svg className="w-4.5 h-4.5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>

//         {/* Quick Add Overlay - Nike Style */}
//         <div className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm py-3 text-center transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
//           <span className="text-sm font-medium text-gray-900">Quick View</span>
//         </div>
//       </div>

//       {/* Product Info - Minimal like Apple */}
//       <div className="text-center">
//         <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
//           {product.name}
//         </h3>
//         <div className="flex items-center justify-center gap-2 mb-1.5">
//           {priceDisplay}
//         </div>
//         {minQty && (
//           <p className="text-xs text-gray-500">Min order: {minQty}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Product Row - List View
// ───────────────────────────────────────── */
// function ProductRow({
//   product,
//   isFavorite,
//   onToggleWishlist,
//   onClick,
//   isLast,
// }: {
//   product: Product;
//   isFavorite: boolean;
//   onToggleWishlist: () => void;
//   onClick: () => void;
//   isLast: boolean;
// }) {
//   const [imgError, setImgError] = useState(false);
//   const minPrice = getMinPrice(product.variants);
//   const maxPrice = getMaxPrice(product.variants);
//   const minQty = getMinQty(product.variants);
//   const mainImage = product.image || (product.images && product.images[0]);

//   const priceDisplay = minPrice ? (
//     maxPrice && maxPrice > minPrice ? (
//       <div>
//         <span className="text-lg font-bold text-gray-900">₹{minPrice.toLocaleString()}</span>
//         <span className="text-sm text-gray-400 mx-1">-</span>
//         <span className="text-lg font-bold text-gray-900">₹{maxPrice.toLocaleString()}</span>
//       </div>
//     ) : (
//       <span className="text-lg font-bold text-gray-900">₹{minPrice.toLocaleString()}</span>
//     )
//   ) : (
//     <span className="text-sm text-gray-500">Contact for price</span>
//   );

//   return (
//     <div
//       onClick={onClick}
//       className={`group flex items-center gap-5 py-5 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${!isLast ? "border-b border-gray-100" : ""}`}
//     >
//       {/* Image - Light Grey Background */}
//       <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#f5f5f7] shrink-0">
//         <img
//           src={imgError ? "https://placehold.co/128x128/f5f5f7/e5e5e8?text=No+Image" : getImageUrl(mainImage)}
//           onError={() => setImgError(true)}
//           alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
//           {product.name}
//         </h3>
//         <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>
//         <div className="flex items-center gap-3 mt-2">
//           {minQty && (
//             <span className="text-xs text-gray-500">MOQ: {minQty}</span>
//           )}
//           <span className="text-xs text-gray-400">
//             {product.variants?.length || 0} variant(s)
//           </span>
//         </div>
//       </div>

//       {/* Price */}
//       <div className="shrink-0 text-right hidden sm:block">
//         {priceDisplay}
//       </div>

//       {/* Actions */}
//       <div className="shrink-0 flex items-center gap-2">
//         <button
//           onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
//           className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
//             isFavorite
//               ? "bg-rose-500 text-white"
//               : "bg-gray-100 text-gray-500 hover:text-rose-500"
//           }`}
//         >
//           <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>
//         <button
//           onClick={(e) => { e.stopPropagation(); onClick(); }}
//           className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 hidden sm:block"
//         >
//           View Details
//         </button>
//         <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Skeleton Loaders
// ───────────────────────────────────────── */
// function SkeletonCard() {
//   return (
//     <div className="animate-pulse">
//       <div className="bg-[#f5f5f7] rounded-2xl aspect-square mb-4" />
//       <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
//       <div className="h-5 bg-gray-100 rounded w-1/3 mx-auto" />
//     </div>
//   );
// }

// function SkeletonRow() {
//   return (
//     <div className="animate-pulse flex gap-5 py-5 border-b border-gray-100">
//       <div className="w-24 h-24 bg-[#f5f5f7] rounded-xl" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded w-2/3" />
//         <div className="h-3 bg-gray-100 rounded w-1/2" />
//         <div className="h-3 bg-gray-100 rounded w-1/3" />
//       </div>
//       <div className="w-24 h-8 bg-gray-100 rounded-lg" />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Main Component
// ───────────────────────────────────────── */
// export function ProductListingPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const subcategoryId = searchParams.get("subcategory") || "";
//   const categoryName = searchParams.get("categoryName") || "Products";
//   const parentCategory = searchParams.get("parentCategory") || "Shop";

//   const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || null;
//   const { isFavorite, toggleWishlist } = useWishlist(userId);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [sortBy, setSortBy] = useState("default");
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
//   const [showInStockOnly, setShowInStockOnly] = useState(false);
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

//   // Fetch products
//   useEffect(() => {
//     if (!subcategoryId) return;
//     setLoading(true);
//     setError(null);
//     fetch(`${BASE_URL}/api/product/subcategory/${subcategoryId}`)
//       .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
//       .then((data) => { 
//         setProducts(data.products || []); 
//         setLoading(false); 
//       })
//       .catch((err) => { 
//         setError(err.message); 
//         setLoading(false); 
//       });
//   }, [subcategoryId]);

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     let list = [...products];

//     // Search filter
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       list = list.filter((p) => 
//         p.name.toLowerCase().includes(q) || 
//         p.description.toLowerCase().includes(q)
//       );
//     }

//     // Price filter
//     if (priceRange.min > 0) {
//       list = list.filter((p) => (getMinPrice(p.variants) || 0) >= priceRange.min);
//     }
//     if (priceRange.max > 0) {
//       list = list.filter((p) => (getMinPrice(p.variants) || 0) <= priceRange.max);
//     }

//     // In stock filter
//     if (showInStockOnly) {
//       list = list.filter((p) => p.variants && p.variants.length > 0);
//     }

//     // Sorting
//     switch (sortBy) {
//       case "price_asc":
//         list.sort((a, b) => (getMinPrice(a.variants) || 0) - (getMinPrice(b.variants) || 0));
//         break;
//       case "price_desc":
//         list.sort((a, b) => (getMinPrice(b.variants) || 0) - (getMinPrice(a.variants) || 0));
//         break;
//       case "name_asc":
//         list.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name_desc":
//         list.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       default:
//         break;
//     }

//     return list;
//   }, [products, searchQuery, sortBy, priceRange, showInStockOnly]);

//   const hasActiveFilters = priceRange.min > 0 || priceRange.max > 0 || showInStockOnly || sortBy !== "default";

//   const clearAllFilters = () => {
//     setPriceRange({ min: 0, max: 0 });
//     setShowInStockOnly(false);
//     setSortBy("default");
//     setSearchQuery("");
//   };

//   const breadcrumbItems = [
//     { label: "Home", href: "/" },
//     { label: parentCategory, href: "/shop" },
//     { label: categoryName },
//   ];

//   const styles = `
//     @keyframes fadeInUp {
//       from {
//         opacity: 0;
//         transform: translateY(20px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="min-h-screen w-full bg-white">
//         {/* Header - Apple Style */}
//         <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
//           <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
//             <Breadcrumb items={breadcrumbItems} />

//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
//                   {categoryName}
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {loading ? "Loading..." : `${filteredProducts.length} products`}
//                 </p>
//               </div>

//               {/* Search Bar */}
//               <div className="relative w-full lg:w-80">
//                 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-gray-50"
//                 />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex gap-8">
//             {/* Desktop Sidebar */}
//             <aside className="hidden lg:block w-64 shrink-0">
//               <FilterSidebar
//                 priceRange={priceRange}
//                 onPriceRangeChange={setPriceRange}
//                 sortBy={sortBy}
//                 onSortChange={setSortBy}
//                 showInStockOnly={showInStockOnly}
//                 onInStockChange={setShowInStockOnly}
//                 onClearFilters={clearAllFilters}
//                 hasActiveFilters={hasActiveFilters}
//               />
//             </aside>

//             {/* Main Content Area */}
//             <div className="flex-1 min-w-0">
//               {/* Mobile Filter Bar */}
//               <div className="lg:hidden flex items-center justify-between gap-3 mb-5">
//                 <button
//                   onClick={() => setIsMobileFilterOpen(true)}
//                   className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl bg-white"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   Filters
//                   {hasActiveFilters && (
//                     <span className="w-2 h-2 bg-gray-900 rounded-full" />
//                   )}
//                 </button>

//                 <div className="flex items-center gap-2">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white"
//                   >
//                     <option value="default">Sort: Recommended</option>
//                     <option value="price_asc">Price: Low to High</option>
//                     <option value="price_desc">Price: High to Low</option>
//                     <option value="name_asc">Name: A to Z</option>
//                     <option value="name_desc">Name: Z to A</option>
//                   </select>

//                   <div className="flex bg-gray-100 rounded-xl p-1">
//                     <button
//                       onClick={() => setViewMode("grid")}
//                       className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
//                     >
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => setViewMode("list")}
//                       className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
//                     >
//                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Active Filters Chips */}
//               {hasActiveFilters && (
//                 <div className="flex flex-wrap items-center gap-2 mb-5">
//                   <span className="text-xs text-gray-500">Active filters:</span>
//                   {priceRange.min > 0 && (
//                     <button
//                       onClick={() => setPriceRange({ ...priceRange, min: 0 })}
//                       className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                     >
//                       Min: ₹{priceRange.min}
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                   {priceRange.max > 0 && (
//                     <button
//                       onClick={() => setPriceRange({ ...priceRange, max: 0 })}
//                       className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                     >
//                       Max: ₹{priceRange.max}
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                   {showInStockOnly && (
//                     <button
//                       onClick={() => setShowInStockOnly(false)}
//                       className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                     >
//                       In Stock Only
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                   {sortBy !== "default" && (
//                     <button
//                       onClick={() => setSortBy("default")}
//                       className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                     >
//                       Sort: {sortBy === "price_asc" ? "Price Low-High" : sortBy === "price_desc" ? "Price High-Low" : sortBy === "name_asc" ? "A-Z" : "Z-A"}
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-xs text-gray-500 hover:text-gray-700 underline"
//                   >
//                     Clear all
//                   </button>
//                 </div>
//               )}

//               {/* Error State */}
//               {error && (
//                 <div className="text-center py-16">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
//                     <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-600 mb-2">Failed to load products</p>
//                   <p className="text-sm text-gray-500 mb-4">{error}</p>
//                   <button onClick={() => window.location.reload()} className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800">
//                     Try Again
//                   </button>
//                 </div>
//               )}

//               {/* Loading State */}
//               {loading && viewMode === "grid" && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
//                   {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
//                 </div>
//               )}

//               {loading && viewMode === "list" && (
//                 <div className="space-y-2">
//                   {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
//                 </div>
//               )}

//               {/* Empty State */}
//               {!loading && !error && filteredProducts.length === 0 && (
//                 <div className="text-center py-16">
//                   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
//                   <p className="text-gray-500">Try adjusting your filters or search terms</p>
//                   <button onClick={clearAllFilters} className="mt-4 px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800">
//                     Clear all filters
//                   </button>
//                 </div>
//               )}

//               {/* Product Grid View - Apple/Nike Style */}
//               {!loading && !error && filteredProducts.length > 0 && viewMode === "grid" && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
//                   {filteredProducts.map((product, index) => (
//                     <ProductCard
//                       key={product.id}
//                       product={product}
//                       isFavorite={isFavorite(product.id)}
//                       onToggleWishlist={() => toggleWishlist(product.id)}
//                       onClick={() => navigate(`/product/${product.id}`)}
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Product List View */}
//               {!loading && !error && filteredProducts.length > 0 && viewMode === "list" && (
//                 <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//                   <div className="px-5 divide-y divide-gray-100">
//                     {filteredProducts.map((product, index) => (
//                       <ProductRow
//                         key={product.id}
//                         product={product}
//                         isFavorite={isFavorite(product.id)}
//                         onToggleWishlist={() => toggleWishlist(product.id)}
//                         onClick={() => navigate(`/product/${product.id}`)}
//                         isLast={index === filteredProducts.length - 1}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Filter Drawer */}
//       <MobileFilterDrawer
//         isOpen={isMobileFilterOpen}
//         onClose={() => setIsMobileFilterOpen(false)}
//         priceRange={priceRange}
//         onPriceRangeChange={setPriceRange}
//         sortBy={sortBy}
//         onSortChange={setSortBy}
//         showInStockOnly={showInStockOnly}
//         onInStockChange={setShowInStockOnly}
//         onApply={() => setIsMobileFilterOpen(false)}
//         onClear={clearAllFilters}
//         hasChanges={hasActiveFilters}
//       />
//     </>
//   );
// }


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useWishlist } from "../../hooks/useWishlist";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface ProductImage {
  id: string;
  url: string;
  is_default?: boolean;
}

interface Price {
  id: string;
  price: number;
  min_qty: number;
}

interface Variant {
  id: string;
  size_id: string;
  paper_type_id: string;
  print_type_id: string;
  cut_type_id: string;
  sides: number;
  orientation: string;
  prices: Price[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  subcategory_id: string;
  image: ProductImage;
  images: ProductImage[];
  related_images: ProductImage[];
  variants: Variant[];
}

/* ─────────────────────────────────────────
   Constants & Helpers
───────────────────────────────────────── */
const BASE_URL = "http://54.206.3.97";

function getImageUrl(image?: ProductImage): string {
  if (!image?.url) return "https://placehold.co/600x800/f5f5f7/e5e5e8?text=No+Image";
  return image.url.startsWith("http") ? image.url : `${BASE_URL}/${image.url}`;
}

function getAllImages(product: Product): ProductImage[] {
  const images = [product.image, ...(product.images || []), ...(product.related_images || [])];
  return images.filter((img, idx, self) => img && idx === self.findIndex((i) => i?.id === img?.id));
}

// Get minimum price with quantity info
function getMinPriceInfo(variants?: Variant[]): { price: number; minQty: number } | null {
  if (!variants?.length) return null;
  let minPrice = null;
  let minQty = null;

  for (const variant of variants) {
    for (const price of variant.prices) {
      if (minPrice === null || price.price < minPrice) {
        minPrice = price.price;
        minQty = price.min_qty;
      }
    }
  }

  return minPrice !== null ? { price: minPrice, minQty: minQty! } : null;
}

// Get maximum price with quantity info
function getMaxPriceInfo(variants?: Variant[]): { price: number; minQty: number } | null {
  if (!variants?.length) return null;
  let maxPrice = null;
  let maxQty = null;

  for (const variant of variants) {
    for (const price of variant.prices) {
      if (maxPrice === null || price.price > maxPrice) {
        maxPrice = price.price;
        maxQty = price.min_qty;
      }
    }
  }

  return maxPrice !== null ? { price: maxPrice, minQty: maxQty! } : null;
}

// Calculate total price (price * min_qty) and round
function calculateTotalPrice(price: number, minQty: number): number {
  return Math.round(price * minQty);
}

/* ─────────────────────────────────────────
   Enhanced Product Card
───────────────────────────────────────── */
export function ProductCard({
  product,
  isFavorite,
  onToggleWishlist,
  onClick,
  index,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleWishlist: () => void;
  onClick: () => void;
  index: number;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
 
  const allImages = useMemo(() => getAllImages(product), [product]);
 
  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : product.variants[0];
 
  const variantPriceInfo = selectedVariant?.price_tiers?.[0] ?? null;
  const selectedVariantPrice = variantPriceInfo
    ? calculateTotalPrice(variantPriceInfo.price, variantPriceInfo.minQty)
    : null;
  const selectedVariantPricePerPiece = variantPriceInfo
    ? Math.round(variantPriceInfo.price)
    : null;
 
  const minPriceInfo = useMemo(
    () => getMinPriceInfo(product.variants),
    [product.variants]
  );
 
  const allPriceTiers = selectedVariant?.price_tiers ?? [];
 
  // auto-rotate on hover
  useEffect(() => {
    if (!isHovered || allImages.length <= 1) return;
    const id = setInterval(
      () => setCurrentImageIndex((p) => (p + 1) % allImages.length),
      1600
    );
    return () => clearInterval(id);
  }, [isHovered, allImages.length]);
 
  const handleImageError = (i: number) =>
    setImgErrors((p) => ({ ...p, [i]: true }));
 
  const currentImageUrl = imgErrors[currentImageIndex]
    ? `https://placehold.co/800x800/0a0a0a/333?text=${encodeURIComponent(product.name)}`
    : getImageUrl(allImages[currentImageIndex] ?? product.image);
 
  const minPrice = minPriceInfo ? Math.round(minPriceInfo.price) : null;
  const minTotal = minPriceInfo
    ? calculateTotalPrice(minPriceInfo.price, minPriceInfo.minQty)
    : null;
 
  return (
    <>
      <style>{`
 
        :root {
          --ink: #0a0a0a;
          --ink-60: rgba(10,10,10,0.6);
          --ink-20: rgba(10,10,10,0.08);
          --paper: #f5f4f0;
          --accent: #D73D32;        /* Nike volt green */
          --accent-dark: #D73D32;
          --surface: #ffffff;
          --border: rgba(10,10,10,0.1);
          --red: #e8003a;
        }
 
        .pcard-root * { box-sizing: border-box;}
 
        /* ── card shell ─────────────────────────────────────────── */
        .pcard-root {
          position: relative;
          background: var(--surface);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          animation: pcardFadeUp 0.5s cubic-bezier(.22,.68,0,1.2) ${index * 60}ms both;
          transform-origin: bottom center;
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .pcard-root:hover {
          box-shadow: 0 24px 60px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.06);
          border-color: rgba(10,10,10,0.18);
        }
 
        @keyframes pcardFadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
 
        /* ── image zone ─────────────────────────────────────────── */
        .pcard-img-wrap {
          position: relative;
          background: var(--paper);
          overflow: hidden;
          aspect-ratio: 1;
        }
        .pcard-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(.25,.46,.45,.94);
          will-change: transform;
        }
        .pcard-root:hover .pcard-img {
          transform: scale(1.07);
        }
 
        /* ── sport stripe ───────────────────────────────────────── */
        .pcard-stripe {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(.22,.68,0,1.2);
        }
        .pcard-root:hover .pcard-stripe { transform: scaleX(1); }
 
        /* ── image dots ─────────────────────────────────────────── */
        .pcard-dots {
          position: absolute;
          bottom: 14px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 5px;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .pcard-root:hover .pcard-dots { opacity: 1; }
        .pcard-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: background 0.2s, transform 0.2s;
        }
        .pcard-dot.active {
          background: #fff;
          transform: scale(1.3);
        }
 
        /* ── wishlist btn ───────────────────────────────────────── */
        .pcard-wish {
          position: absolute; top: 12px; right: 12px;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.18s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .pcard-wish:hover { background: #fff; }
        .pcard-wish:active { transform: scale(0.88); }
        .pcard-wish svg { width: 16px; height: 16px; }
 
        /* ── body ───────────────────────────────────────────────── */
        .pcard-body {
          padding: 16px 16px 18px;
          display: flex; flex-direction: column; flex: 1;
          gap: 0;
        }
 
        /* ── label row ──────────────────────────────────────────── */
        .pcard-label-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 6px;
        }
        .pcard-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-60);
        }
        .pcard-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--accent);
          color: var(--ink);
          padding: 2px 7px;
          border-radius: 99px;
        }
 
        /* ── name ───────────────────────────────────────────────── */
        .pcard-name {
          font-size: clamp(20px, 4vw, 26px);
          letter-spacing: 0.03em;
          color: var(--ink);
          line-height: 1;
          margin: 0 0 12px;
        }
 
        /* ── stars ──────────────────────────────────────────────── */
        .pcard-stars {
          display: flex; align-items: center; gap: 4px;
          margin-bottom: 14px;
        }
        .pcard-stars-pips { display: flex; gap: 2px; }
        .pcard-stars-pip { width: 11px; height: 11px; }
        .pcard-stars-count {
          font-size: 11px; color: var(--ink-60); font-weight: 500;
        }
 
        /* ── price zone ─────────────────────────────────────────── */
        .pcard-price-zone {
          border-top: 1px solid var(--ink-20);
          padding-top: 12px;
          margin-bottom: 12px;
        }
        .pcard-price-eyebrow {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink-60); margin-bottom: 4px;
        }
        .pcard-price-main {
          display: flex; align-items: baseline; gap: 6px;
        }
        .pcard-price-big {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; line-height: 1;
          letter-spacing: 0.02em; color: var(--ink);
        }
        .pcard-price-per {
          font-size: 12px; font-weight: 500; color: var(--ink-60);
        }
        .pcard-price-qty {
          font-size: 11px; color: var(--ink-60); margin-top: 2px;
        }
        .pcard-variant-chip {
          display: inline-block;
          font-size: 10px; font-weight: 600;
          background: var(--ink-20);
          color: var(--ink);
          padding: 3px 9px; border-radius: 99px;
          margin-top: 5px;
        }
 
        /* ── bulk pricing accordion ─────────────────────────────── */
        .pcard-bulk-toggle {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink); cursor: pointer;
          padding: 8px 12px;
          background: var(--ink-20);
          border-radius: 10px;
          margin-bottom: 6px;
          border: none; width: 100%;
          transition: background 0.18s;
        }
        .pcard-bulk-toggle:hover { background: rgba(10,10,10,0.13); }
        .pcard-bulk-toggle svg {
          width: 14px; height: 14px;
          transition: transform 0.25s;
        }
        .pcard-bulk-toggle.open svg { transform: rotate(180deg); }
 
        .pcard-bulk-body {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(.4,0,.2,1);
        }
        .pcard-bulk-body.open { max-height: 220px; }
 
        .pcard-tier-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 7px 4px;
          border-bottom: 1px solid var(--ink-20);
          font-size: 12px;
        }
        .pcard-tier-row:last-child { border-bottom: none; }
        .pcard-tier-qty { font-weight: 500; color: var(--ink-60); }
        .pcard-tier-price { font-weight: 700; color: var(--ink); text-align: right; }
        .pcard-tier-total { font-size: 10px; color: var(--ink-60); }
 
        /* ── CTA ────────────────────────────────────────────────── */
        .pcard-cta {
          margin-top: auto;
          padding-top: 14px;
          display: flex; gap: 8px;
        }
        .pcard-btn-primary {
          flex: 1;
          background: var(--ink);
          color: #fff;
          border: none; cursor: pointer;
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: background 0.18s, transform 0.15s;
          position: relative; overflow: hidden;
        }
        .pcard-btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: var(--accent);
          transform: translateX(-105%);
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2);
          z-index: 0;
          border-radius: inherit;
        }
        .pcard-btn-primary:hover::after { transform: translateX(0); }
        .pcard-btn-primary:hover { color: white; }
        .pcard-btn-primary span { position: relative; z-index: 1; }
        .pcard-btn-primary:active { transform: scale(0.97); }
 
        /* ── image progress bar ─────────────────────────────────── */
        .pcard-img-progress {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.3);
        }
        .pcard-img-progress-fill {
          height: 100%;
          background: #fff;
          transition: width 0.1s linear;
        }
      `}</style>
 
      <div
        className="pcard-root"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        {/* ── IMAGE ── */}
        <div className="pcard-img-wrap">
          <img
            src={currentImageUrl}
            alt={product.name}
            className="pcard-img"
            loading="lazy"
            onError={() => handleImageError(currentImageIndex)}
          />
 
          {/* image dots */}
          {allImages.length > 1 && (
            <div className="pcard-dots">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`pcard-dot${i === currentImageIndex ? " active" : ""}`}
                />
              ))}
            </div>
          )}
 
          {/* volt stripe */}
          <div className="pcard-stripe" />
 
          {/* wishlist */}
          <button
            className="pcard-wish"
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              fill={isFavorite ? "#e8003a" : "none"}
              stroke={isFavorite ? "#e8003a" : "#0a0a0a"}
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
 
        {/* ── BODY ── */}
        <div className="pcard-body">
          {/* label row */}
          <div className="pcard-label-row">
            {/* <span className="pcard-label">Wholesale</span> */}
            {product.variants.length > 1 && (
              <span className="pcard-badge">{product.variants.length} Options</span>
            )}
          </div>
 
          {/* name */}
          <h3 className="pcard-name">{product.name}</h3>
 
          {/* stars */}
          {product.rating && (
            <div className="pcard-stars">
              <div className="pcard-stars-pips">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="pcard-stars-pip"
                    fill={i < Math.floor(product.rating!) ? "#D73D32" : "#e0e0e0"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="pcard-stars-count">({product.reviews})</span>
            </div>
          )}
 
          {/* price */}
          <div className="pcard-price-zone">
            {selectedVariant && selectedVariantPrice ? (
              <>
                <div className="pcard-price-eyebrow">MOQ {variantPriceInfo?.minQty} pcs</div>
                <div className="pcard-price-main">
                  <span className="pcard-price-big">₹{selectedVariantPrice.toLocaleString()}</span>
                  <span className="pcard-price-per">₹{selectedVariantPricePerPiece}/pc</span>
                </div>
                {selectedVariant.name && (
                  <span className="pcard-variant-chip">{selectedVariant.name}</span>
                )}
              </>
            ) : minPriceInfo ? (
              <>
                <div className="pcard-price-eyebrow">Starts from · MOQ {minPriceInfo.minQty} pcs</div>
                <div className="pcard-price-main">
                  <span className="pcard-price-big">₹{minTotal?.toLocaleString()}</span>
                  <span className="pcard-price-per">₹{minPrice}/pc</span>
                </div>
              </>
            ) : (
              <div className="pcard-price-eyebrow">Contact for price</div>
            )}
          </div>
 
          {/* bulk pricing accordion */}
          {allPriceTiers.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <button
                className={`pcard-bulk-toggle${pricingOpen ? " open" : ""}`}
                onClick={(e) => { e.stopPropagation(); setPricingOpen((p) => !p); }}
              >
                <span>Bulk Pricing</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`pcard-bulk-body${pricingOpen ? " open" : ""}`}>
                {allPriceTiers.map((tier, i) => (
                  <div key={i} className="pcard-tier-row">
                    <span className="pcard-tier-qty">{tier.minQty}+ pcs</span>
                    <div className="pcard-tier-price">
                      ₹{Math.round(tier.price).toLocaleString()}/pc
                      <div className="pcard-tier-total">
                        ₹{calculateTotalPrice(tier.price, tier.minQty).toLocaleString()} total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* CTA */}
          <div className="pcard-cta">
            <button
              className="pcard-btn-primary"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


// ============================================================================
// APPLE CARD VARIANT - Premium, minimalist design
// ============================================================================



/* ─────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square mb-4" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
      <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto" />
      <div className="h-3 bg-gray-50 rounded w-1/3 mx-auto mt-1" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export function ProductListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get("subcategory") || "";
  const categoryName = searchParams.get("categoryName") || "Products";
  const parentCategory = searchParams.get("parentCategory") || "Shop";

  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || null;
  const { isFavorite, toggleWishlist } = useWishlist(userId);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    if (!subcategoryId) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/api/product/subcategory/${subcategoryId}`)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [subcategoryId]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (priceRange.min > 0) {
      list = list.filter((p) => (getMinPriceInfo(p.variants)?.price || 0) >= priceRange.min);
    }
    if (priceRange.max > 0) {
      list = list.filter((p) => (getMinPriceInfo(p.variants)?.price || 0) <= priceRange.max);
    }

    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => (getMinPriceInfo(a.variants)?.price || 0) - (getMinPriceInfo(b.variants)?.price || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (getMinPriceInfo(b.variants)?.price || 0) - (getMinPriceInfo(a.variants)?.price || 0));
        break;
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: break;
    }
    return list;
  }, [products, searchQuery, sortBy, priceRange]);

  const hasActiveFilters = priceRange.min > 0 || priceRange.max > 0 || sortBy !== "default";

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 0 });
    setSortBy("default");
    setSearchQuery("");
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: parentCategory, href: "/shop" },
    { label: categoryName },
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm flex-wrap mb-6">
            {breadcrumbItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {item.href ? (
                  <a href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">{item.label}</a>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Title & Search Row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">{categoryName}</h1>
              <p className="text-sm text-gray-500 mt-1">{loading ? "Loading..." : `${filteredProducts.length} products`}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 bg-gray-50 transition-all"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && <span className="w-2 h-2 bg-gray-900 rounded-full" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: "default", label: "Recommended" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                  { value: "name_asc", label: "Name: A to Z" },
                  { value: "name_desc", label: "Name: Z to A" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`block w-full text-left text-sm py-2.5 px-3 rounded-lg transition-all ${sortBy === option.value
                      ? "bg-gray-900 text-white font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Price Range (per piece)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    />
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full mt-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-500">Active filters:</span>
                {priceRange.min > 0 && (
                  <button
                    onClick={() => setPriceRange({ ...priceRange, min: 0 })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Min: ₹{priceRange.min}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {priceRange.max > 0 && (
                  <button
                    onClick={() => setPriceRange({ ...priceRange, max: 0 })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Max: ₹{priceRange.max}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {sortBy !== "default" && (
                  <button
                    onClick={() => setSortBy("default")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Sort: {sortBy === "price_asc" ? "Price Low-High" : sortBy === "price_desc" ? "Price High-Low" : sortBy === "name_asc" ? "A-Z" : "Z-A"}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-gray-700 underline">Clear all</button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">Failed to load products</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">Try Again</button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
                <button onClick={clearAllFilters} className="mt-4 px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">Clear all filters</button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onClick={() => navigate(`/product/${product.id}`)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "default", label: "Recommended" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "name_asc", label: "Name: A to Z" },
                    { value: "name_desc", label: "Name: Z to A" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setIsFilterOpen(false); }}
                      className={`block w-full text-left py-3 px-4 rounded-xl transition-all ${sortBy === option.value
                        ? "bg-gray-900 text-white font-medium"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range (per piece)</h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}