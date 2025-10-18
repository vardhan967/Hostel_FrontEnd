// src/pages/HostelDetail.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getHostel, Hostel, Room, Bed } from '@/lib/api';
import { toast } from 'sonner';
// FIX: Added Loader2 to the import list from lucide-react
import { MapPin, Wifi, Coffee, Tv, Car, Phone, DollarSign, Users, ShieldAlert, X, Loader2 } from 'lucide-react'; 
import Reviews from '@/components/Reviews';
import hostelRoomImage from '@/assets/hostel-room.jpg';
import RoomCard from '@/components/RoomCard';

const HostelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [isWardenContactVisible, setIsWardenContactVisible] = useState(true);

  // Derived totals for vacancies across the hostel (FUNCTIONALITY UNTOUCHED)
  const computeVacancies = (hostelData: Hostel | null) => {
    if (!hostelData || !Array.isArray(hostelData.rooms)) return { totalBeds: 0, availableBeds: 0 };
    let totalBeds = 0;
    let availableBeds = 0;
    for (const room of hostelData.rooms) {
      const beds = Array.isArray(room.beds) ? room.beds : [];
      totalBeds += beds.length;
      availableBeds += beds.filter(b => b.is_available).length;
    }
    return { totalBeds, availableBeds };
  };

  useEffect(() => {
    if (id) {
      loadHostel(parseInt(id));
    }
  }, [id]);

  // loadHostel function (FUNCTIONALITY UNTOUCHED)
  const loadHostel = async (hostelId: number) => {
    try {
      const data = await getHostel(hostelId);
      setHostel(data);
    } catch (error) {
      toast.error('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if the amenity string is a URL (FUNCTIONALITY UNTOUCHED)
  const isImageUrl = (text: string) => {
    return text.startsWith('http') && (text.includes('.png') || text.includes('.jpg') || text.includes('.svg'));
  };

  // Helper to get Lucide icons for common amenities (FUNCTIONALITY UNTOUCHED)
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="h-4 w-4 text-blue-500" />;
    if (lower.includes('coffee') || lower.includes('food') || lower.includes('breakfast')) return <Coffee className="h-4 w-4 text-amber-500" />;
    if (lower.includes('tv')) return <Tv className="h-4 w-4 text-gray-500" />;
    if (lower.includes('parking') || lower.includes('car')) return <Car className="h-4 w-4 text-green-500" />;
    return null; 
  };

  // Loading State
  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not Found State
  if (!hostel) {
    return (
      <div className="container py-20 text-center">
        <p className="text-xl font-semibold text-gray-700">Hostel not found</p>
      </div>
    );
  }

  // Vacancy calculation (FUNCTIONALITY UNTOUCHED)
  const { totalBeds, availableBeds } = computeVacancies(hostel);
  const vacancyPercentage = totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;
  
  // Custom button size for thumbnail
  const Thumbnail = ({ image, idx, onClick }: { image: string, idx: number, onClick: (idx: number) => void }) => (
    <button 
      key={idx} 
      className={`w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImageIdx === idx ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={() => onClick(idx)}
    >
      <img src={image} alt={`${hostel.name} ${idx + 1}`} className="w-full h-full object-cover" />
    </button>
  );

  return (
    <div className="container px-4 sm:px-6 py-8 mx-auto max-w-7xl">
      
      {/* HEADER & GALLERY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Left Column: Gallery */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="aspect-video bg-gray-200 rounded-xl shadow-xl overflow-hidden mb-4">
            {hostel.images && hostel.images.length > 0 ? (
              <img 
                src={hostel.images[mainImageIdx]} 
                alt={hostel.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <img 
                src={hostelRoomImage} 
                alt="Hostel room placeholder"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {hostel.images && hostel.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {hostel.images.slice(0, 8).map((image, idx) => (
                <Thumbnail key={idx} image={image} idx={idx} onClick={setMainImageIdx} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <header>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{hostel.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 text-lg">
              <MapPin className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="font-medium">{hostel.address}</p>
            </div>
          </header>

          {/* Warden Contact Banner */}
          {isWardenContactVisible && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg flex items-center justify-between shadow-md transition-all duration-300">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="font-semibold text-base">
                  Warden Contact: <a href={`tel:${hostel.contact_phone}`} className="hover:underline font-bold text-yellow-900">{hostel.contact_phone || '—'}</a>
                </p>
              </div>
              <Button size="sm" variant="ghost" className="p-1 h-auto text-yellow-800 hover:bg-yellow-100" onClick={() => setIsWardenContactVisible(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Description</h2>
            <p className="text-base text-gray-700 leading-relaxed">{hostel.description}</p>
          </div>

          {/* Amenities & Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Amenities */}
            {hostel.amenities && hostel.amenities.length > 0 && (
              <Card className="shadow-lg border-l-4 border-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-blue-700">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hostel.amenities.map((amenity, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                        {isImageUrl(amenity) ? (
                          <img src={amenity} alt="Amenity Icon" className="h-5 w-5 rounded flex-shrink-0" />
                        ) : (
                          <div className="flex items-center gap-2">
                            {getAmenityIcon(amenity)}
                            <span className="font-medium">{amenity}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {hostel.features && hostel.features.length > 0 && (
              <Card className="shadow-lg border-l-4 border-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-purple-700">Key Features</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {hostel.features.map((feature, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ROOMS & VACANCY SECTION */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 border-b pb-3">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Available Rooms</h2>
          <div className="flex items-center gap-4">
             {/* Vacancy Card/Indicator */}
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold text-lg">
              <Users className="h-5 w-5" />
              <span>Vacancies: </span>
              <span className={`font-extrabold ${availableBeds > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {availableBeds}
              </span> 
              <span className="text-gray-600"> / {totalBeds} ({vacancyPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Pricing & Room List Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Pricing Summary (Sticky on Desktop) */}
          <div className="xl:col-span-1 lg:sticky lg:top-20 lg:self-start">
            <Card className="shadow-xl border-t-4 border-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold flex items-center text-green-700">
                  <DollarSign className="w-5 h-5 mr-2" /> Starting Price
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Monthly Rent (from)</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hostel.default_monthly_rent ? `₹${hostel.default_monthly_rent}` : '—'}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Daily Rate (from)</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hostel.default_price_per_day ? `₹${hostel.default_price_per_day}` : '—'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">Prices may vary based on room type and availability.</p>
              </CardContent>
            </Card>
          </div>

          {/* Room List */}
          <div className="xl:col-span-3">
            {hostel.rooms && hostel.rooms.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {hostel.rooms.map(room => (
                  <RoomCard key={room.id} room={room} /> // <-- RoomCard remains untouched
                ))}
              </div>
            ) : (
              <div className="text-center p-10 text-gray-500 border border-dashed rounded-xl">
                <ShieldAlert className="w-8 h-8 mx-auto mb-3" />
                <p className="font-medium">No rooms available for this hostel right now.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Block */}
      <section className="mt-12">
        <Reviews hostelId={hostel.id} authToken={token} /> {/* Reviews component remains untouched */}
      </section>
    </div>
  );
};

export default HostelDetail;