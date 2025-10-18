// src/pages/CustomerDashboard.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings } from '@/lib/api';
import { toast } from 'sonner';
import { Calendar, DollarSign, Building2 } from 'lucide-react';

// Define the interface for the Booking model to match the backend API response
interface Booking {
  id: number;
  user_email: string;
  bed: number; // The bed ID
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_price: string;
  created_at: string;
}

const CustomerDashboard = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadBookings = async () => {
    try {
      const data = await getBookings(token);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.profile?.name || user?.username}!</h1>
        <p className="text-muted-foreground">{user?.email}</p>
        <div className="mt-3 text-sm text-muted-foreground">
          {user?.profile?.phone_number && <div>Phone: {user.profile.phone_number}</div>}
          {user?.profile?.address && <div>Address: {user.profile.address}</div>}
          {user?.profile?.user_type && <div>User type: {user.profile.user_type}</div>}
          {user?.profile?.roll_no && <div>Roll No: {user.profile.roll_no}</div>}
          {user?.profile?.college && <div>College: {user.profile.college}</div>}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No bookings yet. Start exploring hostels!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {/* Note: The API returns the bed ID, not the hostel name,
                         so we might need to adjust this to show the hostel name later */}
                      {`Booking #${booking.id}`}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p className="text-muted-foreground">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p className="text-muted-foreground">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Total Price</p>
                        <p className="text-muted-foreground">${booking.total_price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;