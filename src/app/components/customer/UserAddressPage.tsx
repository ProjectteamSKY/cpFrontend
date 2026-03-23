// import React, { useState } from "react";
// import AdvancedAddressPicker from "./AddressPicker";

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   house: string;
//   landmark: string;
// }

// export default function AddressPage() {
//   const [address, setAddress] = useState<Address | null>(null);
//   const [saved, setSaved] = useState(false);

//   const handleSaveAddress = () => {
//     if (address && address.house && address.street && address.city) {
//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//       console.log("Address saved:", address);
//     } else {
//       alert("Please fill in all required fields (House, Street, City)");
//     }
//   };

//   const isAddressComplete = address && address.house && address.street && address.city;

//   return (
//     <div style={{ 
//       minHeight: '100vh',
//       background: 'linear-gradient(to bottom, #f9fafb 0%, #e5e7eb 100%)',
//       padding: '20px'
//     }}>
//       <div style={{ 
//         maxWidth: 900, 
//         margin: "auto",
//         paddingBottom: '40px'
//       }}>
        
//         <AdvancedAddressPicker onAddressChange={setAddress} />

//         {/* Address Preview Card */}
//         {address && (
//           <div style={{
//             marginTop: '24px',
//             background: 'white',
//             padding: '24px',
//             borderRadius: '16px',
//             border: '2px solid #e5e7eb',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
//           }}>
//             <h3 style={{ 
//               margin: '0 0 16px 0',
//               fontSize: '18px',
//               fontWeight: '600',
//               color: '#111827',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}>
//               👁️ Address Preview
//             </h3>
            
//             <div style={{
//               background: '#f9fafb',
//               padding: '16px',
//               borderRadius: '10px',
//               marginBottom: '16px',
//               fontSize: '14px',
//               lineHeight: '1.8',
//               color: '#374151'
//             }}>
//               {address.house && <div><strong>🏠 House:</strong> {address.house}</div>}
//               {address.street && <div><strong>🛣️ Street:</strong> {address.street}</div>}
//               {address.landmark && <div><strong>🏪 Landmark:</strong> {address.landmark}</div>}
//               {address.city && <div><strong>🏙️ City:</strong> {address.city}</div>}
//               {address.state && <div><strong>📍 State:</strong> {address.state}</div>}
//               {address.postal_code && <div><strong>📮 Pincode:</strong> {address.postal_code}</div>}
//             </div>

//             <button
//               onClick={handleSaveAddress}
//               disabled={!isAddressComplete}
//               style={{
//                 width: '100%',
//                 padding: '14px 20px',
//                 background: isAddressComplete 
//                   ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//                   : '#d1d5db',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 cursor: isAddressComplete ? 'pointer' : 'not-allowed',
//                 boxShadow: isAddressComplete ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
//                 transition: 'all 0.2s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px'
//               }}
//               onMouseEnter={(e) => {
//                 if (isAddressComplete) {
//                   e.currentTarget.style.transform = 'translateY(-2px)';
//                   e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = isAddressComplete 
//                   ? '0 4px 12px rgba(16, 185, 129, 0.4)' 
//                   : 'none';
//               }}
//             >
//               {saved ? '✅ Address Saved!' : '💾 Save Address'}
//             </button>

//             {!isAddressComplete && (
//               <p style={{
//                 marginTop: '12px',
//                 fontSize: '13px',
//                 color: '#ef4444',
//                 textAlign: 'center'
//               }}>
//                 ⚠️ Please fill House, Street, and City to save
//               </p>
//             )}
//           </div>
//         )}

//         {/* JSON Debug View (Optional) */}
//         {address && (
//           <details style={{
//             marginTop: '20px',
//             background: 'white',
//             padding: '16px',
//             borderRadius: '12px',
//             border: '1px solid #e5e7eb'
//           }}>
//             <summary style={{
//               cursor: 'pointer',
//               fontWeight: '600',
//               color: '#6b7280',
//               fontSize: '14px'
//             }}>
//               🔧 View JSON Data (Developer Mode)
//             </summary>
//             <pre style={{
//               marginTop: 12,
//               background: '#1f2937',
//               color: '#10b981',
//               padding: 16,
//               borderRadius: 8,
//               fontSize: 13,
//               overflow: 'auto',
//               fontFamily: 'monospace'
//             }}>
//               {JSON.stringify(address, null, 2)}
//             </pre>
//           </details>
//         )}

//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import AdvancedAddressPicker from "./AddressPicker";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Phone,
    Home,
    MapPin,
    Map,
    Building2,
    Hash,
    Smartphone,
    Tag,
    CheckCircle2,
    AlertCircle,
    Save,
    ChevronDown,
    Code2
} from "lucide-react";

interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    house: string;
    landmark: string;
    formatted_address: string;
    name: string;
    mobile: string;
    alternate_mobile: string;
    address_type: string;
}

const FIELD_CONFIG = [
    { key: "name",             label: "Full Name",         icon: User,        show: (a: Address) => !!a.name },
    { key: "mobile",           label: "Mobile",            icon: Phone,       show: (a: Address) => !!a.mobile },
    { key: "house",            label: "House / Flat",      icon: Home,        show: (a: Address) => !!a.house },
    { key: "street",           label: "Street / Area",     icon: Map,         show: (a: Address) => !!a.street },
    { key: "landmark",         label: "Landmark",          icon: Building2,   show: (a: Address) => !!a.landmark },
    { key: "city",             label: "City",              icon: MapPin,      show: (a: Address) => !!a.city },
    { key: "state",            label: "State",             icon: MapPin,      show: (a: Address) => !!a.state },
    { key: "postal_code",      label: "Pincode",           icon: Hash,        show: (a: Address) => !!a.postal_code },
    { key: "alternate_mobile", label: "Alternate Mobile",  icon: Smartphone,  show: (a: Address) => !!a.alternate_mobile },
    { key: "address_type",     label: "Address Type",      icon: Tag,         show: (a: Address) => !!a.address_type,
      format: (v: string) => v === "home" ? "Home" : "Work" },
];

const REQUIRED_FIELDS: (keyof Address)[] = [
    "name", "mobile", "house", "street", "city", "state", "postal_code"
];

const MISSING_LABELS: Record<string, string> = {
    name: "Full Name",
    mobile: "Mobile Number",
    house: "House / Flat No.",
    street: "Street / Area",
    city: "City",
    state: "State",
    postal_code: "Pincode",
};

