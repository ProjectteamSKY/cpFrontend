// import React, { useEffect, useState } from "react";
// import {
//     MapContainer,
//     TileLayer,
//     Marker,
//     Popup,
//     useMapEvents,
//     useMap,
//     Circle
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// interface Address {
//     street: string;
//     city: string;
//     state: string;
//     postal_code: string;
//     house: string;
//     landmark: string;
// }

// interface NearbyPlace {
//     id: number;
//     name: string;
//     type: string;
//     lat: number;
//     lon: number;
//     distance: number;
// }

// interface Props {
//     onAddressChange: (address: Address) => void;
// }

// /* Fix marker icon */
// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
// });

// // IP Geolocation Function
// const fetchIPLocation = async (): Promise<{
//     lat: number;
//     lng: number;
//     city: string;
//     region: string;
//     country: string;
//     postal: string;
// }> => {
//     try {
//         // Primary: ipapi.co (free, reliable, 1000 req/day)
//         const res = await fetch('https://ipapi.co/json/', {
//             headers: { 'User-Agent': 'AddressPickerApp/1.0' }
//         });
//         const data = await res.json();

//         if (data.lat && data.lng && data.success !== false) {
//             return {
//                 lat: data.lat,
//                 lng: data.lon || data.lng,
//                 city: data.city || "",
//                 region: data.region || data.region_name || "",
//                 country: data.country_name || "",
//                 postal: data.postal || ""
//             };
//         }
//     } catch (err) {
//         console.log("ipapi.co failed, trying fallback:", err);
//     }

//     // Fallback 1: ipinfo.io
//     try {
//         const res = await fetch('https://ipinfo.io/json', {
//             headers: { 'User-Agent': 'AddressPickerApp/1.0' }
//         });
//         const data = await JSON.parse((await res.text()).replace(/'/g, '"'));
//         if (data.loc) {
//             const [lat, lng] = data.loc.split(',');
//             return {
//                 lat: parseFloat(lat),
//                 lng: parseFloat(lng),
//                 city: data.city || "",
//                 region: data.region || "",
//                 country: data.country || "",
//                 postal: data.postal || ""
//             };
//         }
//     } catch (err) {
//         console.log("ipinfo.io failed:", err);
//     }

//     // Fallback 2: Dindigul default (your location)
//     return {
//         lat: 10.3654,
//         lng: 77.9757,
//         city: "Dindigul",
//         region: "Tamil Nadu",
//         country: "India",
//         postal: "624001"
//     };
// };

// // Custom icons for different place types
// const createCustomIcon = (color: string, emoji: string) => {
//     return L.divIcon({
//         className: 'custom-icon',
//         html: `
//       <div style="
//         background: ${color};
//         width: 28px;
//         height: 28px;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         border: 2px solid white;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.25);
//         font-size: 14px;
//       ">${emoji}</div>
//     `,
//         iconSize: [28, 28],
//         iconAnchor: [14, 14]
//     });
// };

// export default function AdvancedAddressPicker({ onAddressChange }: Props) {
//     const [position, setPosition] = useState<[number, number]>([10.3654, 77.9757]);
//     const [suggestions, setSuggestions] = useState<any[]>([]);
//     const [search, setSearch] = useState("");
//     const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedRadius, setSelectedRadius] = useState(500);
//     const [isDragging, setIsDragging] = useState(false);
//     const [showPlacesList, setShowPlacesList] = useState(true);

//     const [address, setAddress] = useState<Address>({
//         street: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         house: "",
//         landmark: ""
//     });

//     /* Fetch nearby shops and malls */
//     const fetchNearbyPlaces = async (lat: number, lon: number, radius: number) => {
//         try {
//             const query = `
//         [out:json][timeout:25];
//         (
//           node["shop"](around:${radius},${lat},${lon});
//           way["shop"](around:${radius},${lat},${lon});
//           node["amenity"="marketplace"](around:${radius},${lat},${lon});
//           way["amenity"="marketplace"](around:${radius},${lat},${lon});
//           node["building"="commercial"](around:${radius},${lat},${lon});
//           way["building"="commercial"](around:${radius},${lat},${lon});
//           node["building"="retail"](around:${radius},${lat},${lon});
//           way["building"="retail"](around:${radius},${lat},${lon});
//           node["amenity"="fuel"](around:${radius},${lat},${lon});
//           node["amenity"="restaurant"](around:${radius},${lat},${lon});
//           node["amenity"="cafe"](around:${radius},${lat},${lon});
//           node["amenity"="bank"](around:${radius},${lat},${lon});
//           node["amenity"="pharmacy"](around:${radius},${lat},${lon});
//         );
//         out body;
//         >;
//         out skel qt;
//       `;

//             const res = await fetch(
//                 `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
//             );

//             const data = await res.json();

//             if (data.elements) {
//                 const places: NearbyPlace[] = data.elements
//                     .filter((el: any) => el.tags?.name && (el.lat || el.center))
//                     .map((el: any, idx: number) => {
//                         const placeLat = el.lat || el.center?.lat;
//                         const placeLon = el.lon || el.center?.lon;
//                         const distance = calculateDistance(lat, lon, placeLat, placeLon);

//                         let type = "shop";
//                         if (el.tags.amenity === "marketplace") type = "mall";
//                         else if (el.tags.building === "commercial" || el.tags.building === "retail") type = "mall";
//                         else if (el.tags.amenity === "fuel") type = "fuel";
//                         else if (el.tags.amenity === "restaurant" || el.tags.amenity === "cafe") type = "food";
//                         else if (el.tags.amenity === "bank") type = "bank";
//                         else if (el.tags.amenity === "pharmacy") type = "pharmacy";
//                         else if (el.tags.shop) type = el.tags.shop;

