import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Search, MapPin, ArrowRight, ShieldCheck, Trophy, Users, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAllProperties } from '../redux/slices/propertySlice';
import PropertyCard from '../components/PropertyCard';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allProperties, loading } = useSelector((state) => state.properties);    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedFetch = useMemo(
        () => debounce((query) => {
            dispatch(fetchAllProperties({ search: query, limit: 6 }));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        dispatch(fetchAllProperties({ limit: 6 }));
        return () => debouncedFetch.cancel();
    }, [dispatch, debouncedFetch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedFetch(e.target.value);
    };

    const stats = [
        { label: "Properties Sold", value: "1.2K+", icon: <Trophy className="text-[#C5A358]" size={24} /> },
        { label: "Happy Clients", value: "3.5K+", icon: <Users className="text-[#C5A358]" size={24} /> },
        { label: "Cities Covered", value: "25+", icon: <MapPin className="text-[#C5A358]" size={24} /> },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            <section className="relative h-[92vh] lg:h-[95vh] flex items-center bg-[#080E4B] dark:bg-[#020617] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0a115a] dark:bg-slate-900/20 rounded-l-[200px] hidden lg:block pointer-events-none" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-[#C5A358]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-8 items-center relative z-10">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[#C5A358] text-[10px] font-bold uppercase tracking-[0.2em]">
                            Luxury Real Estate Excellence
                        </span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-serif leading-[1.05] tracking-tighter">
                            Luxury <br />
                            <span className="italic text-[#C5A358]">Redefined</span> <br />
                            For You.
                        </h1>

                        <p className="text-blue-100/60 text-sm md:text-base max-w-sm font-medium leading-relaxed">
                            Experience the pinnacle of living with our handpicked selection of premium global estates.
                        </p>

                        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-md">
                            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                                <Search className="text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search city, area..."
                                    className="w-full bg-transparent outline-none font-medium text-gray-700 dark:text-white text-sm"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <button 
                                onClick={() => navigate(`/properties?search=${searchTerm}`)}
                                className="w-full md:w-auto px-8 py-3.5 bg-[#080E4B] dark:bg-[#C5A358] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#C5A358] transition-all duration-300"
                            >
                                Explore
                            </button>
                        </div>
                    </motion.div>

                    <div className="relative hidden lg:flex items-center justify-center h-full">
                        <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-[10px] border-white/5 shadow-2xl w-full max-w-[480px]">
                            <img
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
                                className="w-full h-[550px] object-cover"
                                alt="Luxury Home"
                            />
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                            className="absolute bottom-12 -left-12 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-2xl z-20 flex items-center gap-3 border border-gray-100 dark:border-slate-700">
                            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="pr-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Security Verified</p>
                                <p className="text-gray-900 dark:text-white text-sm font-bold whitespace-nowrap">Secure Deals Only</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 border-b border-gray-50 dark:border-slate-900 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="grid md:grid-cols-3 gap-12">
                        {stats.map((s, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-[#080E4B] dark:group-hover:bg-[#C5A358] group-hover:text-white transition-all duration-500">
                                    {s.icon}
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{s.value}</h4>
                                    <p className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-3">
                            <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.5em]">
                                {searchTerm ? 'Search Results' : 'Curated Collection'}
                            </span>
                            <h2 className="text-5xl font-serif text-gray-900 dark:text-white leading-tight">
                                Featured <br /> <span className="italic">Properties</span>
                            </h2>
                        </div>
                        <button onClick={() => navigate('/properties')} className="group flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#080E4B] dark:hover:text-[#C5A358] transition-all">
                            View Entire Catalog <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-[#C5A358]" size={32} />
                        </div>
                    ) : allProperties.length > 0 ? (
                        <Swiper modules={[Navigation, Autoplay, Pagination]} spaceBetween={30} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="pb-20 property-swiper">
                            {allProperties.map((prop) => (
                                <SwiperSlide key={prop._id}>
                                    <PropertyCard property={prop} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-[3rem]">
                            <p className="text-gray-400 font-serif italic text-lg">No properties found</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-32 bg-[#F8F9FB] dark:bg-slate-900/30">
                <div className="container mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750" className="w-full h-80 object-cover rounded-[3rem]" alt="Interior" />
                            <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811" className="w-full h-60 object-cover rounded-[3rem]" alt="Exterior" />
                        </div>
                        <div className="space-y-6 pt-12">
                            <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227" className="w-full h-60 object-cover rounded-[3rem]" alt="Kitchen" />
                            <div className="bg-[#C5A358] p-8 rounded-[3rem] text-white">
                                <Star size={32} className="mb-4" />
                                <p className="text-2xl font-serif">4.9/5</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Average User Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-5xl font-serif text-gray-900 dark:text-white">Why Investors <span className="italic text-[#C5A358]">Trust</span> Us.</h2>
                        <div className="space-y-8">
                            {[
                                { title: "Exclusive Off-Market Deals", desc: "Access properties that aren't listed on public portals." },
                                { title: "Expert Legal Concierge", desc: "Zero-hassle paperwork with our specialized legal partners." },
                                { title: "Smart Asset Tracking", desc: "Monitor your real estate portfolio performance in real-time." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center font-black text-[#080E4B] dark:text-[#C5A358]">{i + 1}</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                                        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 px-6 lg:px-20 text-center bg-white dark:bg-slate-950">
                <div className="max-w-5xl mx-auto bg-[#080E4B] dark:bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <h2 className="text-4xl md:text-6xl text-white font-serif mb-8 leading-tight">
                        Ready to Find Your <br /> <span className="italic text-[#C5A358]">Signature</span> Home?
                    </h2>
                    <p className="text-blue-100/60 mb-12 max-w-lg mx-auto font-medium">
                        Join 5,000+ investors and homeowners who found their perfect match through PropertyHub.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate('/register')} className="px-10 py-5 bg-[#C5A358] text-white font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-2xl">Create Free Account</button>
                        <button className="px-10 py-5 bg-white/10 text-white border border-white/20 font-black text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all backdrop-blur-sm">Contact Agent</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;