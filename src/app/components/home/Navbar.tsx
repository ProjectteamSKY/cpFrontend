// components/Navbar.tsx
import { Link, useLocation } from "react-router";
import { Menu, X, Search, User, Heart, ShoppingCart, ChevronDown, ArrowRight, XCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
    getAllCategories,
} from "../../service/categoryApiService";
import { getAllSubcategories } from "../../service/subcategoryApiService";
import { getAllProductsActive } from "../../service/productApiService";
import { Subcategory } from "../../types/subcategory";
import { Product } from "../../types/product";

interface Category {
    id: string;
    name: string;
}

interface SearchResult {
    type: 'product' | 'category' | 'subcategory';
    id: string;
    name: string;
    url: string;
    image?: string;
    price?: number;
    parentName?: string;
}

// Helper function to get full image URL
const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;
    
    // Case 1: It's an object with url property
    if (typeof imageData === 'object' && imageData.url) {
        let url = imageData.url;
        if (typeof url === 'string') {
            if (url.startsWith('http')) return url;
            if (url.startsWith('/storage') || url.startsWith('/uploads') || url.startsWith('media/')) {
                return `https://api.citizenprintz.in/${url}`;
            }
            return `https://api.citizenprintz.in/${url.replace(/^\/+/, '')}`;
        }
    }
    
    // Case 2: It's a string
    if (typeof imageData === 'string') {
        if (imageData.startsWith('http')) return imageData;
        return `https://api.citizenprintz.in/${imageData.replace(/^\/+/, '')}`;
    }
    
    return null;
};