//                         return {
//                             id: idx,
//                             name: el.tags.name,
//                             type: type,
//                             lat: placeLat,
//                             lon: placeLon,
//                             distance: distance
//                         };
//                     })
//                     .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
//                     .slice(0, 25);

//                 console.log("Found nearby places:", places.length);
//                 setNearbyPlaces(places);
//             }
//         } catch (err) {
//             console.log("Error fetching nearby places:", err);
//         }
//     };

//     const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//         const R = 6371e3;
//         const φ1 = (lat1 * Math.PI) / 180;
//         const φ2 = (lat2 * Math.PI) / 180;
//         const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//         const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//         const a =
//             Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//             Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//         return Math.round(R * c);
//     };

//     /* Reverse geocode */
//     const fetchAddress = async (lat: number, lon: number) => {
//         console.log("Fetching address for:", lat, lon);
//         setLoading(true);

//         try {
//             // 1️⃣ Reverse Geocode
//             const geoRes = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`,
//                 {
//                     headers: {
//                         "User-Agent": "AddressPickerApp/1.0"
//                     }
//                 }
//             );

//             if (!geoRes.ok) {
//                 console.error("Geocode failed");
//                 setLoading(false);
//                 return;
//             }

//             const geoData = await geoRes.json();
//             const addr = geoData.address || {};

//             const area =
//                 addr.suburb ||
//                 addr.neighbourhood ||
//                 addr.hamlet ||
//                 addr.village ||
//                 addr.road ||
//                 "";

//             const city =
//                 addr.city ||
//                 addr.town ||
//                 addr.municipality ||
//                 addr.village ||
//                 addr.county ||
//                 "";

//             const state = addr.state || "";
//             const postal = addr.postcode || "";

//             // 2️⃣ Fetch Nearby POI
//             const query = `
//       [out:json][timeout:25];
//       (
//         node["shop"](around:500,${lat},${lon});
//         node["amenity"="restaurant"](around:500,${lat},${lon});
//         node["amenity"="cafe"](around:500,${lat},${lon});
//         node["amenity"="bank"](around:500,${lat},${lon});
//         node["amenity"="pharmacy"](around:500,${lat},${lon});
//         node["amenity"="fuel"](around:500,${lat},${lon});
//       );
//       out body;
//     `;

//             const poiRes = await fetch(
//                 `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
//             );

//             const poiData = await poiRes.json();

//             let nearestPOI = "";

//             if (poiData.elements && poiData.elements.length > 0) {
//                 const places = poiData.elements
//                     .filter((el: any) => el.tags?.name)
//                     .map((el: any) => ({
//                         name: el.tags.name,
//                         lat: el.lat,
//                         lon: el.lon,
//                         distance: Math.sqrt(
//                             Math.pow(lat - el.lat, 2) + Math.pow(lon - el.lon, 2)
//                         )
//                     }))
//                     .sort((a: any, b: any) => a.distance - b.distance);

//                 nearestPOI = places[0]?.name || "";
//             }

//             // 3️⃣ Flipkart-style street
//             let streetName = area;

//             if (nearestPOI) {
//                 streetName = `${nearestPOI}, ${area}`;
//             }

//             const newAddress: Address = {
//                 house: address.house,
//                 landmark: address.landmark,
//                 street: streetName,
//                 city: city,
//                 state: state,
//                 postal_code: postal
//             };

//             console.log("Flipkart style address:", newAddress);

//             setAddress(newAddress);
//             onAddressChange(newAddress);

//         } catch (err) {
//             console.error("Address fetch error:", err);
//         }

//         setLoading(false);
//     };

//     /* Search address */
//     const searchLocation = async (query: string) => {
//         setSearch(query);
//         if (query.length < 3) {
//             setSuggestions([]);
//             return;
//         }

//         const res = await fetch(
//             `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`
//         );

//         const data = await res.json();
//         setSuggestions(data);
//     };

//     const selectSuggestion = (item: any) => {
//         const lat = parseFloat(item.lat);
//         const lon = parseFloat(item.lon);

//         setPosition([lat, lon]);
//         setSuggestions([]);
//         setSearch(item.display_name);

//         fetchAddress(lat, lon);
//     };

//     /* GPS detect (fallback) */
//     const detectLocation = async () => {

//         setLoading(true);

//         if (!navigator.geolocation) {
//             console.log("Geolocation not supported → using IP");
//             const ipLocation = await fetchIPLocation();
//             setPosition([ipLocation.lat, ipLocation.lng]);
//             await fetchAddress(ipLocation.lat, ipLocation.lng);
//             setLoading(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             async (pos) => {

//                 const lat = pos.coords.latitude;
//                 const lon = pos.coords.longitude;
//                 const accuracy = pos.coords.accuracy;

//                 console.log("GPS location:", lat, lon);
//                 console.log("Accuracy:", accuracy, "meters");

//                 /* If accuracy is good */
//                 if (accuracy <= 50) {

//                     setPosition([lat, lon]);
//                     await fetchAddress(lat, lon);
//                     setLoading(false);
//                     return;

//                 }

//                 /* Accuracy bad → try again */
//                 console.log("Low GPS accuracy, retrying...");

//                 navigator.geolocation.getCurrentPosition(
//                     async (pos2) => {

//                         const lat2 = pos2.coords.latitude;
//                         const lon2 = pos2.coords.longitude;

//                         setPosition([lat2, lon2]);
//                         await fetchAddress(lat2, lon2);
//                         setLoading(false);

//                     },
//                     async () => {

//                         console.log("GPS retry failed → using IP");

//                         const ipLocation = await fetchIPLocation();
//                         setPosition([ipLocation.lat, ipLocation.lng]);
//                         await fetchAddress(ipLocation.lat, ipLocation.lng);
//                         setLoading(false);

//                     },
//                     {
//                         enableHighAccuracy: true,
//                         timeout: 15000,
//                         maximumAge: 0
//                     }
//                 );