export default function userAddressPage() {
    const [address, setAddress] = useState<Address | null>(null);
    const [saved, setSaved]     = useState(false);
    const [showJson, setShowJson] = useState(false);

    const isComplete = address &&
        REQUIRED_FIELDS.every(f => !!address[f]) &&
        address.mobile.length === 10;

    const missingFields = address
        ? [
            ...REQUIRED_FIELDS.filter(f => !address[f]).map(f => MISSING_LABELS[f]),
            ...(address.mobile && address.mobile.length !== 10 ? ["Valid 10-digit Mobile"] : []),
          ]
        : [];

    const handleSave = () => {
        if (!isComplete) return;
        setSaved(true);
        console.log("Address saved:", address);
        setTimeout(() => setSaved(false), 3000);
        // await saveAddressToBackend(address);
    };

    return (
        <div
            className="min-h-screen bg-[#fdfaf7]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');

                .addr-card {
                    background: #ffffff;
                    border: 1px solid #f0e8e2;
                    border-radius: 22px;
                    box-shadow: 0 2px 16px rgba(180,100,80,0.06);
                }

                .preview-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 0;
                    border-bottom: 1px solid #f5ece7;
                }
                .preview-row:last-child {
                    border-bottom: none;
                }

                .preview-icon-wrap {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    background: #fff5f3;
                    border: 1px solid #f0dcd6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .save-btn {
                    width: 100%;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 14px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.25s ease;
                    letter-spacing: 0.01em;
                }
                .save-btn.ready {
                    background: linear-gradient(135deg, #D73D32 0%, #c0342a 100%);
                    color: white;
                    box-shadow: 0 6px 20px rgba(215,61,50,0.3);
                }
                .save-btn.ready:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(215,61,50,0.4);
                }
                .save-btn.saved {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    box-shadow: 0 6px 20px rgba(16,185,129,0.3);
                }
                .save-btn.disabled {
                    background: #f5ece8;
                    color: #c5a8a0;
                    cursor: not-allowed;
                }

                .missing-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #fff5f3;
                    border: 1px solid #f0dcd6;
                    color: #c84b3f;
                    border-radius: 999px;
                    padding: 3px 10px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .section-rule {
                    border: none;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #f0e4e0 20%, #f0e4e0 80%, transparent);
                }

                .json-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #fffaf9;
                    border: 1px solid #f0e8e2;
                    border-radius: 12px;
                    padding: 10px 16px;
                    width: 100%;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    color: #9c7070;
                    transition: all 0.2s ease;
                    text-align: left;
                }
                .json-toggle:hover {
                    border-color: #D73D32;
                    color: #D73D32;
                    background: #fff5f4;
                }

                .type-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: #fff5f3;
                    border: 1px solid #f0dcd6;
                    color: #D73D32;
                    border-radius: 999px;
                    padding: 2px 10px;
                    font-size: 12px;
                    font-weight: 600;
                }
            `}</style>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16 space-y-6">

                {/* ─── Page Heading ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-end justify-between mb-1">
                        <h1
                            className="text-4xl text-gray-900"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                        >
                            Add Address
                        </h1>
                        <span className="text-xs text-[#b89090] mb-1 tracking-widest uppercase">
                            Delivery Details
                        </span>
                    </div>
                    <hr className="section-rule" />
                </motion.div>

                {/* ─── Map Picker ────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="addr-card overflow-hidden"
                >
                    {/* Accent bar */}
                    <div
                        className="h-1"
                        style={{ background: "linear-gradient(90deg, #D73D32 0%, #ff7a6e 60%, #ffd4cf 100%)" }}
                    />
                    <div className="p-1">
                        <AdvancedAddressPicker
                            onAddressChange={setAddress}
                            googleMapsApiKey={"AIzaSyC-CHpzjed9UVTw0bEzWpm0vN1vgQXU4h0"}
                        />
                    </div>
                </motion.div>

                {/* ─── Address Preview + Save ─────────────────────────────────── */}
                <AnimatePresence>
                    {address && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="addr-card overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#fff5f3] border border-[#f0dcd6] flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-[#D73D32]" />
                                    </div>
                                    <h3
                                        className="text-xl text-gray-800"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                                    >
                                        Address Preview
                                    </h3>
                                </div>

                                {/* Complete / incomplete indicator */}
                                {isComplete ? (
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#c84b3f] bg-[#fff5f3] border border-[#f0dcd6] px-2.5 py-1 rounded-full">
                                        <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                                    </span>
                                )}
                            </div>

                            <div className="px-6 pb-4">
                                {/* Field rows */}
                                <div className="bg-[#fffaf9] border border-[#f5ece7] rounded-2xl px-4 py-2 mb-5">
                                    {FIELD_CONFIG.filter(f => f.show(address)).map((field, i) => {
                                        const rawVal = (address as any)[field.key] as string;
                                        const val    = field.format ? field.format(rawVal) : rawVal;
                                        const Icon   = field.icon;
                                        return (
                                            <motion.div
                                                key={field.key}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="preview-row"
                                            >
                                                <div className="preview-icon-wrap">
                                                    <Icon className="w-3.5 h-3.5 text-[#D73D32]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] text-[#b89090] uppercase tracking-wider mb-0.5">
                                                        {field.label}
                                                    </p>
                                                    {field.key === "address_type" ? (
                                                        <span className="type-badge">
                                                            <Tag className="w-3 h-3" />
                                                            {val}
                                                        </span>
                                                    ) : (
                                                        <p className="text-sm font-medium text-gray-700 break-words">{val}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Missing fields warning */}
                                <AnimatePresence>
                                    {missingFields.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-5 overflow-hidden"
                                        >
                                            <div className="flex items-start gap-2 mb-3">
                                                <AlertCircle className="w-4 h-4 text-[#c84b3f] flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-[#c84b3f] font-semibold uppercase tracking-wider">
                                                    Required fields missing
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {missingFields.map(f => (
                                                    <span key={f} className="missing-chip">
                                                        · {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Save button */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    disabled={!isComplete}
                                    className={`save-btn ${saved ? "saved" : isComplete ? "ready" : "disabled"}`}
                                >
                                    {saved ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Address Saved Successfully
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Address
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── JSON Debug (collapsible) ───────────────────────────────── */}
                <AnimatePresence>
                    {address && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.15, duration: 0.3 }}
                        >
                            <button
                                onClick={() => setShowJson(v => !v)}
                                className="json-toggle"
                            >
                                <Code2 className="w-4 h-4" />
                                Developer JSON Data
                                <ChevronDown
                                    className="w-4 h-4 ml-auto transition-transform"
                                    style={{ transform: showJson ? "rotate(180deg)" : "rotate(0deg)" }}
                                />
                            </button>

                            <AnimatePresence>
                                {showJson && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div className="mt-2 rounded-2xl overflow-hidden border border-[#1f2937]">
                                            <div className="bg-[#1f2937] px-4 py-2 flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                                <span className="text-xs text-gray-500 ml-2 font-mono">address.json</span>
                                            </div>
                                            <pre
                                                style={{
                                                    margin: 0,
                                                    background: "#111827",
                                                    color: "#6ee7b7",
                                                    padding: "16px 20px",
                                                    fontSize: 13,
                                                    overflow: "auto",
                                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                                    lineHeight: 1.7,
                                                    maxHeight: 320,
                                                }}
                                            >
                                                {JSON.stringify(address, null, 2)}
                                            </pre>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}