// components/Navbar.tsx
import { Link, useLocation } from "react-router";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../service/categoryApiService";

interface Category {
    id: string;
    name: string;
}

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories([
                    { id: "all", name: "All Products" },
                    ...res
                ]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <nav className="bg-white/95 backdrop-blur-md  sticky top-0 z-[100] shadow-sm">
            {/* Top row */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="group relative"
                    >
                        <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] bg-clip-text text-transparent tracking-tight">
                            Citizen Prints
                        </span>
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] group-hover:w-full transition-all duration-300"></div>
                    </Link>

                    {/* Search - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className={`transition-colors duration-200 ${searchFocused ? 'text-[#c0392b]' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for business cards, banners, flyers..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/20 focus:bg-white transition-all duration-200 text-sm text-gray-800 placeholder:text-gray-400"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 lg:gap-2">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                to="/MyProfile"
                                className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200"
                            >
                                <User size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Profile</span>
                            </Link>

                            <button className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200">
                                <Heart size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Wishlist</span>
                            </button>

                            <Link
                                to="/cart"
                                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200"
                            >
                                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Cart</span>
                                {/* Cart Badge Example */}
                                
                            </Link>

                            <Link
                                to="/products"
                                className="ml-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white hover:shadow-lg hover:shadow-[#c0392b]/25 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Order Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/20 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Category nav - Desktop */}
            <div className="hidden md:block border-t border-gray-100 bg-white/50">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                    <div className="flex overflow-x-auto scrollbar-none gap-1 py-2">
                        {loading ? (
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            categories.map((c) => {
                                const isAll = c.id === "all";
                                const isActive = isAll
                                    ? location.pathname === "/" && !location.search
                                    : location.search.includes(`category=${c.id}`);

                                return (
                                    <Link
                                        to={isAll ? "/" : `/products?category=${c.id}`}
                                        key={c.id}
                                        className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                ${isActive
                                                ? "text-[#c0392b] bg-[#c0392b]/5"
                                                : "text-gray-600 hover:text-[#c0392b] hover:bg-gray-50"
                                            }`}
                                    >
                                        {c.name}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] rounded-full"></div>
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-slideDown">
                    <div className="p-4 space-y-2">
                        <Link
                            to="/MyProfile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200"
                        >
                            <User size={18} />
                            <span className="font-medium">My Profile</span>
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200">
                            <Heart size={18} />
                            <span className="font-medium">Wishlist</span>
                        </button>
                        <Link
                            to="/cart"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#c0392b] transition-all duration-200"
                        >
                            <ShoppingCart size={18} />
                            <span className="font-medium">Cart</span>
                        </Link>
                        <div className="pt-2">
                            <Link
                                to="/products"
                                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white hover:shadow-lg transition-all duration-300"
                            >
                                Order Now
                            </Link>
                        </div>

                        {/* Mobile Categories */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
                                Categories
                            </p>
                            <div className="space-y-1">
                                {loading ? (
                                    <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                                ) : (
                                    categories.map((c) => (
                                        <Link
                                            to={`/products?category=${c.id}`}
                                            key={c.id}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#c0392b] hover:bg-gray-50 rounded-lg transition-all duration-200"
                                        >
                                            {c.name}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}