//             },
//             async (err) => {

//                 console.log("GPS failed → using IP location");

//                 const ipLocation = await fetchIPLocation();

//                 setPosition([ipLocation.lat, ipLocation.lng]);

//                 await fetchAddress(ipLocation.lat, ipLocation.lng);

//                 setLoading(false);

//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 15000,
//                 maximumAge: 0
//             }
//         );
//     };

//     const selectNearbyPlace = (place: NearbyPlace) => {
//         setPosition([place.lat, place.lon]);
//         const newAddr = { ...address, landmark: place.name };
//         setAddress(newAddr);
//         onAddressChange(newAddr);
//     };

//     // 🔥 IP-BASED AUTO-DETECTION ON LOAD
//     useEffect(() => {
//         const autoDetectIPLocation = async () => {
//             setLoading(true);
//             try {
//                 console.log("🔍 Detecting IP location...");
//                 const ipLocation = await fetchIPLocation();

//                 console.log("IP Location detected:", ipLocation);
//                 setPosition([ipLocation.lat, ipLocation.lng]);

//                 // Pre-fill address from IP data
//                 const initialAddress: Address = {
//                     house: "",
//                     street: "",
//                     landmark: "",
//                     city: ipLocation.city,
//                     state: ipLocation.region,
//                     postal_code: ipLocation.postal
//                 };

//                 setAddress(initialAddress);
//                 onAddressChange(initialAddress);

//                 // Fetch detailed reverse geocoding
//                 await fetchAddress(ipLocation.lat, ipLocation.lng);

//             } catch (err) {
//                 console.log("Auto-detection failed:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         autoDetectIPLocation();
//     }, []);

//     /* Draggable marker */
//     function DraggableMarker() {
//         const map = useMap();

//         useEffect(() => {
//             map.setView(position, 17);
//         }, [position]);

//         const markerRef = React.useRef<any>(null);

//         useMapEvents({
//             click(e) {
//                 const lat = e.latlng.lat;
//                 const lng = e.latlng.lng;
//                 setPosition([lat, lng]);
//                 fetchAddress(lat, lng);
//             }
//         });

//         const handleDragEnd = () => {
//             const marker = markerRef.current;
//             if (marker != null) {
//                 const pos = marker.getLatLng();
//                 const lat = pos.lat;
//                 const lng = pos.lng;

//                 console.log("Drag ended at:", lat, lng);

//                 setPosition([lat, lng]);
//                 setIsDragging(false);

//                 setTimeout(() => {
//                     fetchAddress(lat, lng);
//                 }, 100);
//             }
//         };

//         return (
//             <>
//                 <Circle
//                     center={position}
//                     radius={selectedRadius}
//                     pathOptions={{
//                         color: '#3b82f6',
//                         fillColor: '#3b82f6',
//                         fillOpacity: 0.1,
//                         weight: 2,
//                         dashArray: '5, 5'
//                     }}
//                 />
//                 <Marker
//                     draggable={true}
//                     position={position}
//                     ref={markerRef}
//                     eventHandlers={{
//                         dragstart: () => {
//                             console.log("Drag started");
//                             setIsDragging(true);
//                         },
//                         drag: (e) => {
//                             const newPos = e.target.getLatLng();
//                             setPosition([newPos.lat, newPos.lng]);
//                         },
//                         dragend: handleDragEnd
//                     }}
//                 >
//                     <Popup>
//                         <div style={{ textAlign: 'center', fontWeight: '500' }}>
//                             📍 Your delivery location
//                             <br />
//                             <small style={{ color: '#666' }}>Drag to adjust</small>
//                         </div>
//                     </Popup>
//                 </Marker>
//             </>
//         );
//     }

//     const getPlaceIcon = (type: string) => {
//         if (type === "mall" || type === "commercial" || type === "retail")
//             return { emoji: "🏬", color: "#8b5cf6", label: "Mall" };
//         if (type === "supermarket") return { emoji: "🛒", color: "#10b981", label: "Supermarket" };
//         if (type === "fuel") return { emoji: "⛽", color: "#f59e0b", label: "Fuel Station" };
//         if (type === "food" || type === "restaurant" || type === "cafe")
//             return { emoji: "🍽️", color: "#ef4444", label: "Restaurant" };
//         if (type === "bank") return { emoji: "🏦", color: "#06b6d4", label: "Bank" };
//         if (type === "pharmacy") return { emoji: "💊", color: "#ec4899", label: "Pharmacy" };
//         return { emoji: "🏪", color: "#3b82f6", label: "Shop" };
//     };

//     return (
//         <div style={{
//             width: "100%",
//             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//         }}>

//             {/* Header Section */}
//             <div style={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 padding: '24px',
//                 borderRadius: '16px 16px 0 0',
//                 color: 'white',
//                 marginBottom: '20px'
//             }}>
//                 <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
//                     📍 Select Delivery Address
//                 </h2>
//                 <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
//                     Auto-detected from your IP 📡 | Drag pin or search for precision
//                 </p>
//             </div>

//             {/* Search & Controls */}
//             <div style={{ marginBottom: '20px' }}>
//                 <div style={{ position: 'relative', marginBottom: '12px' }}>
//                     <input
//                         value={search}
//                         onChange={(e) => searchLocation(e.target.value)}
//                         placeholder="🔍 Search for your address or area..."
//                         style={{
//                             width: '100%',
//                             padding: '14px 16px',
//                             border: '2px solid #e5e7eb',
//                             borderRadius: '12px',
//                             fontSize: '15px',
//                             outline: 'none',
//                             transition: 'all 0.2s',
//                             boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                     />

//                     {suggestions.length > 0 && (
//                         <div
//                             style={{
//                                 position: 'absolute',
//                                 top: '100%',
//                                 left: 0,
//                                 right: 0,
//                                 background: "white",
//                                 border: "2px solid #e5e7eb",
//                                 borderRadius: '12px',
//                                 marginTop: '8px',
//                                 maxHeight: 250,
//                                 overflowY: "auto",
//                                 zIndex: 1000,
//                                 boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
//                             }}
//                         >
//                             {suggestions.map((s, i) => (
//                                 <div
//                                     key={i}
//                                     onClick={() => selectSuggestion(s)}
//                                     style={{
//                                         padding: 14,
//                                         cursor: "pointer",
//                                         borderBottom: i < suggestions.length - 1 ? "1px solid #f3f4f6" : "none",
//                                         transition: 'background 0.15s'
//                                     }}
//                                     onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
//                                     onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
//                                 >
//                                     <div style={{ fontSize: '14px', color: '#111827' }}>
//                                         {s.display_name}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div style={{ display: "flex", gap: 10, flexWrap: 'wrap' }}>
//                     <button
//                         onClick={detectLocation}
//                         disabled={loading}
//                         style={{
//                             padding: "12px 20px",
//                             background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                             color: "white",
//                             border: "none",
//                             borderRadius: 10,
//                             cursor: loading ? "not-allowed" : "pointer",
//                             fontWeight: '600',
//                             fontSize: '14px',
//                             boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
//                             transition: 'all 0.2s',
//                             flex: '1',
//                             minWidth: '160px'
//                         }}
//                         onMouseEnter={(e) => {
//                             if (!loading) {
//                                 e.currentTarget.style.transform = 'translateY(-2px)';
//                                 e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
//                             }
//                         }}
//                         onMouseLeave={(e) => {
//                             e.currentTarget.style.transform = 'translateY(0)';
//                             e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
//                         }}
//                     >
//                         {loading ? "⏳ Detecting..." : "📱 Use GPS Location"}
//                     </button>

//                     <select
//                         value={selectedRadius}
//                         onChange={(e) => {
//                             setSelectedRadius(Number(e.target.value));
//                             fetchNearbyPlaces(position[0], position[1], Number(e.target.value));
//                         }}
//                         style={{
//                             padding: "12px 16px",
//                             border: "2px solid #e5e7eb",
//                             borderRadius: 10,
//                             fontSize: '14px',
//                             fontWeight: '500',
//                             cursor: 'pointer',
//                             outline: 'none',
//                             background: 'white',
//                             flex: '1',
//                             minWidth: '120px'
//                         }}
//                     >
//                         <option value={300}>300m radius</option>
//                         <option value={500}>500m radius</option>
//                         <option value={1000}>1km radius</option>
//                         <option value={2000}>2km radius</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Dragging Indicator */}
//             {isDragging && (
//                 <div style={{
//                     background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//                     color: 'white',
//                     padding: '12px',
//                     borderRadius: '10px',
//                     marginBottom: '12px',
//                     textAlign: 'center',
//                     fontWeight: '600',
//                     animation: 'pulse 1.5s infinite',
//                     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
//                 }}>
//                     🎯 Dragging pin... Release to get address
//                 </div>
//             )}

//             {/* Loading Indicator */}
//             {loading && !isDragging && (
//                 <div style={{
//                     background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                     color: 'white',
//                     padding: '12px',
//                     borderRadius: '10px',
//                     marginBottom: '12px',
//                     textAlign: 'center',
//                     fontWeight: '600',
//                     animation: 'pulse 1.5s infinite',
//                     boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
//                 }}>
//                     📍 Auto-fetching your address from IP...
//                 </div>
//             )}

//             {/* Map Container */}
//             <div style={{
//                 borderRadius: '16px',
//                 overflow: 'hidden',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
//                 marginBottom: '20px',
//                 border: '3px solid #e5e7eb'
//             }}>
//                 <MapContainer
//                     center={position}
//                     zoom={17}
//                     style={{ height: 450 }}
//                     zoomControl={true}
//                 >
//                     <TileLayer
//                         attribution="© OpenStreetMap contributors"
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />
//                     <DraggableMarker />

//                     {nearbyPlaces.map((place) => {
//                         const placeInfo = getPlaceIcon(place.type);
//                         return (
//                             <Marker
//                                 key={place.id}
//                                 position={[place.lat, place.lon]}
//                                 icon={createCustomIcon(placeInfo.color, placeInfo.emoji)}
//                                 eventHandlers={{
//                                     click: () => selectNearbyPlace(place)
//                                 }}
//                             >
//                                 <Popup>
//                                     <div style={{ minWidth: '180px' }}>
//                                         <div style={{
//                                             fontWeight: '600',
//                                             fontSize: '15px',
//                                             marginBottom: '6px',
//                                             color: '#111827'
//                                         }}>
//                                             {placeInfo.emoji} {place.name}
//                                         </div>
//                                         <div style={{
//                                             fontSize: '13px',
//                                             color: '#6b7280',
//                                             marginBottom: '10px'
//                                         }}>
//                                             {placeInfo.label} • {place.distance}m away
//                                         </div>
//                                         <button
//                                             onClick={() => selectNearbyPlace(place)}
//                                             style={{
//                                                 width: '100%',
//                                                 padding: "8px 12px",
//                                                 background: placeInfo.color,
//                                                 color: "white",
//                                                 border: "none",
//                                                 borderRadius: 6,
//                                                 cursor: "pointer",
//                                                 fontSize: 13,
//                                                 fontWeight: '600'
//                                             }}
//                                         >
//                                             Set as Landmark
//                                         </button>
//                                     </div>
//                                 </Popup>
//                             </Marker>
//                         );
//                     })}
//                 </MapContainer>
//             </div>

