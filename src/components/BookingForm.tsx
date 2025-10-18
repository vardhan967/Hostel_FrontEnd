// src/components/BookingForm.tsx

import React, { useState } from 'react';
import { createBooking } from '../lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, isBefore } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const BookingForm = ({ room, bedId, authToken, bookedRanges = [], onBookingSuccess }) => {
  const [bookingType, setBookingType] = useState(''); // 'monthly' or 'daily'
  const [checkInDate, setCheckInDate] = useState(undefined);
  const [checkOutDate, setCheckOutDate] = useState(undefined);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const calculatePrice = () => {
    if (bookingType === 'monthly' && checkInDate && room.monthly_rent) {
      // For monthly stays, calculate based on 30-day periods
      return parseFloat(room.monthly_rent).toFixed(2);
    }
    
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays * parseFloat(room.price_per_night)).toFixed(2);
    }
    return '0.00';
  };

  // Auto-calculate checkout date for monthly bookings
  const getEffectiveCheckOutDate = () => {
    if (bookingType === 'monthly' && checkInDate) {
      const checkOut = new Date(checkInDate);
      checkOut.setDate(checkOut.getDate() + 30);
      return checkOut;
    }
    return checkOutDate;
  };

  // Logic to determine if a date is within a booked range (remains the same) ...
  const isDateBooked = (date) => {
    // Convert current date to start of day for accurate comparison
    const currentDate = new Date(date.setHours(0, 0, 0, 0));

    for (const range of bookedRanges) {
      const start = new Date(new Date(range.start).setHours(0, 0, 0, 0));
      const end = new Date(new Date(range.end).setHours(0, 0, 0, 0));
      
      if (currentDate >= start && isBefore(currentDate, end)) {
        return true;
      }
    }
    return false;
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!bookingType) {
      setMessage('Please select booking type (Monthly or Daily).');
      setLoading(false);
      return;
    }

    const totalPrice = calculatePrice();
    if (totalPrice === '0.00') {
      if (bookingType === 'monthly') {
        setMessage('Please select a check-in date.');
      } else {
        setMessage('Please select valid check-in and check-out dates.');
      }
      setLoading(false);
      return;
    }

    // For monthly bookings, validate only check-in date
    if (bookingType === 'monthly' && !checkInDate) {
      setMessage('Please select a check-in date for your monthly stay.');
      setLoading(false);
      return;
    }

    // For daily bookings, validate both dates
    if (bookingType === 'daily' && (!checkInDate || !checkOutDate)) {
      setMessage('Please select both check-in and check-out dates.');
      setLoading(false);
      return;
    }

    try {
      if (!authToken) {
        setMessage('You must be logged in to create a booking.');
        setLoading(false);
        return;
      }
      
      const effectiveCheckOutDate = getEffectiveCheckOutDate();
      const newBooking = await createBooking({
        bed: bedId,
        check_in_date: format(checkInDate, 'yyyy-MM-dd'),
        check_out_date: format(effectiveCheckOutDate, 'yyyy-MM-dd'),
        total_price: totalPrice,
      }, authToken);
      
        setMessage('Booking created successfully! Your reservation is confirmed.');
        toast.success('Booking confirmed!');
      
        // Reset form
        setCheckInDate(undefined);
        setCheckOutDate(undefined);
        setBookingType('');
      
        if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      setMessage(`Booking failed: ${error.message}`);
      toast.error('Booking failed.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mt-6 p-6 border rounded-lg bg-card text-card-foreground">
      <h4 className="text-lg font-semibold mb-4">Book Bed #{bedId}</h4>
        {message === 'Booking created successfully! Your reservation is confirmed.' ? (
          <div className="text-center text-green-600 font-medium">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Booking Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="monthly"
                    checked={bookingType === 'monthly'}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-4 h-4"
                  />
                    <span>Monthly Stay (30 days)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="daily"
                    checked={bookingType === 'daily'}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-4 h-4"
                  />
                    <span>Daily Stay (Flexible)</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                    disabled={(date) => isBefore(date, new Date(new Date().setHours(0, 0, 0, 0))) || isDateBooked(date)}
                    modifiers={{ booked: (date) => isDateBooked(date) }}
                    modifiersClassNames={{ booked: 'bg-red-200 text-red-700 cursor-not-allowed opacity-70' }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {bookingType === 'daily' && (
              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      initialFocus
                      disabled={(date) => !checkInDate || date <= checkInDate}
                      modifiers={{ booked: (date) => isDateBooked(date) }}
                      modifiersClassNames={{ booked: 'bg-red-200 text-red-700 cursor-not-allowed opacity-70' }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {bookingType === 'monthly' && checkInDate && (
              <div className="space-y-2">
                <Label>Check-out Date (Auto-calculated)</Label>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {format(getEffectiveCheckOutDate(), "PPP")} (30 days from check-in)
                </div>
              </div>
            )}

            {((bookingType === 'monthly' && checkInDate) || (bookingType === 'daily' && checkInDate && checkOutDate)) && (
                <div className="text-sm space-y-1 p-3 bg-blue-50 rounded border">
                {bookingType === 'monthly' && (
                  <>
                    <p>Duration: 30 days (1 month)</p>
                      <p className="text-green-600">Monthly stay selected</p>
                  </>
                )}
                {bookingType === 'daily' && (
                  <>
                    <p>Duration: {Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                      <p className="text-blue-600">Daily stay selected</p>
                  </>
                )}
                  <p className="font-medium text-gray-600">Booking details confirmed</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Confirming Reservation...' : 'Confirm Booking'}
            </Button>
          </form>
        )}
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  );
};

export default BookingForm;