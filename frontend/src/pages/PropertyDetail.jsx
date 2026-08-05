import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById } from '../redux/slices/propertySlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import BookVisitModal from '../components/BookVisitModal';
import ReviewSection from '../components/ReviewSection';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import {
    MapPin, BedDouble, Bath, Maximize, Heart, Share2,
    CheckCircle2, Calendar, MessageSquare, Star, Info,
    Loader2, ArrowLeft, ShoppingBag, ShieldAlert,
    Video, PlayCircle, ChevronRight
} from 'lucide-react';
import ReportModal from '../components/ReportModal';
import NearbyAmenities from '../components/NearbyAmenities';

const PropertyDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { singleProperty: property, loading } = useSelector((state) => state.properties);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { items = [] } = useSelector((state) => state.wishlist || {});
    const [selectedImg, setSelectedImg] = useState(0);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const isLiked = property ? items.some(item => item._id === property._id) : false;

    useEffect(() => {
        if (id) { 
            dispatch(fetchPropertyById(id)); 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    }, [id, dispatch]);

    const formatPrice = (num) => {
        if (!num) return "₹0";
        const n = Number(num);
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
        return `₹${n.toLocaleString('en-IN')}`;
    };

    const handleWishlistToggle = () => {
        if (!isAuthenticated) return navigate('/login');
        dispatch(toggleWishlist(property._id));
        toast.success(isLiked ? "Removed from saved" : "Saved to wishlist");
    };

    const handleBuyProperty = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            setIsPaymentLoading(true);
            const { data } = await api.post('/payments/create-checkout', { propertyId: property._id });
            if (data.url) window.location.href = data.url;
        } catch (error) { toast.error("Payment error"); }
        finally { setIsPaymentLoading(false); }
    };

    const handleContactSeller = () => {
        if (!isAuthenticated) return navigate('/login');
        const event = new CustomEvent('openChat', {
            detail: { id: property.owner?._id, name: property.owner?.name }
        });
        window.dispatchEvent(event);
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin" />
        </div>
    );

    if (!property) return <div className="h-screen flex items-center justify-center font-serif">Estate Not Found</div>;

    return (
        <div className="min-h-screen bg-white/80 dark:bg-slate-900/80  pb-20 font-sans selection:bg-[#C5A358] selection:text-white">
            <BookVisitModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} propertyId={property._id} propertyName={property.name} />
            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} propertyId={property._id} propertyName={property.name} />
            <div className="bg-white/80 dark:bg-slate-900/80  border-b border-gray-100 sticky top-0 z-40 px-6 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#080E4B] transition-colors">
                        <ArrowLeft size={14} /> Back
                    </button>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-all border border-transparent hover:border-red-100"
                        >
                            <ShieldAlert size={16} />
                        </button>
                        <button className="p-2.5 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-all">
                            <Share2 size={16} />
                        </button>
                        <button 
                            onClick={handleWishlistToggle} 
                            className={`p-2.5 rounded-full transition-all border shadow-sm ${isLiked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-300'}`}
                        >
                            <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#C5A358]/10 text-[#C5A358] px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em]">
                                Premier {property.type}
                            </span>
                            <div className="flex items-center gap-1 text-[#C5A358]">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{property.averageRating || '4.8'}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-serif text-[#080E4B] leading-tight capitalize">{property.name}</h1>
                        <p className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                            <MapPin size={14} className="text-[#C5A358]" /> 
                            {property.location?.address}, {property.location?.city}
                        </p>
                    </div>
                    
                    <div className="text-right hidden md:block border-l border-gray-100 pl-8">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Exclusively Priced At</p>
                        <h2 className="text-3xl font-serif text-[#080E4B]">{formatPrice(property.price)}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="space-y-4">
                            <div className="aspect-[16/9] rounded-[2rem] overflow-hidden shadow-xl bg-gray-100 border border-white">
                                <img src={property.images?.[selectedImg]} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
                                {property.images?.map((img, idx) => (
                                    <button key={idx} onClick={() => setSelectedImg(idx)} className={`flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === idx ? 'border-[#C5A358]' : 'border-transparent opacity-40'}`}>
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
                            {[
                                { icon: <BedDouble size={20}/>, val: property.bedrooms, label: 'Beds' },
                                { icon: <Bath size={20}/>, val: property.bathrooms, label: 'Baths' },
                                { icon: <Maximize size={20}/>, val: property.area, label: 'Sq.Ft' }
                            ].map((item, i) => (
                                <div key={i} className={`py-6 text-center ${i < 2 ? 'border-r border-gray-50' : ''}`}>
                                    <div className="text-[#C5A358] mb-1 flex justify-center">{item.icon}</div>
                                    <p className="text-xl font-serif text-[#080E4B]">{item.val}</p>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        {property.video && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-serif text-[#080E4B] flex items-center gap-2 uppercase tracking-widest">
                                    <PlayCircle size={18} className="text-[#C5A358]" /> Cinematic Tour
                                </h3>
                                <div className="rounded-[2.5rem] overflow-hidden shadow-xl bg-black aspect-video border border-white">
                                    <video controls className="w-full h-full" poster={property.images?.[0]}>
                                        <source src={property.video} type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-lg font-serif text-[#080E4B] uppercase tracking-widest">About the Residence</h3>
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 text-gray-500 leading-relaxed text-base font-light italic">
                                "{property.description}"
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-serif text-[#080E4B] uppercase tracking-widest">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {property.amenities?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#C5A358] transition-all">
                                        <CheckCircle2 size={14} className="text-[#C5A358]" />
                                        <span className="font-bold text-gray-700 text-xs capitalize">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <NearbyAmenities coordinates={property.location?.geo?.coordinates} />
                        <ReviewSection propertyId={property._id} currentUser={user} />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-[#080E4B] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <p className="text-[#C5A358] font-black text-[9px] uppercase tracking-[0.4em] mb-3">Total Investment</p>
                                        <h2 className="text-3xl font-serif mb-1">{formatPrice(property.price)}</h2>
                                        <p className="text-white/20 text-[9px] uppercase tracking-widest">Verified Transaction Guaranteed</p>
                                    </div>

                                    <div className="space-y-3">
                                        {!property.isSold ? (
                                            <>
                                                <button onClick={handleBuyProperty} className="w-full h-14 bg-[#C5A358] text-[#080E4B] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all text-[10px] uppercase tracking-[0.3em]">
                                                    <ShoppingBag size={16} /> Authorize Buy
                                                </button>
                                                <button onClick={() => setIsBookingModalOpen(true)} className="w-full h-14 bg-white/5 border border-white/10 text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-[10px] uppercase tracking-[0.3em]">
                                                    <Calendar size={16} className="text-[#C5A358]" /> Book Tour
                                                </button>
                                                <button onClick={handleContactSeller} className="w-full h-14 bg-white text-[#080E4B] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#C5A358] transition-all text-[10px] uppercase tracking-[0.3em]">
                                                    <MessageSquare size={16} /> Chat Expert
                                                </button>
                                            </>
                                        ) : (
                                            <div className="p-6 text-center bg-red-500/10 rounded-2xl text-red-500 font-black uppercase text-[9px] tracking-widest border border-red-500/20">Sold Out</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;