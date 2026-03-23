// components/Footer.tsx
import { Link } from "react-router";
import { Phone, Layers } from "lucide-react";

const PRODUCTS = ["Business Cards", "Brochures", "Banners", "Flyers", "Posters", "ID Cards", "Stickers"];
const COMPANY  = ["About Us", "Bulk Orders", "Design Services", "Blog", "Careers", "Affiliates"];
const SUPPORT  = ["Track Order", "FAQ", "Shipping Info", "Return Policy", "Contact Us", "WhatsApp Chat"];
const PAY_ICONS = ["UPI", "GPay", "Paytm", "Visa", "MC"];

export function Footer() {
  return (
    <div className="bg-white border-t border-[#efefef] mt-4">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 pt-10 pb-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        {/* Brand */}
        <div>
          <div className="text-[22px] font-extrabold text-[#c0392b] mb-2.5 tracking-[-0.5px]">Citizen Prints</div>
          <div className="text-[13px] text-[#777] leading-[1.7] max-w-[230px] mb-[18px]">
            Your trusted print partner across India. Premium quality, fast delivery, unbeatable prices — since 2015.
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12.5px] text-[#555]">
              <Phone size={13} className="text-[#c0392b] shrink-0" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-[#555]">
              <Layers size={13} className="text-[#c0392b] shrink-0" /> hello@citizenprints.in
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#111] mb-3.5">Products</div>
          <div className="flex flex-col gap-[9px]">
            {PRODUCTS.map(l => (
              <Link to="/products" key={l} className="text-[13px] text-[#666] no-underline hover:text-[#c0392b] transition-colors">{l}</Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#111] mb-3.5">Company</div>
          <div className="flex flex-col gap-[9px]">
            {COMPANY.map(l => (
              <a key={l} href="#" className="text-[13px] text-[#666] no-underline hover:text-[#c0392b] transition-colors">{l}</a>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#111] mb-3.5">Support</div>
          <div className="flex flex-col gap-[9px]">
            {SUPPORT.map(l => (
              <a key={l} href="#" className="text-[13px] text-[#666] no-underline hover:text-[#c0392b] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#f0f0f0]">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-2.5">
          <span className="text-[12px] text-[#aaa]">© 2025 Citizen Prints. All rights reserved. Made with ❤️ in Tamil Nadu</span>
          <div className="flex gap-1.5">
            {PAY_ICONS.map(p => (
              <span key={p} className="bg-[#f5f5f5] border border-[#e5e5e5] rounded px-2 py-[3px] text-[11px] font-bold text-[#555]">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}