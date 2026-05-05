import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ApiResponse {
  status: string;
  reviews?: Review[];
  data?: Review;
  deleted_id?: string;
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  color: "#1a1a2e",
  fontFamily: "'Nunito', sans-serif",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.05em",
  color: "#6b7280",
  textTransform: "uppercase",
  marginBottom: 6,
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
export const StarRating: React.FC<{
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({ value, onChange, readonly, size = "md" }) => {
  const [hovered, setHovered] = useState(0);
  const fontSize = size === "sm" ? 14 : size === "lg" ? 28 : 20;

  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= (readonly ? value : hovered || value);
        return (
          <span
            key={s}
            onClick={() => !readonly && onChange?.(s)}
            onMouseEnter={() => !readonly && setHovered(s)}
            onMouseLeave={() => !readonly && setHovered(0)}
            style={{
              fontSize,
              cursor: readonly ? "default" : "pointer",
              color: filled ? "#f59e0b" : "#d1d5db",
              transition: "color 0.1s, transform 0.1s",
              display: "inline-block",
              transform: !readonly && s <= hovered ? "scale(1.15)" : "scale(1)",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
      {readonly && value > 0 && (
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: size === "sm" ? 11 : 13,
            color: "#6b7280",
            marginLeft: 4,
          }}
        >
          {value}.0
        </span>
      )}
    </div>
  );
};

// ─── Image Upload Preview ─────────────────────────────────────────────────────
const ImageUpload: React.FC<{
  value: File | null;
  onChange: (f: File | null) => void;
}> = ({ value, onChange }) => {
  const preview = value ? URL.createObjectURL(value) : null;

  return (
    <div>
      <label style={labelStyle}>Photo (optional)</label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1.5px dashed #d1d5db",
          borderRadius: 8,
          padding: "12px 16px",
          cursor: "pointer",
          background: "#fafafa",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLLabelElement).style.borderColor = "#f59e0b";
          (e.currentTarget as HTMLLabelElement).style.background = "#fffbeb";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLLabelElement).style.borderColor = "#d1d5db";
          (e.currentTarget as HTMLLabelElement).style.background = "#fafafa";
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#9ca3af",
            }}
          >
            📷
          </div>
        )}
        <div>
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#374151",
            }}
          >
            {value ? value.name : "Upload a photo"}
          </div>
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 2,
            }}
          >
            PNG, JPG up to 5MB
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {value && (
        <button
          onClick={() => onChange(null)}
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            padding: 0,
          }}
        >
          × Remove photo
        </button>
      )}
    </div>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "#10b981" : "#d1d5db",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.25s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.25s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
    {label && (
      <span
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: "#374151",
        }}
      >
        {label}
      </span>
    )}
  </div>
);

// ─── Form Field Helper ────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {hint && (
      <p
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11,
          color: "#9ca3af",
          margin: "4px 0 0",
        }}
      >
        {hint}
      </p>
    )}
  </div>
);

// ─── Rating Labels ────────────────────────────────────────────────────────────
const ratingLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Poor", color: "#ef4444" },
  2: { label: "Fair", color: "#f97316" },
  3: { label: "Good", color: "#eab308" },
  4: { label: "Very Good", color: "#84cc16" },
  5: { label: "Excellent", color: "#10b981" },
};

