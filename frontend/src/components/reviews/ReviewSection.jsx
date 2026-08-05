import React, { useState, useEffect } from 'react';
import { Star, Camera } from 'lucide-react';
import api from '../../services/api';

const ReviewSection = ({ propertyId, canReview }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get(`/buyer/reviews/${propertyId}`).then(res => setReviews(res.data.data));
    }, [propertyId]);

    return (
        <div className="mt-16 space-y-8">
            <h3 className="text-2xl font-black text-slate-800">Reviews & Ratings</h3>            
            <div className="grid gap-6">
                {reviews.map(rev => (
                    <div key={rev._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                                <img src={rev.buyer?.avatar || '/default-user.png'} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{rev.buyer?.name}</p>
                                <div className="flex text-amber-500"><Star size={12} fill="currentColor" /> {rev.rating}</div>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                        
\                        <div className="flex gap-2 mt-4">
                            {rev.images?.map((img, i) => (
                                <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};