//             {/* Nearby Places Section */}
//             {nearbyPlaces.length > 0 && (
//                 <div style={{
//                     marginBottom: '24px',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '16px',
//                     overflow: 'hidden',
//                     background: 'white',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
//                 }}>
//                     <div
//                         onClick={() => setShowPlacesList(!showPlacesList)}
//                         style={{
//                             padding: 16,
//                             background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
//                             fontWeight: "600",
//                             fontSize: '16px',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             userSelect: 'none'
//                         }}
//                     >
//                         <span>🏪 Nearby Shops & Landmarks ({nearbyPlaces.length})</span>
//                         <span style={{ fontSize: '20px' }}>{showPlacesList ? '▼' : '▶'}</span>
//                     </div>

//                     {showPlacesList && (
//                         <div style={{
//                             maxHeight: 280,
//                             overflowY: "auto"
//                         }}>
//                             {nearbyPlaces.map((place, index) => {
//                                 const placeInfo = getPlaceIcon(place.type);
//                                 return (
//                                     <div
//                                         key={place.id}
//                                         onClick={() => selectNearbyPlace(place)}
//                                         style={{
//                                             padding: "14px 16px",
//                                             cursor: "pointer",
//                                             borderBottom: index < nearbyPlaces.length - 1 ? "1px solid #f3f4f6" : "none",
//                                             display: "flex",
//                                             justifyContent: "space-between",
//                                             alignItems: "center",
//                                             transition: 'all 0.15s'
//                                         }}
//                                         onMouseEnter={(e) => {
//                                             e.currentTarget.style.background = "#f9fafb";
//                                             e.currentTarget.style.paddingLeft = "20px";
//                                         }}
//                                         onMouseLeave={(e) => {
//                                             e.currentTarget.style.background = "white";
//                                             e.currentTarget.style.paddingLeft = "16px";
//                                         }}
//                                     >
//                                         <div style={{ flex: 1 }}>
//                                             <div style={{
//                                                 fontWeight: '600',
//                                                 fontSize: '14px',
//                                                 marginBottom: '4px',
//                                                 color: '#111827'
//                                             }}>
//                                                 {placeInfo.emoji} {place.name}
//                                             </div>
//                                             <div style={{
//                                                 fontSize: '12px',
//                                                 color: '#6b7280'
//                                             }}>
//                                                 {placeInfo.label} • {place.distance}m away
//                                             </div>
//                                         </div>
//                                         <button
//                                             style={{
//                                                 padding: "6px 14px",
//                                                 background: placeInfo.color,
//                                                 color: 'white',
//                                                 border: "none",
//                                                 borderRadius: 6,
//                                                 fontSize: 12,
//                                                 fontWeight: '600',
//                                                 cursor: "pointer",
//                                                 transition: 'transform 0.15s'
//                                             }}
//                                             onMouseEnter={(e) => {
//                                                 e.currentTarget.style.transform = 'scale(1.05)';
//                                             }}
//                                             onMouseLeave={(e) => {
//                                                 e.currentTarget.style.transform = 'scale(1)';
//                                             }}
//                                         >
//                                             Select
//                                         </button>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Address Form */}
//             <div style={{
//                 background: 'white',
//                 padding: '24px',
//                 borderRadius: '16px',
//                 border: '2px solid #e5e7eb',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
//             }}>
//                 <h3 style={{
//                     margin: '0 0 20px 0',
//                     fontSize: '18px',
//                     fontWeight: '600',
//                     color: '#111827'
//                 }}>
//                     📝 Complete Your Address
//                 </h3>

//                 <div style={{ display: "grid", gap: 14 }}>
//                     <input
//                         placeholder="🏠 House / Flat / Building number"
//                         value={address.house}
//                         onChange={(e) => {
//                             const newAddr = { ...address, house: e.target.value };
//                             setAddress(newAddr);
//                             onAddressChange(newAddr);
//                         }}
//                         style={{
//                             padding: '14px 16px',
//                             border: "2px solid #e5e7eb",
//                             borderRadius: 10,
//                             fontSize: '15px',
//                             outline: 'none',
//                             transition: 'all 0.2s'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                     />

//                     <input
//                         placeholder="🛣️ Street / Area"
//                         value={address.street}
//                         onChange={(e) => {
//                             const newAddr = { ...address, street: e.target.value };
//                             setAddress(newAddr);
//                             onAddressChange(newAddr);
//                         }}
//                         style={{
//                             padding: '14px 16px',
//                             border: "2px solid #e5e7eb",
//                             borderRadius: 10,
//                             fontSize: '15px',
//                             outline: 'none',
//                             transition: 'all 0.2s'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                     />

//                     <input
//                         placeholder="🏪 Landmark (e.g., near XYZ Mall)"
//                         value={address.landmark}
//                         onChange={(e) => {
//                             const newAddr = { ...address, landmark: e.target.value };
//                             setAddress(newAddr);
//                             onAddressChange(newAddr);
//                         }}
//                         style={{
//                             padding: '14px 16px',
//                             border: "2px solid #e5e7eb",
//                             borderRadius: 10,
//                             fontSize: '15px',
//                             outline: 'none',
//                             transition: 'all 0.2s'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                     />

//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//                         <input
//                             placeholder="🏙️ City"
//                             value={address.city}
//                             onChange={(e) => {
//                                 const newAddr = { ...address, city: e.target.value };
//                                 setAddress(newAddr);
//                                 onAddressChange(newAddr);
//                             }}
//                             style={{
//                                 padding: '14px 16px',
//                                 border: "2px solid #e5e7eb",
//                                 borderRadius: 10,
//                                 fontSize: '15px',
//                                 outline: 'none',
//                                 transition: 'all 0.2s'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                             onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                         />

