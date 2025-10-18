// src/components/RoomCard.tsx

import React from 'react';
import { displayRoomType } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bed, DollarSign, Users, Info } from 'lucide-react'; // Import icons for better visuals
import { Button } from '@/components/ui/button'; // Assuming Button component is available

// The 'room' prop type should ideally be defined, but kept as 'any' for compatibility with the original component structure
const RoomCard = ({ room }: { room: any }) => {
    // FUNCTIONALITY UNTOUCHED: Calculation of beds
    const totalBeds = Array.isArray(room.beds) ? room.beds.length : 0;
    const availableBeds = Array.isArray(room.beds) ? room.beds.filter(b => b.is_available).length : 0;
    const isAvailable = availableBeds > 0;

    // Determine badge colors based on availability
    const badgeBg = isAvailable ? 'bg-emerald-500' : 'bg-red-500';
    const badgeHover = isAvailable ? 'hover:bg-emerald-600' : 'hover:bg-red-600';

    return (
        <Card className={`overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border-t-4 ${isAvailable ? 'border-emerald-500' : 'border-red-500'}`}>
            <CardHeader className="p-4 sm:p-6 pb-3 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center mb-1">
                            <Bed className="w-5 h-5 mr-2 text-blue-600" />
                            {displayRoomType(room.room_type)} Room{room.room_number ? ` — ${room.room_number}` : ''}
                        </CardTitle>
                        <p className="text-sm text-gray-500 font-medium flex items-center">
                            <Users className="w-4 h-4 mr-1.5" /> Max Capacity: {room.capacity} beds
                        </p>
                    </div>
                    
                    {/* Vacancy Badge (REPLACED BUTTON WITH A STYLED DIV/BUTTON) */}
                    <button 
                        type="button" 
                        className={`px-3 py-1 rounded-full text-white font-bold text-xs shadow-md transition-all flex items-center ${badgeBg} ${badgeHover}`}
                        aria-label={`Vacancies: ${availableBeds} out of ${totalBeds || room.capacity}`}
                    >
                        <span className="mr-1">Vacancies:</span> 
                        <span className="text-sm">{availableBeds}</span>
                        <span className="text-gray-200">/</span>
                        <span className="text-sm">{totalBeds || room.capacity}</span>
                    </button>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-4 space-y-4">
                {/* Pricing Block */}
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Monthly Rent</span>
                        <span className="text-lg font-bold text-green-700">
                            {room.monthly_rent ? `₹${room.monthly_rent}` : '—'}
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-xs text-gray-500 font-medium">Daily Rate</span>
                        <span className="text-lg font-bold text-green-700">
                            {room.price_per_night ? `₹${room.price_per_night}` : '—'}
                        </span>
                    </div>
                </div>

                {/* Info and CTA */}
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                        <span className="font-semibold">Discovery Mode:</span> Booking is currently disabled. Select a different hostel or room type to explore more options.
                    </p>
                </div>

                {/* Placeholder CTA - Disabled in Discovery Mode */}
                <Button 
                    className="w-full bg-gray-300 text-gray-700 cursor-not-allowed hover:bg-gray-300 transition-none"
                    disabled
                >
                    Booking Disabled
                </Button>
            </CardContent>
        </Card>
    );
};

export default RoomCard;