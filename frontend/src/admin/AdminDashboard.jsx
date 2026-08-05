import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../redux/slices/adminSlice';
import {
    TrendingUp, Users, Home, Clock, CheckCircle,
    ArrowUpRight, ArrowDownRight, Activity, Zap, ShieldCheck, Layers, Building2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    const chartData = [
        { name: 'Mon', val: 400 }, { name: 'Tue', val: 700 },
        { name: 'Wed', val: 500 }, { name: 'Thu', val: 900 },
        { name: 'Fri', val: 1100 }, { name: 'Sat', val: 800 },
        { name: 'Sun', val: 1300 }
    ];
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return "₹0";
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} `;
        }
        else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} `;
        }
        else {
            return `₹${amount.toLocaleString('en-IN')}`;
        }
    };

    if (loading && !stats) return (
        <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Aggregating System Intelligence...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 font-sans"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">System Administration</span>
                    <h1 className="text-4xl font-serif text-[#080E4B]">Executive Oversight</h1>
                    <p className="text-gray-400 text-sm mt-1">Global platform metrics and operational health.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-[#080E4B] uppercase tracking-[0.2em]">Node Cluster: Secure</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Market Valuation', val: formatCurrency(stats?.estimatedMarketValue || 85000000), trend: '+12.5%', up: true, icon: <TrendingUp size={18} />, color: 'from-emerald-500/10' },
                    { label: 'Network Citizens', val: stats?.users?.total || 1240, trend: '+3.2%', up: true, icon: <Users size={18} />, color: 'from-blue-500/10' },
                    { label: 'Global Inventory', val: stats?.properties?.total || 450, trend: 'Stable', up: true, icon: <Building2 size={18} />, color: 'from-[#C5A358]/10' },
                    { label: 'Verification Queue', val: stats?.properties?.pending || 12, trend: 'Action Req', up: false, icon: <ShieldCheck size={18} />, color: 'from-rose-500/10' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-40`} />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white shadow-sm border border-gray-50 rounded-2xl text-[#C5A358]">
                                    {item.icon}
                                </div>
                                <div className={`text-[9px] font-black px-2 py-1 rounded-md border ${item.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {item.trend}
                                </div>
                            </div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
                            <h2 className="text-2xl font-serif text-[#080E4B]">{item.val}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-serif text-[#080E4B]">Market Engagement</h3>
                            <p className="text-xs text-gray-400 mt-1">Aggregated user activity across all nodes.</p>
                        </div>
                        <select className="text-[10px] font-black uppercase tracking-widest bg-[#F8F9FB] border-none rounded-xl px-4 py-2 outline-none text-gray-500">
                            <option>Last 30 Days</option>
                            <option>Quarterly</option>
                        </select>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C5A358" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#C5A358" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="val" stroke="#C5A358" strokeWidth={3} fillOpacity={1} fill="url(#colorGold)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#080E4B] p-8 md:p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A358] opacity-5 rounded-full -mr-20 -mt-20 blur-3xl" />

                    <div className="relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A358] mb-8 flex items-center gap-2">
                            <Layers size={14} /> Demographics
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-white/60">Verified Buyers</span>
                                    <span>{stats?.users?.buyers || '65%'}</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-[#C5A358] shadow-[0_0_10px_#C5A358]"></motion.div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-white/60">Elite Sellers</span>
                                    <span>{stats?.users?.sellers || '35%'}</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 1.5 }} className="h-full bg-white"></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 relative z-10">
                        <div className="flex items-start gap-4">
                            <Zap className="text-[#C5A358] fill-[#C5A358]" size={20} />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A358]">Admin Insight</p>
                                <p className="text-xs font-medium leading-relaxed mt-2 text-white/70">Approving pending assets could unlock ₹1.2Cr in platform liquidity.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-serif text-[#080E4B]">Verification Backlog</h3>
                        <p className="text-xs text-gray-400 mt-1">Pending properties awaiting regulatory approval.</p>
                    </div>
                    <Link to="/admin/approvals" className="text-[10px] font-black text-[#C5A358] uppercase tracking-[0.2em] border-b border-[#C5A358] pb-1 hover:text-[#080E4B] hover:border-[#080E4B] transition-all">
                        Process All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Estate Identity</th>
                                <th className="px-8 py-6">Category</th>
                                <th className="px-8 py-6">Valuation</th>
                                <th className="px-10 py-6 text-right">Review Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#F8F9FB] rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#C5A358] transition-colors">
                                                <Home size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#080E4B]">Skyline Regency Suite {i + 1}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Log Entry: 2h 14m ago</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Residential</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-serif text-[#080E4B]">₹85.00 L</p>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                            <div className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
                                            Awaiting Review
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;