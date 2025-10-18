import React, { useEffect, useState } from 'react';
import ReviewItem from '@/components/ReviewItem';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://vardhan.pythonanywhere.com/api/hostels';

const mapReview = (r: any) => ({
  id: r.id,
  name: r.user_name || r.user_email || (r.user && r.user.username) || 'User',
  date: r.created_at || r.created || r.date || null,
  rating: Number(r.rating || 0),
  votes: r.votes || r.likes || 0,
  text: r.review_text || r.comment || r.text || '',
  avatarUrl: r.avatar_url || r.user_avatar || null,
});

const Reviews = ({ hostelId }: { hostelId?: number }) => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const url = hostelId ? `${API_BASE}/reviews/?hostel=${hostelId}` : `${API_BASE}/reviews/`;
        const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(Array.isArray(data) ? data.map(mapReview) : []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [hostelId, token]);

  return (
    <div className="mt-6 w-full flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3 w-full flex flex-col justify-start">
        {/* keep the left column empty for this demo, the review form exists in the main Reviews component elsewhere */}
        <div className="bg-white border rounded-2xl shadow-lg p-6 mb-6">
          <h4 className="text-xl font-bold mb-2 text-primary">Leave a Review</h4>
          <div className="text-sm text-muted-foreground">Use the hostel page to add reviews.</div>
        </div>
      </div>

      <div className="md:w-2/3 w-full">
        <h4 className="text-2xl font-bold mb-6 text-primary">Reviews</h4>
        <div className="space-y-4">
          {loading ? (
            <div className="text-muted-foreground">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-muted-foreground text-center">No reviews yet.</div>
          ) : (
            reviews.map((r) => (
              <ReviewItem key={r.id} review={{
                id: r.id,
                name: r.name,
                date: r.date ? new Date(r.date).toLocaleDateString() : '',
                rating: r.rating,
                votes: r.votes,
                text: r.text,
                avatarUrl: r.avatarUrl,
              }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
