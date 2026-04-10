import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  type: "category" | "product";
  category_id: string;
  product_id: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface APIResponse {
  status: string;
  data: FAQItem[];
}

interface FAQProps {
  categoryId: string;
  productId?: string;
}

// ─── Chevron Icon ─────────────────────────────────────────────────────────────
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Accordion Item ───────────────────────────────────────────────────────────
const AccordionItem = ({ faq }: { faq: FAQItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
        open ? "bg-[#D73D32]/[0.02]" : ""
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-1 text-left group gap-3"
        aria-expanded={open}
      >
        <span
          className={`text-sm font-semibold leading-snug transition-colors duration-150 ${
            open ? "text-[#D73D32]" : "text-black group-hover:text-[#D73D32]"
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`transition-colors duration-150 flex-shrink-0 ${
            open ? "text-[#D73D32]" : "text-gray-300 group-hover:text-[#D73D32]"
          }`}
        >
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 px-1 flex gap-3">
          <div className="w-0.5 bg-[#D73D32] rounded-full flex-shrink-0 self-stretch" />
          <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonItem = () => (
  <div className="border-b border-gray-100 py-4 px-1 animate-pulse last:border-b-0">
    <div className="h-4 bg-gray-100 rounded w-4/5" />
  </div>
);

// ─── Main FAQ Component ───────────────────────────────────────────────────────
export default function FAQ({ categoryId, productId }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isTwoCol = containerWidth >= 640;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const buildApiUrl = (): string => {
    const params = new URLSearchParams({ category_id: categoryId });
    if (productId) params.append("product_id", productId);
    return `http://54.206.3.97/api/faq/product?${params.toString()}`;
  };

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    setFaqs([]);

    fetch(buildApiUrl())
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<APIResponse>;
      })
      .then((json) => setFaqs(json.data ?? []))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, productId]);

  const productCount = faqs.filter((f) => f.type === "product").length;
  const categoryCount = faqs.filter((f) => f.type === "category").length;

  return (
    <div ref={containerRef} className="w-full bg-white py-8">
      <div
        style={{
          display: "flex",
          flexDirection: isTwoCol ? "row" : "column",
          gap: isTwoCol ? "40px" : "28px",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* ── LEFT: Info panel — 50% width ── */}
        <div
          style={{
            flex: "0 0 50%",          // exactly 50%, no grow no shrink
            width: isTwoCol ? "50%" : "100%",
            minWidth: 0,
            position: isTwoCol ? "sticky" : "static",
            top: isTwoCol ? "24px" : undefined,
            boxSizing: "border-box",
          }}
        >
          <div className="w-10 h-1 bg-[#D73D32] rounded-full mb-5" />

          <h2 className="text-2xl font-extrabold text-black leading-tight tracking-tight mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Can't find what you're looking for? Our support team is always happy to help.
          </p>

          {/* Support card */}
          <div className="p-5 space-y-3">
            {/* <div className="w-8 h-8 bg-[#D73D32]/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div> */}
            {/* <div>
              <p className="text-black font-bold text-sm">Still need help?</p>
              <p className="text-gray-400 text-xs mt-0.5">Mon–Fri, 9am–6pm EST</p>
            </div> */}
            <button className="w-full bg-[#D73D32] hover:bg-[#c0342a] text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>

          {/* Stats */}
          {/* {!loading && !error && faqs.length > 0 && (
            <div className="mt-4 flex gap-3">
              <div className="flex-1 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold text-black">{faqs.length}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Total</p>
              </div>
              <div className="flex-1 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold text-[#D73D32]">{productCount}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Product</p>
              </div>
              <div className="flex-1 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold text-black">{categoryCount}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">General</p>
              </div>
            </div>
          )} */}
        </div>

        {/* ── RIGHT: Accordion — 50% width ── */}
        <div
          style={{
            flex: "0 0 calc(50% - 20px)", // 50% minus half the gap
            width: isTwoCol ? "calc(50% - 20px)" : "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
          className="border border-gray-200 rounded-2xl px-6 py-2 bg-white"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
          ) : error ? (
            <div className="py-14 text-center">
              <p className="text-[#D73D32] font-semibold text-sm">Failed to load</p>
              <p className="text-gray-400 text-xs mt-1">{error}</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-gray-400 text-sm">No questions available.</p>
            </div>
          ) : (
            faqs.map((faq) => <AccordionItem key={faq.id} faq={faq} />)
          )}
        </div>
      </div>
    </div>
  );
}