// components/PromoBar.tsx
export function PromoBar() {
  return (
    <div className="bg-[#1c1c1c] text-white text-[12.5px] font-medium text-center px-4 py-[10px] tracking-[0.01em]">
      🎉 Get <strong>20% OFF</strong> your first order — Use code <strong>FIRST20</strong>
      &nbsp;·&nbsp;
      <a className="text-amber-400 underline cursor-pointer">Free shipping</a> on orders above ₹999
    </div>
  );
}