// Helper to get product image
const getProductImage = (product: Product): string | null => {
    if (!product) return null;
    
    // Check if images is an array
    if (product.images && Array.isArray(product.images)) {
        // Find default image or first image
        const defaultImage = product.images.find((img: any) => img.is_default === true);
        const imageToUse = defaultImage || product.images[0];
        return getImageUrl(imageToUse);
    }
    
    return null;
};

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<string, Subcategory[]>
    >({});
    const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [enhancedSearchResults, setEnhancedSearchResults] = useState<SearchResult[]>([]);
    const [searchCategory, setSearchCategory] = useState<'all' | 'products' | 'categories' | 'subcategories'>('all');
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // 🔹 Fetch Categories, Subcategories, Products on mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const cats = await getAllCategories();
                // Filter out invalid categories and ensure unique
                const validCats = cats.filter(cat => cat && cat.id && cat.name);
                setCategories([{ id: "all", name: "View All" }, ...validCats]);

                const subs = await getAllSubcategories();
                const products = await getAllProductsActive();

                // Build subcategories map - only for valid categories
                const subMap: Record<string, Subcategory[]> = {};
                subs.forEach((sub) => {
                    if (sub && sub.category_id && sub.is_active && !sub.is_deleted) {
                        if (!subMap[sub.category_id]) subMap[sub.category_id] = [];
                        subMap[sub.category_id].push(sub);
                    }
                });
                setSubcategoriesMap(subMap);

                // Build products map by subcategory - only for valid products with subcategory
                const prodMap: Record<string, Product[]> = {};
                products.forEach((p) => {
                    if (p && p.subcategory_id && p.is_active) {
                        if (!prodMap[p.subcategory_id]) prodMap[p.subcategory_id] = [];
                        prodMap[p.subcategory_id].push(p);
                    }
                });
                setProductsMap(prodMap);
            } catch (error) {
                console.error("Error fetching navigation data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // 🔹 Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔹 Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
        setExpandedMobileCategory(null);
        setSearchFocused(false);
        setSearchQuery("");
        setHoveredCategory(null);
    }, [location]);

    // 🔹 Close mega menu when clicking outside
    useEffect(() => {
        const handleClickOutsideMegaMenu = (event: MouseEvent) => {
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
                // Check if click is on a category link
                const target = event.target as HTMLElement;
                const isCategoryLink = target.closest('.category-link');
                
                if (!isCategoryLink) {
                    setHoveredCategory(null);
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutsideMegaMenu);
        return () => document.removeEventListener('mousedown', handleClickOutsideMegaMenu);
    }, []);

    // 🔹 Enhanced search function
    const performEnhancedSearch = (query: string) => {
        if (!query.trim()) {
            setEnhancedSearchResults([]);
            return;
        }

        const results: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        // Search in Products
        if (searchCategory === 'all' || searchCategory === 'products') {
            Object.values(productsMap).forEach((plist) => {
                plist.forEach((p) => {
                    if (p.name && p.name.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            type: 'product',
                            id: p.id,
                            name: p.name,
                            url: `/product/${p.id}`,
                            image: getProductImage(p) || undefined,
                            price: p.price
                        });
                    }
                });
            });
        }

        // Search in Categories
        if (searchCategory === 'all' || searchCategory === 'categories') {
            categories.forEach((cat) => {
                if (cat.id !== 'all' && cat.name && cat.name.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        type: 'category',
                        id: cat.id,
                        name: cat.name,
                        url: `/products?category=${cat.id}`,
                    });
                }
            });
        }

        // Search in Subcategories
        if (searchCategory === 'all' || searchCategory === 'subcategories') {
            Object.values(subcategoriesMap).forEach((subList) => {
                subList.forEach((sub) => {
                    if (sub.name && sub.name.toLowerCase().includes(lowerQuery)) {
                        // Find parent category name
                        const parentCategory = categories.find(c => c.id === sub.category_id);
                        results.push({
                            type: 'subcategory',
                            id: sub.id,
                            name: sub.name,
                            url: `/products?subcategory=${sub.id}`,
                            parentName: parentCategory?.name
                        });
                    }
                });
            });
        }

        // Limit results
        setEnhancedSearchResults(results.slice(0, 12));
    };

    // 🔹 Search handler with debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            performEnhancedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, searchCategory, productsMap, categories, subcategoriesMap]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleHoverEnter = (categoryId: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setHoveredCategory(categoryId);
    };

    const handleHoverLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredCategory(null);
        }, 300);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setEnhancedSearchResults([]);
        setSearchFocused(false);
    };

    // Close mega menu when mouse leaves the mega menu area
    const handleMegaMenuLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredCategory(null);
        }, 300);
    };

    const handleMegaMenuEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    return (
        <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Bar - Logo, Search, Actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 md:py-0 md:h-16 lg:h-20">
                    {/* Logo and Mobile Menu Row */}
                    <div className="flex items-center justify-between md:justify-start">
                        <Link to="/" className="group flex-shrink-0">
                            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] bg-clip-text text-transparent tracking-tight">
                                Citizen Prints
                            </span>
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] group-hover:w-full transition-all duration-300 hidden md:block"></div>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Enhanced Search Bar - Desktop */}
                    <div ref={searchRef} className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8 relative">
                        <div className="relative">
                            {/* Category Filter Dropdown */}
                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value as any)}
                                    className="h-full py-0 pl-3 pr-6 text-xs font-medium text-gray-600 bg-transparent border-r border-gray-200 rounded-l-xl focus:outline-none focus:text-[#c0392b] cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                                >
                                    <option value="all">All</option>
                                    <option value="products">Products</option>
                                    <option value="categories">Categories</option>
                                    <option value="subcategories">Subcategories</option>
                                </select>
                            </div>
                            
                            <Search size={18} className={`absolute left-24 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#c0392b]' : 'text-gray-400'}`} />
                            
                            <input
                                type="text"
                                placeholder={searchCategory === 'all' ? "Search products, categories, or subcategories..." : `Search ${searchCategory}...`}
                                className="w-full pl-32 pr-12 py-2.5 lg:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/20 focus:bg-white transition-all duration-200 text-sm text-gray-800 placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                            />
                            
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <XCircle size={16} />
                                </button>
                            )}
                        </div>

                        {/* Enhanced Search Results Dropdown */}
                        {searchFocused && searchQuery && (
                            <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-xl mt-2 z-50 overflow-hidden animate-fadeIn">
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c0392b] mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading...</p>
                                    </div>
                                ) : enhancedSearchResults.length > 0 ? (
                                    <>
                                        {/* Search Stats */}
                                        <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between text-xs">
                                            <span className="font-semibold text-gray-500 uppercase tracking-wider">
                                                {enhancedSearchResults.length} result{enhancedSearchResults.length !== 1 ? 's' : ''} found
                                            </span>
                                            <span className="text-gray-400">
                                                {searchCategory === 'all' ? 'Showing all matches' : `Showing ${searchCategory}`}
                                            </span>
                                        </div>
                                        
                                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                                            {enhancedSearchResults.map((result) => {
                                                if (result.type === 'product') {
                                                    return (
                                                        <Link
                                                            key={`${result.type}-${result.id}`}
                                                            to={result.url}
                                                            onClick={clearSearch}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            {result.image ? (
                                                                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                                    <img 
                                                                        src={result.image} 
                                                                        alt={result.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                    <ShoppingCart size={20} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-medium text-[#c0392b] bg-red-50 px-2 py-0.5 rounded">
                                                                        Product
                                                                    </span>
                                                                    <div className="text-sm font-medium text-gray-800 group-hover:text-[#c0392b] transition-colors truncate">
                                                                        {result.name}
                                                                    </div>
                                                                </div>
                                                                {result.price && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        ${result.price.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                                                        </Link>
                                                    );
                                                } else if (result.type === 'category') {
                                                    return (
                                                        <Link
                                                            key={`${result.type}-${result.id}`}
                                                            to={result.url}
                                                            onClick={clearSearch}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#c0392b]/10 to-[#e74c3c]/10 rounded-lg flex items-center justify-center">
                                                                <Search size={20} className="text-[#c0392b]" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                                        Category
                                                                    </span>
                                                                    <div className="text-sm font-medium text-gray-800 group-hover:text-[#c0392b] transition-colors truncate">
                                                                        {result.name}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    Browse all products in this category
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                                                        </Link>
                                                    );
                                                } else {
                                                    return (
                                                        <Link
                                                            key={`${result.type}-${result.id}`}
                                                            to={result.url}
                                                            onClick={clearSearch}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center">
                                                                <ChevronDown size={20} className="text-blue-500" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                                        Subcategory
                                                                    </span>
                                                                    <div className="text-sm font-medium text-gray-800 group-hover:text-[#c0392b] transition-colors truncate">
                                                                        {result.name}
                                                                    </div>
                                                                </div>
                                                                {result.parentName && (
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        in {result.parentName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                                                        </Link>
                                                    );
                                                }
                                            })}
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 border-t">
                                            <Link
                                                to={`/products?search=${encodeURIComponent(searchQuery)}`}
                                                onClick={clearSearch}
                                                className="flex items-center justify-center gap-2 text-sm text-[#c0392b] hover:text-[#a93226] font-medium"
                                            >
                                                View all results
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Search size={40} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Try searching for products, categories, or subcategories
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Icons - Desktop */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        <Link
                            to="/MyProfile"
                            className="group flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#c0392b] transition-all duration-200"
                        >
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:inline">Profile</span>
                        </Link>

                        <Link
                            to="/wishlist"
                            className="group flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#c0392b] transition-all duration-200"
                        >
                            <Heart size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:inline">Wishlist</span>
                        </Link>

                        <Link
                            to="/cart"
                            className="group relative flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#c0392b] transition-all duration-200"
                        >
                            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:inline">Cart</span>
                        </Link>

                        <Link
                            to="/products"
                            className="ml-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white hover:shadow-lg hover:shadow-[#c0392b]/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>

                {/* Desktop Category Menu with Mega Menu */}
                <div className="hidden md:block border-t relative bg-white">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1 py-2 min-w-max">
                            {categories.filter(c => c && c.id && c.name).map((c) => (
                                <div 
                                    key={c.id} 
                                    className="relative"
                                    onMouseEnter={() => handleHoverEnter(c.id)}
                                    onMouseLeave={handleHoverLeave}
                                >
                                    <Link
                                        to={c.id === "all" ? "/" : `/products?category=${c.id}`}
                                        className={`category-link flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                                            hoveredCategory === c.id 
                                                ? "text-[#c0392b] bg-red-50" 
                                                : "text-gray-700 hover:text-[#c0392b] hover:bg-red-50"
                                        }`}
                                        onClick={() => setHoveredCategory(null)}
                                    >
                                        {c.name}
                                        {c.id !== "all" && (
                                            <ChevronDown 
                                                size={14} 
                                                className={`transition-transform duration-200 ${
                                                    hoveredCategory === c.id ? "rotate-180" : ""
                                                }`}
                                            />
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    {hoveredCategory && !isLoading && (
                        <div
                            ref={megaMenuRef}
                            className="absolute left-0 w-full bg-white shadow-xl border-t-2 border-[#c0392b] z-50 animate-slideDown"
                            onMouseEnter={handleMegaMenuEnter}
                            onMouseLeave={handleMegaMenuLeave}
                        >
                            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                                {hoveredCategory === "all" ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                                        {categories
                                            .filter((c) => c.id !== "all" && c.id && c.name)
                                            .map((cat) => {
                                                const subcategories = (subcategoriesMap[cat.id] || [])
                                                    .filter((s) => s.is_active && !s.is_deleted);
                                                return (
                                                    <div key={cat.id} className="space-y-3">
                                                        <Link 
                                                            to={`/products?category=${cat.id}`} 
                                                            className="block font-semibold text-[#c0392b] text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
                                                            onClick={() => setHoveredCategory(null)}
                                                        >
                                                            {cat.name}
                                                        </Link>
                                                        <div className="space-y-1.5">
                                                            {subcategories.slice(0, 5).map((sub) => (
                                                                <Link 
                                                                    key={sub.id} 
                                                                    to={`/products?subcategory=${sub.id}`} 
                                                                    className="block text-sm text-gray-600 hover:text-[#c0392b] py-1 transition-colors"
                                                                    onClick={() => setHoveredCategory(null)}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {subcategories.length > 0 && (
                                                            <Link 
                                                                to={`/subcategorylist?category=${cat.id}`} 
                                                                className="inline-flex items-center gap-1 text-xs font-medium text-[#c0392b] hover:opacity-80 transition-colors"
                                                                onClick={() => setHoveredCategory(null)}
                                                            >
                                                                View All
                                                                <ArrowRight size={12} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                                        {(subcategoriesMap[hoveredCategory] || [])
                                            .filter((s) => s.is_active && !s.is_deleted)
                                            .slice(0, 8)
                                            .map((sub) => (
                                                <div key={sub.id} className="space-y-3">
                                                    <h3 className="font-semibold text-gray-800 text-sm border-l-2 border-[#c0392b] pl-2">
                                                        {sub.name}
                                                    </h3>
                                                    <div className="space-y-1.5">
                                                        {(productsMap[sub.id] || []).slice(0, 4).map((p) => (
                                                            <Link 
                                                                key={p.id} 
                                                                to={`/product/${p.id}`} 
                                                                className="block text-sm text-gray-500 hover:text-[#c0392b] py-1 transition-colors truncate"
                                                                onClick={() => setHoveredCategory(null)}
                                                            >
                                                                {p.name && p.name.length > 35 ? p.name.substring(0, 35) + '...' : p.name || 'Unnamed'}
                                                            </Link>
                                                        ))}
                                                        {(productsMap[sub.id] || []).length === 0 && (
                                                            <p className="text-xs text-gray-400 italic">No products available</p>
                                                        )}
                                                    </div>
                                                    <Link 
                                                        to={`/products?subcategory=${sub.id}`} 
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-[#c0392b] hover:opacity-80 transition-colors"
                                                        onClick={() => setHoveredCategory(null)}
                                                    >
                                                        Shop Now
                                                        <ArrowRight size={12} />
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        
                        {/* Drawer */}
                        <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl animate-slideInRight md:hidden">
                            <div className="flex flex-col h-full">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between p-4 border-b">
                                    <span className="text-lg font-bold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] bg-clip-text text-transparent">
                                        Menu
                                    </span>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Drawer Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    {/* Mobile Search */}
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products, categories..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/20 text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && enhancedSearchResults.length > 0 && (
                                            <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-auto">
                                                {enhancedSearchResults.slice(0, 5).map((result) => (
                                                    <Link
                                                        key={`mobile-${result.type}-${result.id}`}
                                                        to={result.url}
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            clearSearch();
                                                        }}
                                                        className="block px-4 py-2 hover:bg-red-50 hover:text-[#c0392b] text-sm transition-colors border-b border-gray-100 last:border-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{result.name}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {result.type === 'product' ? 'Product' : result.type === 'category' ? 'Category' : 'Subcategory'}
                                                            </span>
                                                        </div>
                                                        {result.type === 'subcategory' && result.parentName && (
                                                            <div className="text-xs text-gray-400 mt-0.5">{result.parentName}</div>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Categories Section */}
                                    <div>
                                        <button
                                            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                                            className="flex items-center justify-between w-full py-2 text-left font-semibold text-gray-800"
                                        >
                                            <span>All Categories</span>
                                            <ChevronDown 
                                                size={18} 
                                                className={`transition-transform duration-200 ${
                                                    mobileCategoriesOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>
                                        
                                        {mobileCategoriesOpen && (
                                            <div className="mt-2 ml-2 space-y-1">
                                                {categories.filter(c => c.id !== "all").map((c) => (
                                                    <div key={c.id}>
                                                        <button
                                                            onClick={() => setExpandedMobileCategory(
                                                                expandedMobileCategory === c.id ? null : c.id
                                                            )}
                                                            className="flex items-center justify-between w-full py-2 text-sm text-gray-700 hover:text-[#c0392b] transition-colors"
                                                        >
                                                            <Link
                                                                to={`/products?category=${c.id}`}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className="flex-1 text-left"
                                                            >
                                                                {c.name}
                                                            </Link>
                                                            {(subcategoriesMap[c.id] || []).length > 0 && (
                                                                <ChevronDown 
                                                                    size={14} 
                                                                    className={`transition-transform duration-200 ${
                                                                        expandedMobileCategory === c.id ? "rotate-180" : ""
                                                                    }`}
                                                                />
                                                            )}
                                                        </button>
                                                        
                                                        {expandedMobileCategory === c.id && (
                                                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#c0392b] pl-3">
                                                                {(subcategoriesMap[c.id] || [])
                                                                    .filter((s) => s.is_active && !s.is_deleted)
                                                                    .slice(0, 10)
                                                                    .map((sub) => (
                                                                        <Link
                                                                            key={sub.id}
                                                                            to={`/products?subcategory=${sub.id}`}
                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                            className="block py-1.5 text-xs text-gray-600 hover:text-[#c0392b] transition-colors"
                                                                        >
                                                                            {sub.name}
                                                                        </Link>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Links */}
                                    <div className="pt-4 border-t space-y-3">
                                        <Link
                                            to="/MyProfile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#c0392b] transition-colors"
                                        >
                                            <User size={18} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#c0392b] transition-colors"
                                        >
                                            <Heart size={18} />
                                            <span>Wishlist</span>
                                        </Link>
                                        <Link
                                            to="/cart"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#c0392b] transition-colors"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>Shopping Cart</span>
                                        </Link>
                                        <Link
                                            to="/products"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white hover:shadow-lg transition-all duration-300 mt-4"
                                        >
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                /* Hide scrollbar for category menu */
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                /* Truncate text */
                .truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
        </nav>
    );
}