// components/Navbar.tsx
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../service/categoryApiService";
import { Search, User, Heart, ShoppingCart } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface Subcategory {
    id: string;
    category_id: string;
    name: string;
    description: string;
    is_active: number;
    is_deleted: number;
}

interface Product {
    id: string;
    name: string;
}

// 🔹 APIs
async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
    const res = await fetch(
        `http://54.206.3.97/api/subcategory/list?category_id=${categoryId}`
    );
    const data = await res.json();
    return data.subcategories ?? [];
}

async function getProducts(subcategoryId: string): Promise<Product[]> {
    const res = await fetch(
        `http://54.206.3.97/api/product/subcategory/${subcategoryId}/minimal`
    );
    const data = await res.json();
    return data.products ?? [];
}

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<string, Subcategory[]>
    >({});

    const [productsMap, setProductsMap] = useState<
        Record<string, Product[]>
    >({});
    const [searchFocused, setSearchFocused] = useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategories();
            setCategories([{ id: "all", name: "View All" }, ...res]);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const loadSubcategories = async (categoryId: string) => {
        if (subcategoriesMap[categoryId]) return;

        const subs = await getSubcategories(categoryId);
        setSubcategoriesMap((p) => ({ ...p, [categoryId]: subs }));

        subs.forEach((sub) => loadProducts(sub.id));
    };

    const loadProducts = async (subcategoryId: string) => {
        if (productsMap[subcategoryId]) return;

        const products = await getProducts(subcategoryId);
        setProductsMap((p) => ({ ...p, [subcategoryId]: products }));
    };

    const handleHover = (categoryId: string) => {
        setHoveredCategory(categoryId);

        if (categoryId === "all") {
            categories.forEach((cat) => {
                if (cat.id !== "all") loadSubcategories(cat.id);
            });
        } else {
            loadSubcategories(categoryId);
        }
    };

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm">
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

                <div className="hidden md:block border-t relative">
                    <div className="max-w-[1400px] mx-auto px-6 flex gap-4 py-3">
                        {categories.map((c) => (
                            <div key={c.id} onMouseEnter={() => handleHover(c.id)}>
                                <Link
                                    to={c.id === "all" ? "/" : `/products?category=${c.id}`}
                                    className={`px-4 py-2 text-sm rounded-lg ${hoveredCategory === c.id
                                        ? "text-[#c0392b] bg-red-50"
                                        : "text-gray-600 hover:text-[#c0392b]"
                                        }`}
                                >
                                    {c.name}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* 🔥 MEGA MENU */}
                    {hoveredCategory && (
                        <div
                            className="absolute left-0 w-full bg-white shadow-xl border-t z-50"
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <div className="max-w-[1400px] mx-auto px-8 py-6">

                                {/* 🔥 ALL VIEW */}
                                {hoveredCategory === "all" ? (
                                    <div className="grid grid-cols-5 gap-6">
                                        {categories
                                            .filter((c) => c.id !== "all")
                                            .map((cat) => (
                                                <div key={cat.id}>
                                                    <Link
                                                        to={`/products?category=${cat.id}`}
                                                        className="font-bold text-[#c0392b] mb-2 block"
                                                    >
                                                        {cat.name}
                                                    </Link>

                                                    {(subcategoriesMap[cat.id] || [])
                                                        .filter((s) => s.is_active === 1 && s.is_deleted === 0)
                                                        .slice(0, 5)
                                                        .map((sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                to={`/products?subcategory=${sub.id}`}
                                                                className="block text-sm text-gray-700 hover:text-[#c0392b] py-1"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}

                                                    <Link
                                                        to={`/subcategorylist?category=${cat.id}`}
                                                        className="block text-sm text-gray-700 hover:text-[#c0392b] py-1 font-medium"
                                                    >
                                                        View All
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    /* 🔥 SINGLE CATEGORY */
                                    <div className="grid grid-cols-4 gap-6">
                                        {(subcategoriesMap[hoveredCategory] || [])
                                            .filter((s) => s.is_active === 1 && s.is_deleted === 0)
                                            .map((sub) => (
                                                <div key={sub.id}>
                                                    <h3 className="font-semibold text-[#c0392b] mb-2">
                                                        {sub.name}
                                                    </h3>

                                                    {(productsMap[sub.id] || []).map((product) => (
                                                        <Link
                                                            key={product.id}
                                                            to={`/product/${product.id}`}
                                                            className="block text-sm text-gray-700 hover:text-[#c0392b] py-1"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    ))}

                                                    {/* 🔥 NEW: SUBCATEGORY VIEW ALL */}
                                                    <Link
                                                        to={`/products?subcategory=${sub.id}`}
                                                        className="block text-sm text-gray-700 hover:text-[#c0392b] py-1 font-medium"
                                                    >
                                                        View All
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>

                {/* MOBILE */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t p-4">
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                to={c.id === "all" ? "/" : `/products?category=${c.id}`}
                                className="block py-2"
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}