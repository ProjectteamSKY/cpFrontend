import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  MapPin, Plus, ArrowLeft, CheckCircle, Trash2,
  Home, Briefcase, Edit2, X, ChevronRight, Lock,
  Shield, Zap, Package, Star, Phone, Mail, Navigation,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserId } from "../../utils/authStorage";

const API_BASE = "http://54.206.3.97";

const emptyForm = {
  first_name: "", last_name: "", street: "", landmark: "",
  city: "", state: "", country: "India", postal_code: "",
  phone: "", email: "", address_type: "home",
};

const inputClass =
  "w-full bg-white border border-[#e2e2e2] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200 hover:border-[#c8c8c8] shadow-sm";

const labelClass =
  "block text-[10px] font-extrabold text-[#999] uppercase tracking-[0.14em] mb-1.5";

/* ─── Address Modal ───────────────────────────────────────────────────── */
function AddressModal({ open, editingId, form, saving, onChange, onSave, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl border border-[#ececec]"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="h-[3px] w-full bg-[#D73D32]" />

        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#ddd]" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D73D32]/10 border border-[#D73D32]/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#D73D32]" />
            </div>
            <div>
              <h2 className="font-black text-[#1a1a1a] text-sm">
                {editingId ? "Edit Address" : "New Delivery Address"}
              </h2>
              <p className="text-[11px] text-[#aaa]">All starred fields are required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f5f5f5] hover:bg-[#D73D32]/10 hover:text-[#D73D32] flex items-center justify-center text-[#aaa] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 bg-[#fafafa]">
          <div>
            <label className={labelClass}>Address Type</label>
            <div className="flex gap-2">
              {["home", "work", "other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange("address_type", type)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${form.address_type === type
                      ? "border-[#D73D32] bg-[#D73D32]/10 text-[#D73D32]"
                      : "border-[#e2e2e2] text-[#aaa] hover:border-[#c8c8c8] bg-white"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First Name <span className="text-[#D73D32]">*</span></label>
              <input type="text" value={form.first_name} onChange={(e) => onChange("first_name", e.target.value)} placeholder="Arjun" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" value={form.last_name} onChange={(e) => onChange("last_name", e.target.value)} placeholder="Sharma" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address <span className="text-[#D73D32]">*</span></label>
            <input type="text" value={form.street} onChange={(e) => onChange("street", e.target.value)} placeholder="Flat 4B, Sunrise Towers, Anna Nagar" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Landmark <span className="text-[#ccc] font-normal normal-case">(optional)</span></label>
            <input type="text" value={form.landmark} onChange={(e) => onChange("landmark", e.target.value)} placeholder="Near Metro, Opp. Big Bazaar…" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>City <span className="text-[#D73D32]">*</span></label>
              <input type="text" value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Chennai" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State <span className="text-[#D73D32]">*</span></label>
              <input type="text" value={form.state} onChange={(e) => onChange("state", e.target.value)} placeholder="Tamil Nadu" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Pincode <span className="text-[#D73D32]">*</span></label>
              <input type="text" value={form.postal_code} onChange={(e) => onChange("postal_code", e.target.value)} placeholder="600001" maxLength={6} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone <span className="text-[#D73D32]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#D73D32] font-bold select-none">+91</span>
                <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="9876543210" maxLength={10} className={`${inputClass} pl-12`} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Email <span className="text-[#D73D32]">*</span></label>
            <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="arjun@example.com" className={inputClass} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#f0f0f0] flex gap-3 bg-white">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-[#D73D32] hover:bg-[#c23228] disabled:bg-[#f0f0f0] disabled:text-[#ccc] text-white font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D73D32]/20"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
            ) : editingId ? "Update Address" : "Save Address"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-[#e2e2e2] hover:bg-[#f5f5f5] text-[#999] hover:text-[#555] font-semibold rounded-xl text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Address Card ────────────────────────────────────────────────────── */
function AddressCard({ addr, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden group ${isSelected
          ? "border-[#D73D32] bg-white shadow-md shadow-[#D73D32]/10"
          : "border-[#e8e8e8] bg-white hover:border-[#d0d0d0] hover:shadow-sm"
        }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D73D32]" />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "border-[#D73D32]" : "border-[#ccc]"
            }`}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D73D32]" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-black text-[#1a1a1a] text-sm">{addr.first_name} {addr.last_name}</span>
              {addr.address_type && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize border ${isSelected
                    ? "bg-[#D73D32]/10 text-[#D73D32] border-[#D73D32]/25"
                    : "bg-[#f5f5f5] text-[#999] border-[#e8e8e8]"
                  }`}>
                  {addr.address_type === "work" ? <Briefcase className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                  {addr.address_type}
                </span>
              )}
              {(addr.is_default === 1 || addr.is_default === true) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#D73D32]/10 text-[#D73D32] border border-[#D73D32]/25">
                  <Star className="w-2.5 h-2.5" /> Default
                </span>
              )}
            </div>

            <p className="text-sm text-[#555] leading-snug">
              {addr.address}{addr.landmark ? `, ${addr.landmark}` : ""}
            </p>
            <p className="text-sm text-[#999] mt-0.5">{addr.city}, {addr.state} — {addr.postal_code}</p>

            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[11px] text-[#aaa]"><Phone className="w-3 h-3 text-[#D73D32]" />{addr.phone}</span>
              <span className="w-px h-3 bg-[#ddd]" />
              <span className="flex items-center gap-1 text-[11px] text-[#aaa] truncate"><Mail className="w-3 h-3 text-[#D73D32]" />{addr.email}</span>
            </div>

            {isSelected && (
              <div className="mt-3 flex items-center gap-2 bg-[#D73D32]/10 border border-[#D73D32]/20 rounded-xl px-3 py-2">
                <Zap className="w-3.5 h-3.5 text-[#D73D32] flex-shrink-0" />
                <p className="text-[11px] text-[#D73D32] font-semibold">Express delivery to this address</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 transition-opacity flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-7 h-7 rounded-lg bg-[#f5f5f5] hover:bg-[#D73D32]/10 hover:text-[#D73D32] flex items-center justify-center text-[#aaa] transition-all"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-7 h-7 rounded-lg bg-[#f5f5f5] hover:bg-[#D73D32]/10 hover:text-[#D73D32] flex items-center justify-center text-[#aaa] transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Right Panel ─────────────────────────────────────────────────────── */
function PaymentPanel({ selectedAddress, onContinue }) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-2xl border-2 transition-all duration-300 ${selectedAddress
          ? "border-[#D73D32]/35 bg-[#D73D32]/5 shadow-sm"
          : "border-dashed border-[#e2e2e2] bg-[#fafafa]"
        }`}>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className={`w-4 h-4 ${selectedAddress ? "text-[#D73D32]" : "text-[#ccc]"}`} />
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${selectedAddress ? "text-[#D73D32]" : "text-[#ccc]"}`}>
              Delivering to
            </p>
          </div>
          {selectedAddress ? (
            <div>
              <p className="text-sm font-black text-[#1a1a1a]">{selectedAddress.first_name} {selectedAddress.last_name}</p>
              <p className="text-xs text-[#888] mt-0.5 leading-snug">
                {selectedAddress.address}{selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postal_code}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#ccc]">← Select an address to continue</p>
          )}
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={!selectedAddress}
        className="w-full bg-[#D73D32] hover:bg-[#c23228] disabled:bg-[#f0f0f0] disabled:text-[#ccc] disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D73D32]/20"
      >
        <span>Continue to Payment</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Lock, label: "SSL Encrypted" },
          { icon: Shield, label: "PCI Compliant" },
          { icon: CheckCircle, label: "100% Secure" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 bg-white border border-[#ececec] rounded-xl py-3 shadow-sm">
            <Icon className="w-4 h-4 text-[#D73D32]" />
            <span className="text-[10px] font-bold text-[#aaa] text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared address list UI ──────────────────────────────────────────── */
function AddressList({ savedAddresses, selectedAddressId, setSelectedAddressId, openAddModal, openEditModal, handleDelete }) {
  return (
    <>
      {savedAddresses.length > 0 ? (
        <div className="space-y-3">
          {savedAddresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              isSelected={selectedAddressId === addr.id}
              onSelect={() => setSelectedAddressId(addr.id)}
              onEdit={() => openEditModal(addr)}
              onDelete={() => handleDelete(addr.id)}
            />
          ))}
        </div>
      ) : (
        <div
          onClick={openAddModal}
          className="border-2 border-dashed border-[#e2e2e2] hover:border-[#D73D32]/40 bg-white hover:bg-[#D73D32]/5 rounded-2xl py-16 flex flex-col items-center gap-4 text-[#ccc] hover:text-[#D73D32] transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#f8f8f8] group-hover:bg-[#D73D32]/10 flex items-center justify-center transition-colors border border-[#ececec] group-hover:border-[#D73D32]/25">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-black text-sm text-[#bbb] group-hover:text-[#555] transition-colors">No saved addresses</p>
            <p className="text-xs text-[#ccc] mt-0.5">Click to add your first delivery address</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-[#D73D32] bg-[#D73D32]/10 border border-[#D73D32]/25 px-3 py-1.5 rounded-xl">
            <Plus className="w-3.5 h-3.5" /> Add Address
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export function AddressPage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const navigate = useNavigate();
  const userId = getUserId();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    if (!userId) { toast.error("Please login to continue"); setLoadingAddresses(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/api/user_address/list/${userId}`, { withCredentials: true });
      const list = res.data.addresses || [];
      setSavedAddresses(list);
      const def = list.find((a) => a.is_default === 1 || a.is_default === true);
      if (def) setSelectedAddressId(def.id);
      else if (list.length) setSelectedAddressId(list[0].id);
    } catch {
      toast.error("Failed to load saved addresses");
      setSavedAddresses([]);
    } finally { setLoadingAddresses(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleFormChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateForm = () => {
    if (!form.first_name) return "First name is required";
    if (!form.street) return "Street address is required";
    if (!form.city) return "City is required";
    if (!form.state) return "State is required";
    if (!form.postal_code) return "Pincode is required";
    if (!form.phone) return "Phone is required";
    if (!form.email) return "Email is required";
    return null;
  };

  const handleSaveAddress = async () => {
    const err = validateForm();
    if (err) { toast.error(err); return; }
    setSaving(true);
    try {
      const payload = {
        user_id: userId, first_name: form.first_name, last_name: form.last_name,
        address: form.street, landmark: form.landmark, city: form.city,
        state: form.state, country: form.country, postal_code: form.postal_code,
        phone: form.phone, email: form.email, address_type: form.address_type, is_default: false,
      };
      if (editingId) {
        await axios.put(`${API_BASE}/api/user_address/update/${editingId}`, payload, { withCredentials: true });
        toast.success("Address updated");
      } else {
        await axios.post(`${API_BASE}/api/user_address/create`, payload);
        toast.success("Address added");
      }
      closeModal(); fetchAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save address");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/user_address/delete/${id}`);
      toast.success("Address removed");
      if (selectedAddressId === id) setSelectedAddressId(null);
      fetchAddresses();
    } catch { toast.error("Failed to delete address"); }
  };

  const openAddModal = () => { setForm({ ...emptyForm }); setEditingId(null); setModalOpen(true); };
  const openEditModal = (addr) => {
    setForm({
      first_name: addr.first_name || "", last_name: addr.last_name || "",
      street: addr.address || "", landmark: addr.landmark || "",
      city: addr.city || "", state: addr.state || "", country: addr.country || "India",
      postal_code: addr.postal_code || "", phone: addr.phone || "",
      email: addr.email || "", address_type: addr.address_type || "home",
    });
    setEditingId(addr.id); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...emptyForm }); };

  const handleContinue = () => {
    if (!selectedAddressId) { toast.error("Please select a delivery address"); return; }
    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    sessionStorage.setItem("selected_address_id", selectedAddressId);
    sessionStorage.setItem("selected_address", JSON.stringify(selected));
    navigate("/checkout");
  };

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId) ?? null;

  const sharedProps = { savedAddresses, selectedAddressId, setSelectedAddressId, openAddModal, openEditModal, handleDelete };

  if (loadingAddresses) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8e8e8]" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D73D32] animate-spin" />
          </div>
          <p className="text-xs font-bold text-[#bbb] tracking-[0.18em] uppercase">Loading</p>
        </div>
      </div>
    );
  }

  /* ── Embedded inside ProfilePage: just the list + add button, no nav/payment ── */
  if (isEmbedded) {
    return (
      <>
        <AddressModal
          open={modalOpen} editingId={editingId} form={form} saving={saving}
          onChange={handleFormChange} onSave={handleSaveAddress} onClose={closeModal}
        />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a]">Saved Addresses</h2>
            <p className="text-sm text-[#aaa] mt-0.5">
              {savedAddresses.length > 0
                ? `${savedAddresses.length} address${savedAddresses.length !== 1 ? "es" : ""} saved`
                : "No addresses saved yet"}
            </p>
          </div>
          {savedAddresses.length > 0 && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-white border-2 border-[#D73D32]/35 hover:border-[#D73D32] hover:bg-[#D73D32]/5 text-[#D73D32] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Address
            </button>
          )}
        </div>

        <AddressList {...sharedProps} />
      </>
    );
  }

  /* ── Standalone full page: original layout with sticky nav + payment panel ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f0f0f0; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #D73D32; }
      `}</style>

      <AddressModal
        open={modalOpen} editingId={editingId} form={form} saving={saving}
        onChange={handleFormChange} onSave={handleSaveAddress} onClose={closeModal}
      />

      <div className="min-h-screen bg-[#f7f7f7]">
        {/* Sticky top nav */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#ececec] shadow-sm">
          <div className="w-full px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-[#aaa] hover:text-[#1a1a1a] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f5] group-hover:bg-[#D73D32]/10 group-hover:text-[#D73D32] flex items-center justify-center transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              Back
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              {["Delivery Address", "Payment", "Review & Place"].map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${i === 0
                      ? "bg-[#D73D32] text-white shadow-md shadow-[#D73D32]/25"
                      : "text-[#bbb]"
                    }`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${i === 0 ? "bg-white/20" : "bg-[#eee] text-[#bbb]"
                      }`}>{i + 1}</span>
                    {s}
                  </div>
                  {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-[#ddd]" />}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D73D32]">
              <Shield className="w-3.5 h-3.5" />
              Secure Checkout
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 items-start">

          {/* LEFT */}
          <div>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[10px] font-extrabold text-[#D73D32] uppercase tracking-[0.18em] mb-1">Step 1 of 3</p>
                <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Delivery Address</h1>
                <p className="text-sm text-[#aaa] mt-0.5 font-medium">
                  {savedAddresses.length > 0
                    ? `${savedAddresses.length} saved address${savedAddresses.length !== 1 ? "es" : ""} — pick one`
                    : "Add your first delivery address"}
                </p>
              </div>
              {savedAddresses.length > 0 && (
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 bg-white border-2 border-[#D73D32]/35 hover:border-[#D73D32] hover:bg-[#D73D32]/5 text-[#D73D32] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Address
                </button>
              )}
            </div>

            <AddressList {...sharedProps} />
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24">
            <PaymentPanel selectedAddress={selectedAddress} onContinue={handleContinue} />
          </div>
        </div>
      </div>
    </>
  );
}