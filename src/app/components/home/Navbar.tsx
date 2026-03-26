// components/Navbar.tsx
import { Link } from "react-router";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../service/categoryApiService";

interface Category {
    id: string;
    name: string;
}

export function Navbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();

                // res is already Category[]
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

    return (
        <nav className="bg-white border-b border-[#e8e8e8] sticky top-0 z-[100]">
            {/* Top row */}
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-6">
                <Link
                    to="/"
                    className="text-[22px] font-extrabold text-[#c0392b] no-underline whitespace-nowrap tracking-[-0.5px]"
                >
                    Citizen Prints
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-[560px] flex items-center bg-[#f5f5f5] border border-[#e5e5e5] rounded-lg px-[14px] gap-2 h-[42px] focus-within:border-[#c0392b] focus-within:bg-white transition-colors">
                    <Search size={15} className="text-[#aaa]" />
                    <input
                        type="text"
                        placeholder="Search for business cards, banners, flyers…"
                        className="border-none bg-transparent outline-none text-sm w-full text-[#1c1c1c] placeholder-[#aaa]"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] hover:bg-[#f5f5f5]">
                        <User size={16} /> Account
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] hover:bg-[#f5f5f5]">
                        <Heart size={16} />
                    </button>

                    <Link
                        to="/cart"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] hover:bg-[#f5f5f5]"
                    >
                        <ShoppingCart size={16} /> Cart
                    </Link>

                    <Link
                        to="/products"
                        className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg text-[13px] font-semibold bg-[#c0392b] text-white hover:bg-[#a93226]"
                    >
                        Order Now
                    </Link>
                </div>
            </div>

            {/* Category nav */}
            <div className="border-t border-[#f0f0f0] bg-white">
                <div className="max-w-[1280px] mx-auto px-6 flex overflow-x-auto scrollbar-none">
                    {loading ? (
                        <span className="px-4 py-[10px] text-sm text-gray-400">
                            Loading...
                        </span>
                    ) : (
                        categories.map((c, i) => (
                            <Link
                                to={`/products?category=${c.id}`}
                                key={c.id}
                                className={`px-4 py-[10px] text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors
                                ${i === 0
                                        ? "text-[#c0392b] border-[#c0392b]"
                                        : "text-[#444] border-transparent hover:text-[#c0392b] hover:border-[#c0392b]"
                                    }`}
                            >
                                {c.name}
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </nav>
    );
}