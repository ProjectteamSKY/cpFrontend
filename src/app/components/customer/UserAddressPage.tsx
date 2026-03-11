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

export default function AddressPage() {
    const [address, setAddress] = useState<Address | null>(null);
    const [saved, setSaved] = useState(false);

    const handleSaveAddress = () => {
        if (address && 
            address.name && 
            address.mobile && 
            address.house && 
            address.street && 
            address.city && 
            address.state && 
            address.postal_code) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            console.log("Address saved:", address);
            
            // Here you can add API call to save address to backend
            // Example: await saveAddressToBackend(address);
        } else {
            alert("Please fill in all required fields:\n- Name\n- Mobile Number\n- House/Flat No.\n- Street/Area\n- City\n- State\n- Pincode");
        }
    };

    const isAddressComplete = address && 
        address.name && 
        address.mobile && 
        address.house && 
        address.street && 
        address.city && 
        address.state && 
        address.postal_code &&
        address.mobile.length === 10;

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #f9fafb 0%, #e5e7eb 100%)',
            padding: '20px'
        }}>
            <div style={{ 
                maxWidth: 900, 
                margin: "auto",
                paddingBottom: '40px'
            }}>
                
                {/* Replace with your actual Google Maps API key */}
                <AdvancedAddressPicker 
                    onAddressChange={setAddress} 
                    googleMapsApiKey={"AIzaSyC-CHpzjed9UVTw0bEzWpm0vN1vgQXU4h0"} 
                />

                {/* Address Preview Card */}
                {address && (
                    <div style={{
                        marginTop: '24px',
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '2px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                        <h3 style={{ 
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            👁️ Address Preview
                        </h3>
                        
                        <div style={{
                            background: '#f9fafb',
                            padding: '16px',
                            borderRadius: '10px',
                            marginBottom: '16px',
                            fontSize: '14px',
                            lineHeight: '1.8',
                            color: '#374151'
                        }}>
                            {address.name && <div><strong>👤 Name:</strong> {address.name}</div>}
                            {address.mobile && <div><strong>📱 Mobile:</strong> {address.mobile}</div>}
                            {address.house && <div><strong>🏠 House/Flat:</strong> {address.house}</div>}
                            {address.street && <div><strong>🛣️ Street/Area:</strong> {address.street}</div>}
                            {address.landmark && <div><strong>🏪 Landmark:</strong> {address.landmark}</div>}
                            {address.city && <div><strong>🏙️ City:</strong> {address.city}</div>}
                            {address.state && <div><strong>📍 State:</strong> {address.state}</div>}
                            {address.postal_code && <div><strong>📮 Pincode:</strong> {address.postal_code}</div>}
                            {address.alternate_mobile && <div><strong>☎️ Alternate Phone:</strong> {address.alternate_mobile}</div>}
                            {address.address_type && (
                                <div>
                                    <strong>🏷️ Type:</strong> {address.address_type === 'home' ? 'Home' : 'Work'}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSaveAddress}
                            disabled={!isAddressComplete}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                background: isAddressComplete 
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : '#d1d5db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isAddressComplete ? 'pointer' : 'not-allowed',
                                boxShadow: isAddressComplete ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (isAddressComplete) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isAddressComplete 
                                    ? '0 4px 12px rgba(16, 185, 129, 0.4)' 
                                    : 'none';
                            }}
                        >
                            {saved ? '✅ Address Saved Successfully!' : '💾 Save Address'}
                        </button>

                        {!isAddressComplete && (
                            <div style={{
                                marginTop: '12px',
                                fontSize: '13px',
                                color: '#ef4444',
                                textAlign: 'center',
                                lineHeight: '1.6'
                            }}>
                                ⚠️ Please complete all required fields:
                                {!address.name && <div>• Name</div>}
                                {!address.mobile && <div>• Mobile Number</div>}
                                {address.mobile && address.mobile.length !== 10 && <div>• Valid 10-digit Mobile</div>}
                                {!address.house && <div>• House/Flat Number</div>}
                                {!address.street && <div>• Street/Area</div>}
                                {!address.city && <div>• City</div>}
                                {!address.state && <div>• State</div>}
                                {!address.postal_code && <div>• Pincode</div>}
                            </div>
                        )}
                    </div>
                )}

                {/* JSON Debug View (Optional) */}
                {address && (
                    <details style={{
                        marginTop: '20px',
                        background: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <summary style={{
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>
                            🔧 View JSON Data (Developer Mode)
                        </summary>
                        <pre style={{
                            marginTop: 12,
                            background: '#1f2937',
                            color: '#10b981',
                            padding: 16,
                            borderRadius: 8,
                            fontSize: 13,
                            overflow: 'auto',
                            fontFamily: 'monospace'
                        }}>
                            {JSON.stringify(address, null, 2)}
                        </pre>
                    </details>
                )}

            </div>
        </div>
    );
}