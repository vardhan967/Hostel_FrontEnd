// src/pages/HostelList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getHostels, Hostel } from '@/lib/api';
import { toast } from 'sonner';
import { Building2, MapPin, Loader2, Bed, DollarSign, Star } from 'lucide-react';

const HostelList = () => {
  // FUNCTIONALITY UNTOUCHED: State definitions
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  // FUNCTIONALITY UNTOUCHED: Data fetching
  useEffect(() => {
    const loadHostels = async () => {
      try {
        const data = await getHostels();
        setHostels(data);
      } catch (error) {
        toast.error('Failed to load hostels.');
      } finally {
        setLoading(false);
      }
    };

    loadHostels();
  }, []);

  // Helper to compute available beds for a display badge
  const computeAvailableBeds = (hostel: Hostel) => {
    if (!hostel.rooms) return 0;
    return hostel.rooms.reduce((acc, room) => {
      if (room.beds) {
        return acc + room.beds.filter(bed => bed.is_available).length;
      }
      return acc;
    }, 0);
  };

  // Loading State - Enhanced UI
  if (loading) {
    return (
      <div className="container py-20 flex justify-center flex-col items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-xl text-gray-600">Loading available hostels...</p>
      </div>
    );
  }

  // Empty State - Enhanced UI
  if (hostels.length === 0) {
    return (
      <div className="container py-20 text-center min-h-screen">
        <div className="p-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl max-w-lg mx-auto shadow-inner">
            <Building2 className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-2xl font-semibold text-gray-700 mb-2">No Hostels Found</p>
            <p className="text-md text-gray-500">
                It looks like there are no hostels available right now. Please check back later or contact support.
            </p>
        </div>
      </div>
    );
  }

  // Main List UI - Enhanced Cards and Layout
  return (
    <div className="container py-8 sm:py-12 mx-auto max-w-7xl px-4 sm:px-6"> {/* Ensure consistent mobile padding */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 sm:mb-10 text-gray-900 border-b pb-3">
          Discover Your Next Hostel
      </h1>
      
      {/* Grid defaults to 1 column on mobile, scales up */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {hostels.map((hostel) => {
          const availableBeds = computeAvailableBeds(hostel);
          const isVacant = availableBeds > 0;
          const priceDisplay = hostel.default_price_per_day || hostel.default_monthly_rent 
            ? `from ₹${hostel.default_price_per_day || hostel.default_monthly_rent}`
            : 'Price N/A';

          return (
            <Link to={`/hostels/${hostel.id}`} key={hostel.id}>
              <Card className="h-full rounded-xl overflow-hidden shadow-lg border-t-4 border-blue-500 transition-all duration-300 hover:shadow-2xl hover:border-blue-700">
                
                {/* Image Section */}
                <div className="aspect-video bg-gray-200 overflow-hidden relative">
                  {hostel.images && hostel.images.length > 0 ? (
                    <img 
                      src={hostel.images[0]} 
                      alt={hostel.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                  {/* Vacancy Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${isVacant ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <Bed className="w-3 h-3 inline mr-1" />
                    {isVacant ? `${availableBeds} Vacancy` : 'Fully Booked'}
                  </div>
                </div>
                
                {/* Card Header (Title and Address) */}
                <CardHeader className="p-4 sm:p-5 pb-2"> {/* Optimized padding for mobile */}
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                    {hostel.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="truncate">{hostel.address}</span>
                  </CardDescription>
                </CardHeader>
                
                {/* Card Content (Description and Footer) */}
                <CardContent className="p-4 sm:p-5 pt-2"> {/* Optimized padding for mobile */}
                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {hostel.description}
                  </p>

                  {/* Pricing/Rating Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 gap-2">
                    <div className="flex items-center gap-2 text-md font-bold text-green-700">
                        <DollarSign className="w-5 h-5" />
                        <span>{priceDisplay}</span>
                    </div>
                    {/* Placeholder for Rating (since real rating is not calculated here) */}
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">4.5</span>
                        <span className="text-xs text-gray-500">(12 reviews)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HostelList;