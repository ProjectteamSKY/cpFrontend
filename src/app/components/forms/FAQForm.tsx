import { useState, useEffect } from "react";
import { FAQFormData } from "../../types/faq";
import { getAllCategories } from "../../service/categoryApiService";
import { getAllProducts } from "../../service/productApiService";

export function FAQForm({ defaultValues, onSubmit, onCancel }: any) {
  const [form, setForm] = useState<FAQFormData>(
    defaultValues || {
      question: "",
      answer: "",
      type: "category",
      category_id: "",
      product_id: "",
      sort_order: 0,
    }
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);
      setCategories(catData);
      setProducts(prodData);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    setForm({ ...form, type: newType, category_id: "", product_id: "" });
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.question.trim()) newErrors.question = "Question is required.";
    if (!form.answer.trim()) newErrors.answer = "Answer is required.";

    // Category always required for both types
    if (!form.category_id) newErrors.category_id = "Please select a category.";

    // Product required only when type is "product"
    if (form.type === "product" && !form.product_id)
      newErrors.product_id = "Please select a product.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Build clean payload — pass null for unused foreign keys
    const payload: FAQFormData = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      type: form.type,
      sort_order: form.sort_order,
      category_id: form.category_id || null,
      product_id: form.type === "product" ? (form.product_id || null) : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">

      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          {defaultValues ? "Edit" : "Create"}{" "}
          <span className="text-[#D73D32]">FAQ Entry</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Fields marked <span className="text-[#D73D32]">*</span> are required.
        </p>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-5">

        {/* Question */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Question <span className="text-[#D73D32]">*</span>
          </label>
          <input
            className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none transition
              focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20 focus:bg-white
              ${errors.question ? "border-[#D73D32] bg-red-50" : "border-gray-200"}`}
            placeholder="e.g. How do I track my order?"
            value={form.question}
            onChange={(e) => {
              setForm({ ...form, question: e.target.value });
              if (errors.question) setErrors({ ...errors, question: "" });
            }}
          />
          {errors.question && (
            <p className="text-xs text-[#D73D32] mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Answer <span className="text-[#D73D32]">*</span>
          </label>
          <textarea
            className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none transition resize-y min-h-[100px] leading-relaxed
              focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20 focus:bg-white
              ${errors.answer ? "border-[#D73D32] bg-red-50" : "border-gray-200"}`}
            placeholder="Write a clear, helpful answer..."
            value={form.answer}
            onChange={(e) => {
              setForm({ ...form, answer: e.target.value });
              if (errors.answer) setErrors({ ...errors, answer: "" });
            }}
          />
          {errors.answer && (
            <p className="text-xs text-[#D73D32] mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.answer}
            </p>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Type Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Applies To
          </label>
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            {["category", "product"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150
                  ${form.type === t
                    ? "bg-[#D73D32] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#D73D32] hover:bg-white/60"
                  }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D73D32] animate-pulse" />
            Loading options...
          </div>
        )}

        {/* Category Dropdown — always visible for BOTH types */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Category <span className="text-[#D73D32]">*</span>
          </label>
          <select
            className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none transition
              focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20 focus:bg-white
              ${errors.category_id ? "border-[#D73D32] bg-red-50" : "border-gray-200"}`}
            value={form.category_id ?? ""}  
            onChange={(e) => {
              setForm({ ...form, category_id: e.target.value });
              if (errors.category_id) setErrors({ ...errors, category_id: "" });
            }}
          >
            <option value="">— Select Category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-xs text-[#D73D32] mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.category_id}
            </p>
          )}
        </div>

        {/* Product Dropdown — only visible when type is "product" */}
        {form.type === "product" && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
              Product <span className="text-[#D73D32]">*</span>
            </label>
            <select
              className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none transition
                focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20 focus:bg-white
                ${errors.product_id ? "border-[#D73D32] bg-red-50" : "border-gray-200"}`}
              value={form.product_id ?? ""} 
              onChange={(e) => {
                setForm({ ...form, product_id: e.target.value });
                if (errors.product_id) setErrors({ ...errors, product_id: "" });
              }}
            >
              <option value="">— Select Product —</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
            {errors.product_id && (
              <p className="text-xs text-[#D73D32] mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.product_id}
              </p>
            )}
          </div>
        )}

        <hr className="border-gray-100" />

        {/* Sort Order */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Sort Order
          </label>
          <input
            type="number"
            className="w-28 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none transition
              focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20 focus:bg-white"
            placeholder="0"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-2.5 bg-[#D73D32] hover:bg-[#c0342a] active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-[#D73D32]/25 transition-all duration-150"
        >
          {defaultValues ? "Update FAQ" : "Save FAQ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-all duration-150"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}