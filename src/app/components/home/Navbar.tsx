// components/Navbar.tsx
import { Link } from "react-router";
import { Search, User, Heart, ShoppingCart } from "lucide-react";

const CATEGORIES = [
    "All Products", "Business Cards", "Banners & Signage", "Flyers & Brochures",
    "Stickers & Labels", "ID Cards", "Posters", "Wedding Cards", "Packaging", "Bulk Orders",
];

export function Navbar() {
    return (
        <nav className="bg-white border-b border-[#e8e8e8] sticky top-0 z-[100]">
            {/* Top row */}
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-6">
                <Link to="/" className="text-[22px] font-extrabold text-[#c0392b] no-underline whitespace-nowrap tracking-[-0.5px]">
                    Citizen Prints
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-[560px] flex items-center bg-[#f5f5f5] border border-[#e5e5e5] rounded-lg px-[14px] gap-2 h-[42px] focus-within:border-[#c0392b] focus-within:bg-white transition-colors">
                    <Search size={15} className="text-[#aaa] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search for business cards, banners, flyers…"
                        className="border-none bg-transparent outline-none text-sm font-[inherit] w-full text-[#1c1c1c] placeholder-[#aaa]"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto">
                    <a className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors no-underline whitespace-nowrap">
                        <User size={16} /> Account
                    </a>
                    <a className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                        <Heart size={16} />
                    </a>
                    

                     <Link
                        to="/Cart"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                    >
                        <ShoppingCart size={16} /> Cart
                    </Link>
                    <Link
                        to="/products"
                        className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg text-[13px] font-semibold bg-[#c0392b] text-white hover:bg-[#a93226] transition-colors no-underline whitespace-nowrap"
                    >
                        Order Now
                    </Link>
                </div>
            </div>

            {/* Category nav */}
            <div className="border-t border-[#f0f0f0] bg-white">
                <div className="max-w-[1280px] mx-auto px-6 flex overflow-x-auto scrollbar-none">
                    {CATEGORIES.map((c, i) => (
                        <Link
                            to="/products"
                            key={c}
                            className={`px-4 py-[10px] text-[13px] font-semibold whitespace-nowrap cursor-pointer border-b-2 transition-colors no-underline
                ${i === 0
                                    ? "text-[#c0392b] border-[#c0392b]"
                                    : "text-[#444] border-transparent hover:text-[#c0392b] hover:border-[#c0392b]"
                                }`}
                        >
                            {c}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}