// ─── API ──────────────────────────────────────────────────────────────────────
const BASE_URL = "https://api.citizenprintz.in/reviews";
export const api = {
  list: (): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/list`).then((r) => r.json()),
  create: (form: FormData): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/create`, { method: "POST", body: form }).then((r) => r.json()),
  update: (id: string, payload: Partial<Review>): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json()),
  delete: (id: string): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then((r) => r.json()),
  activate: (id: string): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/${id}/activate`, { method: "PUT" }).then((r) => r.json()),
  deactivate: (id: string): Promise<ApiResponse> =>
    fetch(`${BASE_URL}/${id}/deactivate`, { method: "PUT" }).then((r) => r.json()),
};

// ─── Submit Button ────────────────────────────────────────────────────────────
const SubmitButton: React.FC<{
  loading: boolean;
  label: string;
  loadingLabel: string;
}> = ({ loading, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={loading}
    style={{
      width: "100%",
      background: loading ? "#d1d5db" : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      color: loading ? "#9ca3af" : "#fff",
      border: "none",
      borderRadius: 10,
      padding: "13px 0",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: "0.04em",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      boxShadow: loading ? "none" : "0 4px 14px rgba(245,158,11,0.35)",
    }}
    onMouseEnter={(e) => {
      if (!loading)
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
    }}
  >
    {loading ? loadingLabel : label}
  </button>
);

// ─── CREATE REVIEW FORM ───────────────────────────────────────────────────────
export const CreateReviewForm: React.FC<{
  onCreated: (r: Review) => void;
  onClose: () => void;
  productId?: string;
  productName?: string;
}> = ({ onCreated, onClose, productId = "", productName }) => {
  const [form, setForm] = useState({
    product_id: productId,
    user_id: "",
    customer_name: "",
    rating: 0,
    comment: "",
    is_active: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.product_id) errs.product_id = "Product ID is required";
    if (!form.user_id) errs.user_id = "User ID is required";
    if (!form.customer_name.trim()) errs.customer_name = "Name is required";
    if (form.rating === 0) errs.rating = "Please select a rating";
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (image) fd.append("image", image);
    const res = await api.create(fd);
    setLoading(false);
    if (res.status === "success" && res.data) {
      onCreated(res.data);
      onClose();
    }
  };

  const ratingInfo = ratingLabels[form.rating];

  return (
    <form onSubmit={submit} noValidate>
      {/* Rating — hero element */}
      <div
        style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fff7f7 100%)",
          border: "1.5px solid #fde68a",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: "#92400e",
            margin: "0 0 12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {productName ? `Rate "${productName}"` : "Your Overall Rating"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <StarRating
            value={form.rating}
            onChange={(v) => {
              setForm((p) => ({ ...p, rating: v }));
              setErrors((p) => ({ ...p, rating: "" }));
            }}
            size="lg"
          />
        </div>
        {ratingInfo && (
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              color: ratingInfo.color,
              background: `${ratingInfo.color}18`,
              padding: "3px 12px",
              borderRadius: 20,
              marginTop: 4,
            }}
          >
            {ratingInfo.label}
          </span>
        )}
        {errors.rating && (
          <p style={{ color: "#ef4444", fontSize: 12, margin: "6px 0 0", fontFamily: "'Nunito', sans-serif" }}>
            {errors.rating}
          </p>
        )}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label="Product ID" required>
          <input
            style={{
              ...inputStyle,
              borderColor: errors.product_id ? "#ef4444" : "#e5e7eb",
            }}
            value={form.product_id}
            onChange={(e) => {
              setForm((p) => ({ ...p, product_id: e.target.value }));
              setErrors((p) => ({ ...p, product_id: "" }));
            }}
            placeholder="e.g. PROD-001"
          />
          {errors.product_id && (
            <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "'Nunito', sans-serif" }}>
              {errors.product_id}
            </p>
          )}
        </Field>

        <Field label="User ID" required>
          <input
            style={{
              ...inputStyle,
              borderColor: errors.user_id ? "#ef4444" : "#e5e7eb",
            }}
            value={form.user_id}
            onChange={(e) => {
              setForm((p) => ({ ...p, user_id: e.target.value }));
              setErrors((p) => ({ ...p, user_id: "" }));
            }}
            placeholder="e.g. USR-123"
          />
          {errors.user_id && (
            <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "'Nunito', sans-serif" }}>
              {errors.user_id}
            </p>
          )}
        </Field>
      </div>

      <Field label="Your Name" required>
        <input
          style={{
            ...inputStyle,
            borderColor: errors.customer_name ? "#ef4444" : "#e5e7eb",
          }}
          value={form.customer_name}
          onChange={(e) => {
            setForm((p) => ({ ...p, customer_name: e.target.value }));
            setErrors((p) => ({ ...p, customer_name: "" }));
          }}
          placeholder="e.g. Sarah Johnson"
        />
        {errors.customer_name && (
          <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "'Nunito', sans-serif" }}>
            {errors.customer_name}
          </p>
        )}
      </Field>

      <Field
        label="Review"
        hint="Share your experience with other shoppers"
      >
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
          value={form.comment}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          placeholder="What did you like or dislike? How was the quality, size, fit?"
          maxLength={500}
        />
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#9ca3af", textAlign: "right", margin: "4px 0 0" }}>
          {form.comment.length}/500
        </p>
      </Field>

      <div style={{ marginBottom: 18 }}>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div style={{ marginBottom: 24, padding: "12px 16px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
        <Toggle
          checked={form.is_active}
          onChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
          label="Publish review immediately"
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: "0 0 auto",
            background: "#fff",
            color: "#6b7280",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "13px 20px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Cancel
        </button>
        <div style={{ flex: 1 }}>
          <SubmitButton loading={loading} label="Submit Review" loadingLabel="Submitting…" />
        </div>
      </div>
    </form>
  );
};

// ─── EDIT REVIEW FORM ─────────────────────────────────────────────────────────
export const EditReviewForm: React.FC<{
  review: Review;
  onUpdated: (r: Review) => void;
  onClose: () => void;
}> = ({ review, onUpdated, onClose }) => {
  const [form, setForm] = useState({
    rating: review.rating,
    comment: review.comment ?? "",
    is_active: review.is_active,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.update(review.id, {
      rating: form.rating,
      comment: form.comment || undefined,
      is_active: form.is_active,
    });
    setLoading(false);
    if (res.status === "success" && res.data) {
      onUpdated(res.data);
      onClose();
    }
  };

  const ratingInfo = ratingLabels[form.rating];

  return (
    <form onSubmit={submit} noValidate>
      <div
        style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fff7f7 100%)",
          border: "1.5px solid #fde68a",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: "#92400e",
            margin: "0 0 12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Update Your Rating
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <StarRating
            value={form.rating}
            onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
            size="lg"
          />
        </div>
        {ratingInfo && (
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              color: ratingInfo.color,
              background: `${ratingInfo.color}18`,
              padding: "3px 12px",
              borderRadius: 20,
              marginTop: 4,
            }}
          >
            {ratingInfo.label}
          </span>
        )}
      </div>

      <Field label="Review">
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
          value={form.comment}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          placeholder="Share your experience…"
          maxLength={500}
        />
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#9ca3af", textAlign: "right", margin: "4px 0 0" }}>
          {form.comment.length}/500
        </p>
      </Field>

      <div style={{ marginBottom: 24, padding: "12px 16px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
        <Toggle
          checked={form.is_active}
          onChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
          label="Published"
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: "0 0 auto",
            background: "#fff",
            color: "#6b7280",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "13px 20px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <div style={{ flex: 1 }}>
          <SubmitButton loading={loading} label="Save Changes" loadingLabel="Saving…" />
        </div>
      </div>
    </form>
  );
};