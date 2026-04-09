import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../service/productApiService";
import { ProductSetup } from "../../types/productvariantsetup";
import AdminProductSetup from "./AdminProductSetup";

const ProductSetupWrapper: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: products, isLoading } = useQuery<ProductSetup[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getAllProducts();
      if (res?.data?.products) return res.data.products;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res)) return res;
      return [];
    },
  });

  const selectedProductObj = products?.find((p) => p.id === selectedProduct);

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#D73D32] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D73D32] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Product Studio</h1>
                <p className="text-xs text-gray-500">Variant Management System</p>
              </div>
            </div>

            {/* Product Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-5 py-2.5 hover:border-[#D73D32] hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 bg-[#D73D32]/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">
                  {selectedProductObj ? selectedProductObj.name : "Select Product"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {products?.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 transition-colors flex items-center justify-between ${
                          selectedProduct === product.id
                            ? "bg-[#D73D32]/5 border-l-3 border-l-[#D73D32]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-gray-700">{product.name}</span>
                        {selectedProduct === product.id && (
                          <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto px-6 py-8">
          {selectedProduct ? (
            <AdminProductSetup productId={selectedProduct} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Product Selected</h2>
              <p className="text-gray-500">Please select a product from the dropdown above to continue.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductSetupWrapper;

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Spin, Empty } from "antd";
// import AdminProductSetup from "./AdminProductSetup";
// import { ProductSetup } from "../../types/productvarientsetup";
// import { getAllProducts } from "../../service/productApiService";

// const ProductSetupWrapper: React.FC = () => {
//   const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
//   const [selectedProductName, setSelectedProductName] = useState<string>("");
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const { data: products, isLoading } = useQuery<ProductSetup[]>({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await getAllProducts();
//       if (res?.data?.products) return res.data.products;
//       if (Array.isArray(res?.data)) return res.data;
//       if (Array.isArray(res)) return res;
//       return [];
//     },
//   });

//   const filteredProducts = products?.filter((p) =>
//     p.name.toLowerCase().includes(searchQuery.toLowerCase())
//   ) || [];

//   const handleProductSelect = (productId: string) => {
//     const product = products?.find((p) => p.id === productId);
//     setSelectedProduct(productId);
//     setSelectedProductName(product?.name || "");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#D73D32] to-[#b8311e] text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
//           <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Product Management</h1>
//           <p className="text-red-100 text-lg">Manage variants, attributes, and pricing</p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Product Selector Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//               {/* Selector Header */}
//               <div className="bg-gradient-to-r from-[#D73D32] to-[#b8311e] text-white px-6 py-4">
//                 <h2 className="text-lg font-bold">Select Product</h2>
//                 <p className="text-red-100 text-sm mt-1">
//                   {isLoading ? "Loading..." : `${products?.length || 0} products`}
//                 </p>
//               </div>

//               {/* Search Input */}
//               <div className="p-4 border-b border-gray-200">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D73D32] focus:border-transparent transition"
//                 />
//               </div>

//               {/* Products List */}
//               <div className="max-h-96 overflow-y-auto">
//                 {isLoading ? (
//                   <div className="flex justify-center items-center py-8">
//                     <Spin size="small" />
//                   </div>
//                 ) : filteredProducts.length > 0 ? (
//                   <div className="divide-y divide-gray-200">
//                     {filteredProducts.map((product) => (
//                       <button
//                         key={product.id}
//                         onClick={() => handleProductSelect(product.id)}
//                         className={`w-full px-6 py-4 text-left transition-all hover:bg-gray-50 border-l-4 ${
//                           selectedProduct === product.id
//                             ? "border-l-[#D73D32] bg-red-50 shadow-sm"
//                             : "border-l-transparent"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex-1">
//                             <p className="font-semibold text-gray-900 truncate">{product.name}</p>
//                             <p className="text-xs text-gray-500 font-mono mt-1">{product.id}</p>
//                           </div>
//                           {selectedProduct === product.id && (
//                             <div className="ml-2 w-5 h-5 bg-[#D73D32] rounded-full flex items-center justify-center flex-shrink-0">
//                               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="p-6 text-center">
//                     <p className="text-gray-500 text-sm">No products found</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="lg:col-span-2">
//             {selectedProduct ? (
//               <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//                 {/* Content Header */}
//                 <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                       <span>Products</span>
//                       <span className="text-gray-400">/</span>
//                       <span className="text-[#D73D32] font-semibold">{selectedProductName}</span>
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900">{selectedProductName}</h3>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setSelectedProduct(null);
//                       setSelectedProductName("");
//                     }}
//                     className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
//                     title="Close"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Admin Product Setup Content */}
//                 <div className="p-6 md:p-8">
//                   <AdminProductSetup productId={selectedProduct} />
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
//                 <div className="mb-4">
//                   <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10m0-10l8-4" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Product</h3>
//                 <p className="text-gray-600">Choose a product from the list to get started</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductSetupWrapper;