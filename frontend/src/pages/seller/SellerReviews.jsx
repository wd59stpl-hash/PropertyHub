import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star, MessageSquare, Home, User, Calendar, Loader2, Quote, ShieldCheck, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const SellerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/seller/reviews')
            .then(res => setReviews(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Reputation Data...</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Insights & Reputation</span>
                    <h1 className="text-4xl font-serif text-[#080E4B]">Property Feedback</h1>
                    <p className="text-gray-400 text-sm mt-1">Direct testimonials from your verified property buyers.</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white p-24 rounded-[3rem] text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="text-gray-200" size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-[#080E4B] dark:text-white">Quiet Portfolio</h3>
                    <p className="text-gray-400 mt-2 max-w-xs mx-auto">No reviews have been published for your listings yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {reviews.map((rev, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={rev._id} 
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            <Quote className="absolute -top-4 -right-4 w-24 h-24 text-[#F8F9FB] group-hover:text-[#C5A358]/5 transition-colors" />
                            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-50 relative z-10">
                                <div className="relative">
                                    <img 
                                        src={rev.property?.images[0] || 'https://via.placeholder.com/400'} 
                                        className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100" 
                                        alt="prop" 
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-[#080E4B] p-1.5 rounded-lg border-2 border-white">
                                        <Home size={10} className="text-[#C5A358]"/>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#080E4B] text-base group-hover:text-[#C5A358] transition-colors">{rev.property?.name}</h4>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                                        Unit ID: {rev.property?._id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                fill={i < rev.rating ? "#C5A358" : "none"} 
                                                className={i < rev.rating ? "text-[#C5A358]" : "text-gray-100"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} className="text-[#C5A358]"/> 
                                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <p className="text-[#080E4B]/70 leading-relaxed italic text-sm font-medium border-l-2 border-[#C5A358]/20 pl-4 py-1">
                                    "{rev.comment}"
                                </p>

                                {rev.images?.length > 0 && (
                                    <div className="flex gap-2 pt-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] flex items-center justify-center text-gray-300">
                                            <Camera size={14} />
                                        </div>
                                        {rev.images.map((img, idx) => (
                                            <img key={idx} src={img} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shadow-sm hover:scale-110 transition-transform cursor-pointer" alt="buyer-upload" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#F8F9FB] rounded-[1rem] flex items-center justify-center text-[#080E4B] font-serif italic text-xl border border-gray-50 shadow-inner">
                                        {rev.buyer?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-[#080E4B]">{rev.buyer?.name}</p>
                                            <ShieldCheck size={14} className="text-blue-500" title="Verified Buyer" />
                                        </div>
                                        <p className="text-[10px] font-medium text-gray-400 lowercase">{rev.buyer?.email.slice(0, 3)}***@mail.com</p>
                                    </div>
                                </div>
                                
                                <div className="px-4 py-1.5 bg-[#F8F9FB] rounded-full border border-gray-100">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified Resident</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default SellerReviews;