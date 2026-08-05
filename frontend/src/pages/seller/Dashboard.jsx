import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerDashboard } from '../../redux/slices/sellerService';
import { Eye, Home, Calendar, TrendingUp, Plus, Edit3, Trash2, Loader2, ArrowUpRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { dashboard, loading } = useSelector(state => state.seller);

    useEffect(() => {
        dispatch(fetchSellerDashboard());
    }, [dispatch]);

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} `;
        return `₹${amount?.toLocaleString()}`;
    };

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Analytics...</p>
        </div>
    );

    const stats = [
        { label: 'Properties', value: dashboard?.stats?.totalProperties || 0, icon: <Home size={20}/>, trend: `${dashboard?.stats?.activeListings} Active`, color: 'from-emerald-500/10' },
        { label: 'Visit Requests', value: dashboard?.stats?.visitRequests || 0, icon: <Calendar size={20}/>, trend: 'New', color: 'from-amber-500/10' },
        { label: 'Total Revenue', value: formatCurrency(dashboard?.stats?.totalRevenue || 0), icon: <TrendingUp size={20}/>, trend: 'Growth', color: 'from-[#C5A358]/10' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Performance Portal</span>
                    <h1 className="text-4xl font-serif text-[#080E4B] dark:text-white">Seller Overview</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your luxury portfolio and track real-time engagement.</p>
                </div>
                
                <Link to="/seller/add-property" className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-[#080E4B] text-white rounded-2xl transition-all shadow-xl active:scale-95">
                    <div className="absolute inset-0 bg-[#C5A358] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Plus size={20} className="relative z-10" />
                    <span className="relative z-10 text-[11px] font-black uppercase tracking-widest">List New Property</span>
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white  p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-50`} />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white shadow-sm border border-gray-50 rounded-2xl text-[#C5A358]">
                                    {stat.icon}
                                </div>
                                <span className="text-[9px] font-black px-2 py-1 bg-[#F8F9FB] text-gray-400 rounded-lg uppercase tracking-tighter border border-gray-100">
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-serif text-[#080E4B]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-transparent">
                    <div>
                        <h3 className="text-xl font-serif text-[#080E4B]">Recent Portfolio</h3>
                        <p className="text-xs text-gray-400 mt-1">Quick actions for your active listings</p>
                    </div>
                    <Link to="/seller/manage-listings" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C5A358] hover:text-[#080E4B] transition-colors">
                        View Full Inventory <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8F9FB] text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-5">Estate Details</th>
                                <th className="px-6 py-5">Price</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Views</th>
                                <th className="px-10 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {dashboard?.listings?.length > 0 ? (
                                dashboard.listings.map((prop) => (
                                    <tr key={prop._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#C5A358] transition-colors">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#080E4B] group-hover:text-[#C5A358] transition-colors">{prop.name}</p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 mt-1">{prop.type} • {prop.location?.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7 font-serif text-[#080E4B]">₹{prop.price?.toLocaleString()}</td>
                                        <td className="px-6 py-7">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${prop.isApproved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${prop.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {prop.isApproved ? 'Published' : 'Under Review'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7 text-sm font-bold text-gray-400">{prop.views} views</td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button title="Edit Listing" className="p-3 text-gray-300 hover:text-[#080E4B] hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button title="Delete Listing" className="p-3 text-gray-300 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-20">
                                            <Home size={48} className="mb-4" />
                                            <p className="text-sm font-bold">No estates listed yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SellerDashboard;