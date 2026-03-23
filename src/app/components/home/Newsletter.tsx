// components/Newsletter.tsx
export function Newsletter() {
  return (
    <div className="bg-[#1c1c1c] rounded-xl px-10 py-12 mb-4 grid grid-cols-[1fr_auto] gap-10 items-center relative overflow-hidden max-sm:grid-cols-1 max-sm:px-7 max-sm:py-9">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 80% at 10% 50%, rgba(192,57,43,0.25) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-[1]">
        <div className="text-[1.6rem] font-extrabold text-white leading-[1.2] mb-1.5">
          Get 20% off your first order
        </div>
        <div className="text-sm text-white/45">
          Subscribe for exclusive deals, new product launches & design tips
        </div>
      </div>
      <div className="flex gap-2 relative z-[1]">
        <input
          type="email"
          placeholder="Enter your email address"
          className="px-4 py-3 rounded-lg border border-white/[0.12] bg-white/[0.07] text-white text-sm font-[inherit] outline-none w-[260px] placeholder-white/30 focus:border-white/30 transition-colors"
        />
        <button className="px-[22px] py-3 rounded-lg bg-[#c0392b] text-white text-sm font-bold border-none cursor-pointer whitespace-nowrap hover:bg-[#a93226] transition-colors font-[inherit]">
          Subscribe
        </button>
      </div>
    </div>
  );
}