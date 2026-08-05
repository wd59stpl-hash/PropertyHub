import React from 'react';
import { MapPin, BedDouble, Bath, Heart, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});
    const { items: compareItems = [] } = useSelector((state) => state.compare || { items: [] });
    const isLiked = wishlistItems.some(item =>
        (typeof item === 'string' ? item === property._id : item._id === property._id)
    );
    const isInCompare = compareItems.some(item => item._id === property._id);

    const handleWishlist = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error("Please login to save properties");
            return navigate('/login');
        }
        dispatch(toggleWishlist(property._id));
        toast.success(isLiked ? "Removed from Wishlist" : "Saved to Wishlist ❤️");
    };

    const handleCompare = (e) => {
        e.stopPropagation();
        toast.success("Added to Compare List 📊");
    };

    const formatPrice = (num) => {
        const n = Number(num);
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
        return `₹${n.toLocaleString('en-IN')}`;
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(`/property/${property._id}`)}
            className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full relative"
        >
            <div className="relative h-64 overflow-hidden">
                <LazyLoadImage
                    alt={property.name}
                    src={property.images?.[0]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[50]">
                    {user?.role !== 'seller' && user?.role !== 'admin' && (
                        <button
                            onClick={handleWishlist}
                            className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 border 
                            ${isLiked ? 'bg-white border-white text-red-500' : 'bg-black/20 border-white/20 text-white hover:bg-white hover:text-red-500'}`}
                        >
                            <Heart size={20} fill={isLiked ? "red" : "none"} />
                        </button>
                    )}

                    {user?.role !== 'seller' && user?.role !== 'admin' && (
                        <button
                            onClick={handleCompare}
                            className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 border 
                            ${isInCompare ? 'bg-white border-white text-[#C5A358]' : 'bg-black/20 border-white/20 text-white hover:bg-white hover:text-[#C5A358]'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.2em]">Listing Price</p>
                    <p className="text-white text-2xl font-bold font-serif">{formatPrice(property.price)}</p>
                </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] font-black uppercase rounded">{property.type}</span>
                        {property.isApproved && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded italic">Verified</span>}
                    </div>
                    <h2 className="text-lg font-serif text-[#080E4B] dark:text-white leading-tight group-hover:text-[#C5A358] transition-colors line-clamp-1">{property.name}</h2>
                    {/* Is part ko replace karein */}
                    <p
                        className="flex items-center gap-1 text-gray-400 text-xs mt-1 line-clamp-1"
                        title={`${property.location?.address}, ${property.location?.city}, ${property.location?.state}`}
                    >
                        <MapPin size={12} className="shrink-0 text-[#C5A358]" />
                        <span>
                            {property.location?.address && `${property.location.address}, `}
                            {property.location?.city}, {property.location?.state}
                        </span>
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-between">
                    <div className="text-center">
                        <p className="text-xs font-bold text-[#080E4B] dark:text-white flex items-center gap-1"><BedDouble size={14} className="text-[#C5A358]" /> {property.bedrooms}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black">Beds</p>
                    </div>
                    <div className="text-center border-x border-gray-50 dark:border-slate-800 px-6">
                        <p className="text-xs font-bold text-[#080E4B] dark:text-white flex items-center gap-1"><Bath size={14} className="text-[#C5A358]" /> {property.bathrooms}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black">Baths</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-[#080E4B] dark:text-white">{property.area}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black">Sq.Ft</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(PropertyCard);