//                         <input
//                             placeholder="📍 State"
//                             value={address.state}
//                             onChange={(e) => {
//                                 const newAddr = { ...address, state: e.target.value };
//                                 setAddress(newAddr);
//                                 onAddressChange(newAddr);
//                             }}
//                             style={{
//                                 padding: '14px 16px',
//                                 border: "2px solid #e5e7eb",
//                                 borderRadius: 10,
//                                 fontSize: '15px',
//                                 outline: 'none',
//                                 transition: 'all 0.2s'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                             onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                         />
//                     </div>

//                     <input
//                         placeholder="📮 Pincode"
//                         value={address.postal_code}
//                         onChange={(e) => {
//                             const newAddr = { ...address, postal_code: e.target.value };
//                             setAddress(newAddr);
//                             onAddressChange(newAddr);
//                         }}
//                         style={{
//                             padding: '14px 16px',
//                             border: "2px solid #e5e7eb",
//                             borderRadius: 10,
//                             fontSize: '15px',
//                             outline: 'none',
//                             transition: 'all 0.2s'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                     />
//                 </div>

//                 <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }

//         input::placeholder {
//           color: #9ca3af;
//         }

//         /* Custom scrollbar */
//         div::-webkit-scrollbar {
//           width: 8px;
//         }

//         div::-webkit-scrollbar-track {
//           background: #f3f4f6;
//           border-radius: 4px;
//         }

//         div::-webkit-scrollbar-thumb {
//           background: #d1d5db;
//           border-radius: 4px;
//         }

//         div::-webkit-scrollbar-thumb:hover {
//           background: #9ca3af;
//         }
//       `}</style>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState, useRef } from "react";

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

interface NearbyPlace {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    distance: number;
    address: string;
}

interface Props {
    onAddressChange: (address: Address) => void;
    googleMapsApiKey: string;
}

