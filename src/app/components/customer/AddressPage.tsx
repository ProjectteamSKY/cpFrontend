import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Plus,
  ArrowLeft,
  CheckCircle,
  Trash2,
  Home,
  Briefcase,
  Edit2,
  X,
  ChevronRight,
  Lock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://54.206.3.97/api";

const emptyForm = {
  first_name: "",
  last_name: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  postal_code: "",
  phone: "",
  email: "",
  address_type: "home", // home | work | other
};

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/30 focus:border-[#D73D32] transition-all duration-200 bg-gray-50 hover:bg-white";

const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

export function AddressPage() {
  const navigate = useNavigate();
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  // ─── Fetch saved addresses ─────────────────────────────────────────────────
  const fetchAddresses = async () => {
    if (!userId) {
      toast.error("Please login to continue");
      setLoadingAddresses(false);
      return;
    }
    try {
      const res = await axios.get(
        `${API_BASE}/user-address/user/${userId}`,
        { withCredentials: true }
      );
      const list = res.data.data || res.data || [];
      setSavedAddresses(list);
      // auto-select default
      const def = list.find((a: any) => a.is_default);
      if (def) setSelectedAddressId(def.id);
      else if (list.length) setSelectedAddressId(list[0].id);
    } catch (err) {
      toast.error("Failed to load saved addresses");
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleFormChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.first_name) return "First name is required";
    if (!form.street) return "Street address is required";
    if (!form.city) return "City is required";
    if (!form.state) return "State is required";
    if (!form.postal_code) return "Pincode is required";
    if (!form.phone) return "Phone number is required";
    if (!form.email) return "Email is required";
    return null;
  };

  // ─── Save (create or update) ───────────────────────────────────────────────
  const handleSaveAddress = async () => {
    const err = validateForm();
    if (err) { toast.error(err); return; }

    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        first_name: form.first_name,
        last_name: form.last_name,
        address: form.street,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        country: form.country,
        postal_code: form.postal_code,
        phone: form.phone,
        email: form.email,
        address_type: form.address_type,
        is_default: false,
      };

      if (editingId) {
        await axios.put(
          `${API_BASE}/user-address/update/${editingId}`,
          payload,
          { withCredentials: true }
        );
        toast.success("Address updated");
      } else {
        await axios.post(
          `${API_BASE}/user-address/create`,
          payload,
          { withCredentials: true }
        );
        toast.success("Address added");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      fetchAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/user-address/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Address removed");
      if (selectedAddressId === id) setSelectedAddressId(null);
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  // ─── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (addr: any) => {
    setForm({
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      street: addr.address || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "India",
      postal_code: addr.postal_code || "",
      phone: addr.phone || "",
      email: addr.email || "",
      address_type: addr.address_type || "home",
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    // Pass selected address via sessionStorage so CheckoutPage can use it
    sessionStorage.setItem("selected_address_id", selectedAddressId);
    sessionStorage.setItem("selected_address", JSON.stringify(selected));
    navigate("/checkout");
  };

  const addressTypeIcon = (type: string) => {
    if (type === "work") return <Briefcase className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loadingAddresses) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#D73D32] border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
            Loading addresses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Delivery Address
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Select or add a delivery address
          </p>
        </div>

        {/* ── Saved Addresses ──────────────────────────────────────────────── */}
        {savedAddresses.length > 0 && (
          <div className="space-y-3 mb-6">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                  selectedAddressId === addr.id
                    ? "border-[#D73D32] shadow-md shadow-red-100"
                    : "border-transparent shadow-sm hover:border-gray-200"
                }`}
              >
                {/* Selected ribbon */}
                {selectedAddressId === addr.id && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#D73D32] rounded-t-2xl" />
                )}

                <div className="p-5 flex items-start gap-4">
                  {/* Radio */}
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedAddressId === addr.id
                        ? "border-[#D73D32]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAddressId === addr.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D73D32]" />
                    )}
                  </div>

                  {/* Address icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedAddressId === addr.id
                        ? "bg-red-50 text-[#D73D32]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">
                        {addr.first_name} {addr.last_name}
                      </p>
                      {addr.address_type && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            selectedAddressId === addr.id
                              ? "bg-red-100 text-[#D73D32]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {addressTypeIcon(addr.address_type)}
                          {addr.address_type}
                        </span>
                      )}
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                          <CheckCircle className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.address}
                      {addr.landmark ? `, ${addr.landmark}` : ""}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} — {addr.postal_code}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {addr.phone} · {addr.email}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Add new address button / collapsed trigger ────────────────────── */}
        {!showForm ? (
          <button
            onClick={() => {
              setForm({ ...emptyForm });
              setEditingId(null);
              setShowForm(true);
            }}
            className="w-full border-2 border-dashed border-gray-200 hover:border-[#D73D32]/40 hover:bg-red-50/30 rounded-2xl py-5 flex items-center justify-center gap-3 text-gray-500 hover:text-[#D73D32] transition-all duration-200 group mb-6"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Add New Address</span>
          </button>
        ) : (
          /* ── New / Edit Address Form ────────────────────────────────────── */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Form header */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D73D32]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">
                    {editingId ? "Edit Address" : "New Address"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Fill in the delivery details
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm({ ...emptyForm }); }}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Address type pills */}
              <div>
                <label className={labelClass}>Address Type</label>
                <div className="flex gap-2">
                  {["home", "work", "other"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFormChange("address_type", type)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all duration-200 ${
                        form.address_type === type
                          ? "border-[#D73D32] bg-red-50 text-[#D73D32]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {type === "home" && <Home className="w-3.5 h-3.5" />}
                      {type === "work" && <Briefcase className="w-3.5 h-3.5" />}
                      {type === "other" && <MapPin className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    First Name <span className="text-[#D73D32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => handleFormChange("first_name", e.target.value)}
                    placeholder="John"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => handleFormChange("last_name", e.target.value)}
                    placeholder="Doe"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label className={labelClass}>
                  Street Address <span className="text-[#D73D32]">*</span>
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => handleFormChange("street", e.target.value)}
                  placeholder="123 Main Street, Area, District"
                  className={inputClass}
                />
              </div>

              {/* Landmark */}
              <div>
                <label className={labelClass}>
                  Landmark{" "}
                  <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => handleFormChange("landmark", e.target.value)}
                  placeholder="Near bus stop, opposite park..."
                  className={inputClass}
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    City <span className="text-[#D73D32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    placeholder="Chennai"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    State <span className="text-[#D73D32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    placeholder="Tamil Nadu"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Pincode & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Pincode <span className="text-[#D73D32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => handleFormChange("postal_code", e.target.value)}
                    placeholder="600001"
                    maxLength={6}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Phone <span className="text-[#D73D32]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email <span className="text-[#D73D32]">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>

              {/* Form actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveAddress}
                  disabled={saving}
                  className="flex-1 bg-[#D73D32] hover:bg-[#C0362B] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingId ? "Update Address" : "Save Address"}</>
                  )}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); setForm({ ...emptyForm }); }}
                  className="px-6 py-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Continue CTA ─────────────────────────────────────────────────── */}
        <button
          onClick={handleContinue}
          disabled={!selectedAddressId}
          className="w-full bg-[#1A1A1A] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          Continue to Payment
          <ChevronRight className="w-4 h-4" />
        </button>

        {!selectedAddressId && savedAddresses.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Please select an address above to continue
          </p>
        )}
      </div>
    </div>
  );
}