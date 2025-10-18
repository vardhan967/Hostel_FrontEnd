import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Star, MessageSquare, Loader2 } from 'lucide-react'; // Import additional icons
import ReviewItem from '@/components/ReviewItem';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // Assuming Button component is available

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://vardhan.pythonanywhere.com/api/hostels';

const Reviews = ({ hostelId, authToken: propAuthToken }) => {
  // FUNCTIONALITY UNTOUCHED: State and Context hooks
  const { user, token: contextToken } = useAuth();
  const authToken = propAuthToken || contextToken;
  const [reviews, setReviews] = useState<any[]>([]); // Set type to any[] for simplicity, original was []
  const [newReview, setNewReview] = useState({ rating: 5, review_text: '' });
  const [loading, setLoading] = useState(false);
  const [userHasReview, setUserHasReview] = useState(false);

  // FUNCTIONALITY UNTOUCHED: Review mapping
  const mapReview = (r:any) => ({
    id: r.id,
    name: r.user_name || r.user_email || (r.user && r.user.username) || 'User',
    date: r.created_at || r.created || r.date || null,
    rating: Number(r.rating || 0),
    votes: r.votes || r.likes || 0,
    text: r.review_text || r.comment || r.text || '',
    avatarUrl: r.avatar_url || r.user_avatar || null,
    hostel: r.hostel || r.hostel_id || r.hostelId || null,
  });

  // FUNCTIONALITY UNTOUCHED: Fetch reviews effect
  useEffect(() => {
    if (!hostelId) {
      console.debug('Reviews: no hostelId provided, clearing reviews');
      setReviews([]);
      return;
    }

    const url = `${API_BASE}/reviews/?hostel=${encodeURIComponent(hostelId)}`;
    console.debug('Reviews: fetching', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
          let list = Array.isArray(data) ? data.map(mapReview) : [];
          list = list.filter((rv:any) => String(rv.hostel) === String(hostelId));
          console.debug('Reviews: fetched', list.length, 'items after filtering for hostelId', hostelId);
          setReviews(list);
        })
      .catch((err) => {
        console.error('Failed to load reviews', err);
        toast.error('Failed to load reviews');
      });
  }, [hostelId]);

  // FUNCTIONALITY UNTOUCHED: Check user review status effect
  useEffect(() => {
    if (!user || !reviews) {
      setUserHasReview(false);
      return;
    }
    const found = reviews.find((r) => {
      if (r.user_email && user.email) return r.user_email.toLowerCase() === user.email.toLowerCase();
      if (r.user && user.id) return Number(r.user) === Number(user.id);
      return false;
    });
    setUserHasReview(!!found);
  }, [user, reviews]);

  // FUNCTIONALITY UNTOUCHED: Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  // FUNCTIONALITY UNTOUCHED: Handle form submission (POST request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      toast.error('You must be logged in to submit a review.');
      return;
    }
    if (!newReview.review_text) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify({
          hostel: hostelId,
          rating: Number(newReview.rating),
          review_text: newReview.review_text,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Review POST error:', res.status, errorText);
        throw new Error(`Failed to submit review: ${res.status} ${errorText}`);
      }
      const review = await res.json();
      setReviews((prev) => [...prev, review]);
      setNewReview({ rating: 5, review_text: '' });
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI IMPROVEMENTS
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="mt-10 w-full flex flex-col md:flex-row gap-10">
      
      {/* Review Form - Left Column (Sticky on desktop) */}
      <div className="md:w-1/3 w-full flex flex-col justify-start">
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 md:sticky md:top-20 transition-all">
          <h4 className="text-2xl font-extrabold mb-4 text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" /> Share Your Feedback
          </h4>
          
          {/* Average Rating Display */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center justify-center space-x-3 border border-blue-200">
            <span className="text-sm text-gray-700">Average Rating:</span>
            <span className="text-2xl font-extrabold text-blue-800">{averageRating}</span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>

          {/* Form / Already Reviewed Message */}
          {!userHasReview ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div className="flex gap-2 items-center justify-center p-3 bg-gray-50 rounded-lg border">
                {[1,2,3,4,5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                    className="focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Set rating to ${star} stars`}
                  >
                    <Star
                      size={32}
                      className={
                        star <= newReview.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 fill-gray-100'
                      }
                    />
                  </button>
                ))}
                <span className="ml-4 text-xl font-bold text-gray-700">{newReview.rating}/5</span>
              </div>

              {/* Text Area */}
              <textarea
                name="review_text"
                value={newReview.review_text}
                onChange={handleChange}
                placeholder="Write your review here. Be honest and helpful!"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full resize-none text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={5}
                required
              />
              
              {/* Submit Button */}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full text-lg font-semibold shadow-lg transition-colors h-12" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                  </>
                ) : 'Submit Review'}
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-sm text-green-800 font-medium shadow-inner">
              <p className="font-bold mb-1">Thank you for your review!</p>
              <p>You have already submitted a review for this hostel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List - Right Column */}
      <div className="md:w-2/3 w-full">
        <h4 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          Customer Reviews ({reviews.length})
        </h4>
        <div className="space-y-6"> {/* Increased spacing between review items */}
          {reviews.length === 0 ? (
            <div className="p-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center shadow-inner">
              <p className="text-xl font-semibold text-gray-600 mb-2">Be the first to review!</p>
              <p className="text-md text-gray-500">Your feedback is valuable for others.</p>
            </div>
          ) : (
            reviews.map((r) => (
              <ReviewItem 
                key={r.id} 
                review={{ 
                  id: r.id, 
                  name: r.name, 
                  date: r.date ? new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date', 
                  rating: r.rating, 
                  votes: r.votes, 
                  text: r.text, 
                  avatarUrl: r.avatarUrl 
                }} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;