export default function AdvancedAddressPicker({ onAddressChange, googleMapsApiKey }: Props) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const autocompleteRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const placeMarkersRef = useRef<google.maps.Marker[]>([]);

    const [position, setPosition] = useState({ lat: 10.3654, lng: 77.9757 });
    const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState(500);
    const [isDragging, setIsDragging] = useState(false);
    const [showPlacesList, setShowPlacesList] = useState(true);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const [address, setAddress] = useState<Address>({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        house: "",
        landmark: "",
        formatted_address: "",
        name: "",
        mobile: "",
        alternate_mobile: "",
        address_type: "home"
    });

    // Load Google Maps Script
    useEffect(() => {
        if (window.google && window.google.maps) {
            setIsScriptLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => alert("Failed to load Google Maps. Please check your API key.");
        document.head.appendChild(script);
    }, [googleMapsApiKey]);

    // Initialize Map
    useEffect(() => {
        if (!isScriptLoaded || !mapContainerRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
            center: position,
            zoom: 17,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "on" }] }]
        });
        mapRef.current = map;

        const marker = new google.maps.Marker({
            position,
            map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: "Drag me to your location"
        });
        markerRef.current = marker;

        const circle = new google.maps.Circle({
            map,
            center: position,
            radius: selectedRadius,
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            strokeColor: "#3b82f6",
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        circleRef.current = circle;

        // Marker dragging
        marker.addListener("dragstart", () => setIsDragging(true));
        marker.addListener("drag", () => {
            const newPos = marker.getPosition();
            if (newPos) circle.setCenter({ lat: newPos.lat(), lng: newPos.lng() });
        });
        marker.addListener("dragend", () => {
            const newPos = marker.getPosition();
            if (newPos) {
                const lat = newPos.lat();
                const lng = newPos.lng();
                setPosition({ lat, lng });
                setIsDragging(false);
                fetchAddress(lat, lng);
            }
        });

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setPosition({ lat, lng });
                marker.setPosition({ lat, lng });
                circle.setCenter({ lat, lng });
                fetchAddress(lat, lng);
            }
        });

        // Autocomplete
        if (searchInputRef.current) {
            try {
                const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
                    fields: ["geometry", "formatted_address", "address_components", "name"]
                });
                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry?.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        setPosition({ lat, lng });
                        map.setCenter({ lat, lng });
                        marker.setPosition({ lat, lng });
                        circle.setCenter({ lat, lng });
                        fetchAddress(lat, lng);
                    }
                });
                autocompleteRef.current = autocomplete;
            } catch (err) {
                console.warn("Autocomplete init failed:", err);
            }
        }

        fetchAddress(position.lat, position.lng);
        detectLocation();
    }, [isScriptLoaded]);

    useEffect(() => {
        if (circleRef.current) circleRef.current.setRadius(selectedRadius);
    }, [selectedRadius]);

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lng2 - lng1) * Math.PI) / 180;
        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    const fetchAddress = async (lat: number, lng: number) => {
        if (!window.google || !window.google.maps) return;

        setLoading(true);
        try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                    const r = results[0];
                    const comp = r.address_components || [];
                    const newAddr: Address = {
                        ...address,
                        formatted_address: r.formatted_address || "",
                        street: comp.find(c => c.types.includes("route"))?.long_name || "",
                        city: comp.find(c => c.types.includes("sublocality") || c.types.includes("locality"))?.long_name || "",
                        state: comp.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "",
                        postal_code: comp.find(c => c.types.includes("postal_code"))?.long_name || "",
                    };
                    setAddress(newAddr);
                    onAddressChange(newAddr);
                } else {
                    // ❌ Handle missing address
                    const newAddr: Address = {
                        ...address,
                        formatted_address: "Address could not be determined",
                        street: "",
                        city: "",
                        state: "",
                        postal_code: "",
                    };
                    setAddress(newAddr);
                    onAddressChange(newAddr);
                    console.warn("Geocode returned no results at", lat, lng, "Status:", status);
                }
                setLoading(false);
            });
        } catch (err) {
            console.error("Geocoding error:", err);
            setLoading(false);
        }
    };

    const clearPlaceMarkers = () => {
        placeMarkersRef.current.forEach(m => m.setMap(null));
        placeMarkersRef.current = [];
    };

    const fetchNearbyPlaces = (lat: number, lng: number) => {
        if (!mapRef.current) return;
        clearPlaceMarkers();
        setNearbyPlaces([]);

        const service = new google.maps.places.PlacesService(mapRef.current);
        const searchTypes = ["store", "shopping_mall", "supermarket", "restaurant", "cafe", "bank", "pharmacy"];
        let allPlaces: NearbyPlace[] = [];
        let completedSearches = 0;

        searchTypes.forEach(type => {
            service.nearbySearch({ location: { lat, lng }, radius: selectedRadius, type }, (results, status) => {
                completedSearches++;
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const places: NearbyPlace[] = results.map((p, idx) => ({
                        id: p.place_id || `${type}-${idx}`,
                        name: p.name || "Unknown",
                        type: p.types?.[0] || type,
                        lat: p.geometry!.location!.lat(),
                        lng: p.geometry!.location!.lng(),
                        distance: calculateDistance(lat, lng, p.geometry!.location!.lat(), p.geometry!.location!.lng()),
                        address: p.vicinity || ""
                    }));
                    allPlaces = [...allPlaces, ...places];
                }
                if (completedSearches === searchTypes.length) {
                    const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.id, p])).values())
                        .sort((a, b) => a.distance - b.distance)
                        .slice(0, 25);
                    setNearbyPlaces(uniquePlaces);

                    uniquePlaces.forEach(place => {
                        const icon = getPlaceIcon(place.type);
                        const m = new google.maps.Marker({
                            position: { lat: place.lat, lng: place.lng },
                            map: mapRef.current!,
                            icon: { url: icon.iconUrl, scaledSize: new google.maps.Size(32, 32) },
                            title: place.name
                        });
                        m.addListener("click", () => selectNearbyPlace(place));
                        placeMarkersRef.current.push(m);
                    });
                }
            });
        });
    };

    const detectLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => {
                    const lat = p.coords.latitude;
                    const lng = p.coords.longitude;
                    setPosition({ lat, lng });

                    if (markerRef.current) markerRef.current.setPosition({ lat, lng });
                    if (circleRef.current) circleRef.current.setCenter({ lat, lng });
                    if (mapRef.current) mapRef.current.setCenter({ lat, lng });

                    fetchAddress(lat, lng);
                },
                err => {
                    console.error("Geolocation error:", err);
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation not supported.");
            setLoading(false);
        }
    };

    const selectNearbyPlace = (place: NearbyPlace) => {
        setPosition({ lat: place.lat, lng: place.lng });
        markerRef.current?.setPosition({ lat: place.lat, lng: place.lng });
        circleRef.current?.setCenter({ lat: place.lat, lng: place.lng });
        mapRef.current?.setCenter({ lat: place.lat, lng: place.lng });
        const newAddr = { ...address, landmark: place.name };
        setAddress(newAddr);
        onAddressChange(newAddr);
        fetchAddress(place.lat, place.lng);
    };

    const getPlaceIcon = (type: string) => {
        const map: { [key: string]: { emoji: string; color: string; label: string; iconUrl: string } } = {
            shopping_mall: { emoji: "🏬", color: "#8b5cf6", label: "Mall", iconUrl: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png" },
            supermarket: { emoji: "🛒", color: "#10b981", label: "Supermarket", iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" },
            gas_station: { emoji: "⛽", color: "#f59e0b", label: "Fuel", iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" },
            restaurant: { emoji: "🍽️", color: "#ef4444", label: "Restaurant", iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" },
            cafe: { emoji: "☕", color: "#ef4444", label: "Cafe", iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" },
            bank: { emoji: "🏦", color: "#06b6d4", label: "Bank", iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
            pharmacy: { emoji: "💊", color: "#ec4899", label: "Pharmacy", iconUrl: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png" },
            store: { emoji: "🏪", color: "#3b82f6", label: "Shop", iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
        };
        return map[type] || { emoji: "📍", color: "#6b7280", label: "Place", iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" };
    };

    const handleInputChange = (field: keyof Address, value: string) => {
        const newAddr = { ...address, [field]: value };
        setAddress(newAddr);
        onAddressChange(newAddr);
    };

    if (!isScriptLoaded) return <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>⏳ Loading Google Maps...</div>;

    return (
        <div style={{
            width: "100%",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>

            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                borderRadius: '16px 16px 0 0',
                color: 'white',
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                    📍 Select Delivery Address
                </h2>
                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                    Drag the pin or click on the map to set your precise location
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <input
                        ref={searchInputRef}
                        placeholder="🔍 Search for your address or area..."
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: 'wrap' }}>
                    <button
                        onClick={detectLocation}
                        disabled={loading && !isDragging}
                        style={{
                            padding: "12px 20px",
                            background: (loading && !isDragging) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            cursor: (loading && !isDragging) ? "not-allowed" : "pointer",
                            fontWeight: '600',
                            fontSize: '14px',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.2s',
                            flex: '1',
                            minWidth: '160px'
                        }}
                    >
                        {(loading && !isDragging) ? "⏳ Detecting..." : "📍 Use My Location"}
                    </button>

                    <select
                        value={selectedRadius}
                        onChange={(e) => {
                            const newRadius = Number(e.target.value);
                            setSelectedRadius(newRadius);
                            if (circleRef.current) {
                                circleRef.current.setRadius(newRadius);
                            }
                            fetchNearbyPlaces(position.lat, position.lng);
                        }}
                        style={{
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: 10,
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            outline: 'none',
                            background: 'white',
                            flex: '1',
                            minWidth: '120px'
                        }}
                    >
                        <option value={300}>300m radius</option>
                        <option value={500}>500m radius</option>
                        <option value={1000}>1km radius</option>
                        <option value={2000}>2km radius</option>
                    </select>
                </div>
            </div>

            {isDragging && (
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    animation: 'pulse 1.5s infinite',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}>
                    🎯 Dragging pin... Release to get address
                </div>
            )}

            {loading && !isDragging && (
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    animation: 'pulse 1.5s infinite',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}>
                    📍 Fetching address details...
                </div>
            )}

            <div
                ref={mapContainerRef}
                style={{
                    height: '450px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    marginBottom: '20px',
                    border: '3px solid #e5e7eb'
                }}
            />

            {nearbyPlaces.length > 0 && (
                <div style={{
                    marginBottom: '24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                    <div
                        onClick={() => setShowPlacesList(!showPlacesList)}
                        style={{
                            padding: 16,
                            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            fontWeight: "600",
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            userSelect: 'none'
                        }}
                    >
                        <span>🏪 Nearby Shops & Landmarks ({nearbyPlaces.length})</span>
                        <span style={{ fontSize: '20px' }}>{showPlacesList ? '▼' : '▶'}</span>
                    </div>

                    {showPlacesList && (
                        <div style={{
                            maxHeight: 280,
                            overflowY: "auto"
                        }}>
                            {nearbyPlaces.map((place, index) => {
                                const placeInfo = getPlaceIcon(place.type);
                                return (
                                    <div
                                        key={place.id}
                                        onClick={() => selectNearbyPlace(place)}
                                        style={{
                                            padding: "14px 16px",
                                            cursor: "pointer",
                                            borderBottom: index < nearbyPlaces.length - 1 ? "1px solid #f3f4f6" : "none",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            transition: 'all 0.15s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#f9fafb";
                                            e.currentTarget.style.paddingLeft = "20px";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "white";
                                            e.currentTarget.style.paddingLeft = "16px";
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                marginBottom: '4px',
                                                color: '#111827'
                                            }}>
                                                {placeInfo.emoji} {place.name}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#6b7280'
                                            }}>
                                                {placeInfo.label} • {place.distance}m away
                                            </div>
                                        </div>
                                        <button
                                            style={{
                                                padding: "6px 14px",
                                                background: placeInfo.color,
                                                color: 'white',
                                                border: "none",
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: '600',
                                                cursor: "pointer"
                                            }}
                                        >
                                            Select
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827'
                }}>
                    📝 Complete Your Address
                </h3>

                <div style={{ display: "grid", gap: 14 }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <input
                            placeholder="Name"
                            value={address.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />

                        <input
                            placeholder="10-digit mobile number"
                            type="tel"
                            maxLength={10}
                            value={address.mobile}
                            onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <input
                            placeholder="Pincode"
                            value={address.postal_code}
                            onChange={(e) => handleInputChange('postal_code', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />

                        <input
                            placeholder="Locality"
                            value={address.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <textarea
                        placeholder="Address (Area and Street)"
                        value={address.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        rows={3}
                        style={{
                            padding: '14px 16px',
                            border: "2px solid #e5e7eb",
                            borderRadius: 10,
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <input
                            placeholder="House/Flat/Block No."
                            value={address.house}
                            onChange={(e) => handleInputChange('house', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />

                        <input
                            placeholder="Apartment/Road/Area"
                            value={address.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <select
                        value={address.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        style={{
                            padding: '14px 16px',
                            border: "2px solid #e5e7eb",
                            borderRadius: 10,
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <input
                            placeholder="Landmark (Optional)"
                            value={address.landmark}
                            onChange={(e) => handleInputChange('landmark', e.target.value)}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />

                        <input
                            placeholder="Alternate Phone (Optional)"
                            type="tel"
                            maxLength={10}
                            value={address.alternate_mobile}
                            onChange={(e) => handleInputChange('alternate_mobile', e.target.value.replace(/\D/g, ''))}
                            style={{
                                padding: '14px 16px',
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                            Address Type
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="addressType"
                                    value="home"
                                    checked={address.address_type === 'home'}
                                    onChange={(e) => handleInputChange('address_type', e.target.value)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '15px' }}>Home (All day delivery)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="addressType"
                                    value="work"
                                    checked={address.address_type === 'work'}
                                    onChange={(e) => handleInputChange('address_type', e.target.value)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '15px' }}>Work (Delivery between 10 AM - 5 PM)</span>
                            </label>
                        </div>
                    </div>

                    {address.formatted_address && (
                        <div style={{
                            padding: '12px',
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#166534'
                        }}>
                            <strong>📌 Auto-detected Address:</strong><br />
                            {address.formatted_address}
                        </div>
                    )}
                </div>
            </div>

            {(address.name || address.street || address.formatted_address) && (
                <div style={{
                    marginTop: 20,
                    padding: '16px',
                    border: '2px solid #3b82f6',
                    borderRadius: 12,
                    background: '#eff6ff',
                    color: '#1e40af',
                    fontWeight: 600
                }}>
                    <h4 style={{ margin: 0, marginBottom: 8 }}>📌 Selected Address:</h4>
                    <div><strong>Name:</strong> {address.name || "-"}</div>
                    <div><strong>Mobile:</strong> {address.mobile || "-"}</div>
                    <div><strong>Street / Area:</strong> {address.street || "-"}</div>
                    <div><strong>House / Flat:</strong> {address.house || "-"}</div>
                    <div><strong>City / Locality:</strong> {address.city || "-"}</div>
                    <div><strong>State:</strong> {address.state || "-"}</div>
                    <div><strong>Pincode:</strong> {address.postal_code || "-"}</div>
                    <div><strong>Landmark:</strong> {address.landmark || "-"}</div>
                    <div><strong>Address Type:</strong> {address.address_type}</div>
                    {address.formatted_address && <div style={{ marginTop: 8, fontStyle: 'italic' }}>Full Address: {address.formatted_address}</div>}
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
        }
        
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
        </div>
    );
}