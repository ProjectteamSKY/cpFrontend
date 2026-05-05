// pages/ShiprocketManagement.tsx

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Home, RefreshCw, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { WalletBalanceCard } from "./WalletBalanceCard";

import {
    getPickupLocations,
    getWalletBalance,
} from "../../service/shippingApiService";

import { PickupLocation } from "../../types/shiprocket";

export function ShiprocketManagement() {
    const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);

    const fetchPickupLocations = async () => {
        try {
            const response = await getPickupLocations();
            if (response.status === 'success') {
                setPickupLocations(response.pickup_locations.shipping_address || []);
            }
        } catch (error) {
            toast.error("Failed to fetch pickup locations");
            console.error(error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const response = await getWalletBalance();
            if (response.status === 'success') {
                setWalletBalance(response.wallet_balance);
            }
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchPickupLocations(), fetchWalletBalance()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleRefresh = () => {
        fetchAllData();
        toast.success("Data refreshed successfully!");
    };

    return (
        <div className="space-y-8 p-6">
            <Toaster />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Shiprocket Management</h1>
                    <p className="text-gray-600">View wallet balance and manage pickup locations</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="border-[#D73D32] text-[#D73D32] hover:bg-[#D73D32] hover:text-white"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Wallet Balance */}
            <WalletBalanceCard balance={walletBalance} onRefresh={handleRefresh} />

            {/* Pickup Locations Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#D73D32]" />
                            Pickup Locations
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your shipping pickup addresses</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total: {pickupLocations.length} locations
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D73D32]"></div>
                    </div>
                ) : pickupLocations.length === 0 ? (
                    <Card className="bg-white shadow-sm border-0">
                        <div className="p-12 text-center">
                            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Pickup Locations Found</h3>
                            <p className="text-gray-500">No pickup locations are available at the moment.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pickupLocations.map((location) => (
                            <Card
                                key={location.id}
                                className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                            >
                                {/* Header with primary badge */}
                                <div className={`p-4 ${location.is_primary_location === 1 ? 'bg-gradient-to-r from-[#2d4863] to-[#2d4863]/90' : 'bg-gray-50'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-semibold text-lg ${location.is_primary_location === 1 ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                                {location.pickup_location}
                                            </h3>
                                            {location.is_primary_location === 1 && (
                                                <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full mt-1">
                                                    <Home className="w-3 h-3" /> Primary Location
                                                </span>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${location.status === 2
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {location.status === 2 ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 space-y-3">
                                    {/* Address */}
                                    <div className="text-sm text-gray-600">
                                        <p>{location.address}</p>
                                        {location.address_2 && <p>{location.address_2}</p>}
                                        <p>{location.city}, {location.state}</p>
                                        <p>{location.country} - {location.pin_code}</p>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-[#D73D32]" />
                                            <span>{location.phone}</span>
                                            {location.alternate_phone && (
                                                <span className="text-gray-400 text-xs">| {location.alternate_phone}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-[#D73D32]" />
                                            <span className="truncate">{location.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-[#D73D32]" />
                                            <span>{location.open_time} - {location.close_time}</span>
                                        </div>
                                    </div>

                                    {/* Contact Person */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-700">Contact Person:</span>{' '}
                                            <span className="text-gray-600">{location.name}</span>
                                        </p>
                                    </div>

                                    {/* View Details Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedLocation(location)}
                                        className="w-full mt-2 border-[#D73D32] text-[#D73D32] hover:bg-[#D73D32] hover:text-white"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Location Details Modal */}
            {selectedLocation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLocation(null)}>
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className={`p-6 ${selectedLocation.is_primary_location === 1 ? 'bg-gradient-to-r from-[#2d4863] to-[#2d4863]/90' : 'bg-gray-50'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className={`text-2xl font-bold ${selectedLocation.is_primary_location === 1 ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                        {selectedLocation.pickup_location}
                                    </h3>
                                    {selectedLocation.is_primary_location === 1 && (
                                        <span className="inline-flex items-center gap-1 text-sm bg-white/20 text-white px-3 py-1 rounded-full mt-2">
                                            <Home className="w-4 h-4" /> Primary Pickup Location
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedLocation(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Address Details</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                                    <p><span className="font-medium">Address Line 1:</span> {selectedLocation.address}</p>
                                    {selectedLocation.address_2 && <p><span className="font-medium">Address Line 2:</span> {selectedLocation.address_2}</p>}
                                    <p><span className="font-medium">City:</span> {selectedLocation.city}</p>
                                    <p><span className="font-medium">State:</span> {selectedLocation.state}</p>
                                    <p><span className="font-medium">Country:</span> {selectedLocation.country}</p>
                                    <p><span className="font-medium">PIN Code:</span> {selectedLocation.pin_code}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">Contact Person:</span> {selectedLocation.name}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedLocation.phone}</p>
                                    {selectedLocation.alternate_phone && <p><span className="font-medium">Alternate Phone:</span> {selectedLocation.alternate_phone}</p>}
                                    <p><span className="font-medium">Email:</span> {selectedLocation.email}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Operational Hours</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p><span className="font-medium">Open Time:</span> {selectedLocation.open_time}</p>
                                    <p><span className="font-medium">Close Time:</span> {selectedLocation.close_time}</p>
                                </div>
                            </div>

                            {selectedLocation.instruction && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>{selectedLocation.instruction}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setSelectedLocation(null)} className="bg-[#D73D32] hover:bg-[#D73D32]/90">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShiprocketManagement;