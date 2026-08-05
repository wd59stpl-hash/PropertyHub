import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyerDashboard } from '../redux/slices/buyerSlice';
import { Clock, Bell, Activity, ArrowUpRight, Heart, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const BuyerDashboard = () => {
    const dispatch = useDispatch();
    const { dashboard, loading } = useSelector((state) => state.buyer);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchBuyerDashboard());
    }, [dispatch]);

    const getRelativeTime = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return past.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    if (loading) {
        return (
            <div className="h-[80vh] w-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Curating Experience...</p>
            </div>
        );
    }
    const statsConfig = [
        { label: 'Properties Saved', value: dashboard?.stats?.propertiesViewed || 0, icon: <Heart size={20} />, color: 'from-blue-500/10 to-transparent' },
        { label: 'Booked Visits', value: dashboard?.stats?.visitsPending || 0, icon: <Clock size={20} />, color: 'from-amber-500/10 to-transparent' },
        { label: 'Active Alerts', value: dashboard?.stats?.newAlerts || 0, icon: <Bell size={20} />, color: 'from-purple-500/10 to-transparent' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
            <header className="relative bg-[#080E4B] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                <div className="relative z-10">
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">Member Dashboard</span>
                    <h1 className="text-4xl font-serif">Welcome back, <span className="italic">{dashboard?.userName || user?.name}</span></h1>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsConfig.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40`} />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-serif text-[#080E4B]">{stat.value < 10 && stat.value > 0 ? `0${stat.value}` : stat.value}</h3>
                            </div>
                            <div className="p-3 bg-white shadow-md rounded-2xl text-[#C5A358]">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-serif text-[#080E4B]">Live Activity</h3>
                        <Activity size={20} className="text-gray-200" />
                    </div>

                    {dashboard?.activities?.length > 0 ? (
                        <div className="space-y-8">
                            {dashboard.activities.map((activity, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:border-[#C5A358]">
                                        <div className="w-2 h-2 bg-[#C5A358] rounded-full" />
                                    </div>
                                    <div className="pb-8 border-b border-gray-50 w-full">
                                        <p className="text-sm text-gray-700 font-medium">{activity.text}</p>
                                        <span className="text-[10px] text-gray-300 uppercase tracking-widest">{getRelativeTime(activity.date)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                            <Home size={30} className="mb-2 opacity-20" />
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-[#080E4B] rounded-[2rem] p-8 text-white">
                        <h4 className="text-lg font-serif mb-4">Finding the perfect home?</h4>
                        <button className="w-full py-4 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Talk to Expert</button>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase">Verified Account</span>
                        <ArrowUpRight size={16} className="text-green-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BuyerDashboard;