import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, MessageSquare } from 'lucide-react'; // Import Lucide Star and other icons

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  votes?: number;
  text: string;
  avatarUrl?: string;
}

// Functionality UNTOUCHED: Stars component logic (re-implemented with Lucide for better UI)
const Stars = ({ count = 0 }: { count: number }) => {
  const full = Math.round(count);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 transition-colors duration-150`} 
          // Use solid color for filled stars, and a lighter color/outline for empty ones
          fill={i < full ? 'currentColor' : 'none'}
          strokeWidth={i < full ? 0 : 1.5}
          stroke={i < full ? 'currentColor' : '#a0aec0'} // gray-400
          color={i < full ? 'text-amber-500' : 'text-gray-400'} // Base color
        />
      ))}
    </div>
  );
};

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  // FUNCTIONALITY UNTOUCHED: Auth context and user type checks
  const { user } = useAuth();
  const userType = (user?.profile?.user_type || user?.user_type || '').toString().toUpperCase();
  const isWarden = userType === 'WARDEN';
  const isAdmin = !!user?.is_staff;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-6 flex flex-row gap-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      
      {/* Avatar/Initial */}
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-blue-100 overflow-hidden border-2 border-blue-200 flex items-center justify-center font-bold text-xl text-blue-600">
          {review.avatarUrl ? (
            <img src={review.avatarUrl} alt={`${review.name} avatar`} className="h-full w-full object-cover" />
          ) : (
            <span>{review.name.charAt(0)}</span>
          )}
        </div>
      </div>

      {/* Content and Actions */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-3">
          
          {/* Header (Name, Date, Rating) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-lg font-semibold text-gray-900 truncate">{review.name}</div>
              <div className="flex items-center gap-1">
                <Stars count={review.rating} />
                <div className="text-sm font-bold text-amber-500 ml-1">{review.rating.toFixed(1)}</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex-shrink-0 mt-1 sm:mt-0">{review.date}</div>
          </div>

          {/* Review Text */}
          <div className="text-base text-gray-700 leading-relaxed">
            {review.text}
          </div>

          {/* Footer (Votes/Likes and Actions) */}
          <div className="flex items-center justify-between pt-3 border-t border-dashed">
            {/* Votes/Likes (If available) */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {review.votes !== undefined && (
                <>
                  <span className="font-semibold text-gray-700">{review.votes}</span> helpful votes
                </>
              )}
            </div>

            {/* Actions for Warden/Admin */}
            {(isWarden || isAdmin) && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" /> Respond
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;