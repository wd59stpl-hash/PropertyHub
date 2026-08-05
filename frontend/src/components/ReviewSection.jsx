import React, { useState, useEffect } from 'react';
import { Star, Camera, Send, Loader2, User, Quote, ShieldCheck, ImageIcon } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewSection = ({ propertyId, currentUser }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/buyer/reviews/${propertyId}`);
            setReviews(data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchReviews(); }, [propertyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please provide a star rating");
        
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('propertyId', propertyId);
            formData.append('rating', rating);
            formData.append('comment', comment);
            images.forEach(img => formData.append('images', img));

            await api.post('/buyer/reviews/add', formData);
            toast.success("Testimonial published successfully");
            setRating(0); setComment(""); setImages([]);
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed");
        } finally { setSubmitting(false); }
    };

    return (
        <div className="mt-20 space-y-12 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Resident Intelligence</span>
                    <h3 className="text-4xl font-serif text-[#080E4B]">Public Testimonials</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FB] rounded-full border border-gray-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A358] animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reviews.length} Verified Feedbacks</span>
                </div>
            </div>
            {currentUser?.role === 'buyer' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Quote size={80} className="text-[#080E4B]" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <p className="text-[11px] font-black uppercase tracking-widest text-[#080E4B]">Rate your experience</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    onMouseEnter={() => setHover(s)}
                                    onMouseLeave={() => setHover(0)}
                                    className="transition-all duration-300 transform active:scale-90"
                                >
                                    <Star 
                                        size={28} 
                                        fill={(hover || rating) >= s ? "#C5A358" : "none"} 
                                        className={(hover || rating) >= s ? "text-[#C5A358] drop-shadow-[0_0_8px_rgba(197,163,88,0.5)]" : "text-gray-200"} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe the architecture, ambiance, and surroundings..."
                            className="w-full p-8 rounded-[2.5rem] bg-[#F8F9FB] border-none focus:ring-2 focus:ring-[#C5A358]/20 outline-none text-[#080E4B] font-medium text-base min-h-[150px] placeholder:text-gray-300 transition-all shadow-inner"
                            required
                        />
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="relative group">
                                <input 
                                    type="file" multiple accept="image/*" 
                                    onChange={(e) => setImages(Array.from(e.target.files))}
                                    className="hidden" id="review-images"
                                />
                                <label htmlFor="review-images" className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:border-[#C5A358] transition-all">
                                    <Camera size={18} className="text-[#C5A358]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {images.length > 0 ? `${images.length} Imagery Attached` : 'Attach Imagery'}
                                    </span>
                                </label>
                            </div>

                            <button 
                                disabled={submitting}
                                className="group relative overflow-hidden bg-[#080E4B] text-white px-12 py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#C5A358] to-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative z-10 flex items-center gap-3">
                                    {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-[#080E4B]">Publish Testimonial</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-gray-100 border-t-[#C5A358] rounded-full animate-spin" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Syncing Feedbacks...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-gray-50">
                        <Quote className="mx-auto text-gray-100 mb-6" size={48} />
                        <p className="text-gray-400 font-serif italic text-lg">"Be the first to narrate your journey with this estate."</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {reviews.map((rev, idx) => (
                            <motion.div 
                                key={rev._id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-14 h-14 bg-[#F8F9FB] rounded-2xl flex items-center justify-center text-[#080E4B] font-serif italic text-2xl border border-gray-50 shadow-inner">
                                        {rev.buyer?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-[#080E4B] text-base capitalize">{rev.buyer?.name}</p>
                                            <ShieldCheck size={14} className="text-blue-500" />
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < rev.rating ? "#C5A358" : "none"} className={i < rev.rating ? "text-[#C5A358]" : "text-gray-100"} />
                                            ))}
                                            <span className="ml-2 text-[10px] font-black text-gray-300 uppercase tracking-tighter">Verified Review</span>
                                        </div>
                                    </div>
                                    <p className="hidden md:block text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>

                                <p className="text-[#080E4B]/70 text-sm leading-relaxed italic border-l-2 border-[#C5A358]/20 pl-6 py-1 mb-6 font-medium">
                                    "{rev.comment}"
                                </p>

                                {rev.images?.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        <div className="w-10 h-10 bg-[#F8F9FB] rounded-xl flex items-center justify-center text-gray-200">
                                            <ImageIcon size={16} />
                                        </div>
                                        {rev.images.map((img, i) => (
                                            <img key={i} src={img} className="w-14 h-10 rounded-xl object-cover border border-gray-50 hover:scale-110 transition-transform cursor-pointer shadow-sm" />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;