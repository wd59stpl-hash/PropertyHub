import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProperties } from '../redux/slices/propertySlice';
import PropertyCard from '../components/PropertyCard';
import { Sparkles, Loader2, Building2, MapPin, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const NewLaunches = () => {
    const dispatch = useDispatch();
    const { allProperties, loading } = useSelector((state) => state.properties);

    useEffect(() => {
        dispatch(fetchAllProperties({ newProject: true }));
    }, [dispatch]);

    const newlyLaunched = allProperties?.filter(p => p.newProject === true) || [];

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-[#C5A358] mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Elite Projects...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32">
            <div className="bg-[#080E4B] text-white pt-32 pb-48 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A358] opacity-[0.03] rounded-full blur-[100px]" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Sparkles size={14} className="text-[#C5A358]" />
                        <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em]">Limited Edition</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                        Newly Launched <br /> 
                        <span className="italic text-[#C5A358]">Grand Estates</span>
                    </h1>
                    
                    <p className="max-w-xl mx-auto text-white/50 font-light text-lg leading-relaxed">
                        Discover Indore's most prestigious developments, featuring avant-garde architecture and world-class amenities.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
                {newlyLaunched.length > 0 ? (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2 }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {newlyLaunched.map((property) => (
                            <motion.div 
                                key={property._id} 
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="relative group"
                            >
                                <div className="absolute top-5 left-5 z-20 bg-white/95 backdrop-blur-sm text-[#080E4B] px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white group-hover:bg-[#C5A358] group-hover:text-white transition-all duration-500">
                                    <Building2 size={12} /> New Launch
                                </div>
                                
                                <div className="hover:translate-y-[-10px] transition-all duration-500">
                                    <PropertyCard property={property} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[4rem] p-24 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <SearchX size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-serif text-[#080E4B] mb-3">Estates in Curation</h3>
                        <p className="max-w-md mx-auto text-gray-400 font-medium text-sm leading-relaxed">
                            Our team is currently verifying new luxury projects. Check back soon for exclusive early-bird opportunities.
                        </p>
                    </motion.div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-16">
                {[
                    { label: "Verified Developers", icon: <CheckCircle className="text-[#C5A358]" /> },
                    { label: "RERA Approved", icon: <Building2 className="text-[#C5A358]" /> },
                    { label: "Direct Builder Price", icon: <Sparkles className="text-[#C5A358]" /> },
                    { label: "Early Access", icon: <SearchX className="text-[#C5A358]" /> }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-[#C5A358]">{item.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CheckCircle = ({ className }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
);

export default NewLaunches;