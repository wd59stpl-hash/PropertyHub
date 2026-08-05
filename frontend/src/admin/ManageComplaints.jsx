import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    ShieldAlert, CheckCircle, ExternalLink,
    Mail, Building2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchAdminComplaints } from '../redux/slices/complaintSlice';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../components/common/Pagination';

const ManageComplaints = () => {
    const dispatch = useDispatch();
    const {
        list: complaints = [],
        pagination = { currentPage: 1, totalPages: 1 },
        loading = false
    } = useSelector((state) => state.complaints || {});

    const [page, setPage] = useState(1);
    const limit = 8;
    useEffect(() => {
        dispatch(fetchAdminComplaints({ page, limit }));
    }, [dispatch, page]);

    const handleResolve = async (id) => {
        try {
            await api.patch(`/admin/complaints/${id}`, {
                status: 'Resolved',
                remarks: 'Property verified and action taken.'
            });
            toast.success("Enforcement action recorded.", {
                style: { borderRadius: '10px', background: '#080E4B', color: '#fff' }
            });
            dispatch(fetchAdminComplaints({ page, limit }));
        } catch (error) {
            toast.error("Failed to finalize resolution");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-10 font-sans"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Platform Integrity</span>
                    <h1 className="text-4xl font-serif text-[#080E4B]">Intelligence Oversight</h1>
                    <p className="text-gray-400 text-sm mt-1">Monitoring user reports and property compliance protocols.</p>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Alerts</p>
                        <p className="text-xl font-serif text-red-500">
                            {complaints.filter(c => c.status === 'Pending').length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#F8F9FB]/50">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#080E4B] flex items-center gap-2">
                        <AlertCircle size={16} className="text-[#C5A358]" /> Report Registry
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="bg-[#F8F9FB] text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <tr>
                                <th className="px-8 py-6">Reporter Identity</th>
                                <th className="px-8 py-6">Issue Category</th>
                                <th className="px-8 py-6">Target Estate</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    [...Array(limit)].map((_, n) => (
                                        <tr key={n} className="animate-pulse">
                                            <td colSpan="5" className="px-8 py-7 bg-gray-50/20">
                                                <div className="h-10 w-full bg-gray-100 rounded-xl" />
                                            </td>
                                        </tr>
                                    ))
                                ) : complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-32 text-center">
                                            <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-6">
                                                <ShieldAlert className="text-gray-200" size={32} />
                                            </div>
                                            <h3 className="text-xl font-serif text-[#080E4B]">No Active Reports</h3>
                                            <p className="text-gray-400 text-sm mt-2">The platform is currently operating within compliance limits.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.map((item) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-gray-50/50 transition-all duration-300"
                                        >
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#080E4B] rounded-xl flex items-center justify-center text-[#C5A358] font-serif italic shadow-inner">
                                                        {item.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#080E4B] text-sm uppercase tracking-wide">{item.user?.name}</p>
                                                        <p className="text-[10px] text-gray-400 flex items-center gap-1"><Mail size={10} /> {item.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-md text-[9px] font-black uppercase tracking-widest border border-red-100">
                                                    {item.subject}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-2 italic leading-relaxed max-w-xs line-clamp-1 group-hover:line-clamp-none transition-all">
                                                    "{item.message}"
                                                </p>
                                            </td>
                                            <td className="px-8 py-7">
                                                <a
                                                    href={`/property/${item.property?._id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group/link flex items-center gap-2 text-xs font-bold text-[#080E4B] hover:text-[#C5A358] transition-colors"
                                                >
                                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover/link:text-[#C5A358] transition-colors">
                                                        <Building2 size={14} />
                                                    </div>
                                                    <span className="border-b border-gray-100 pb-0.5">{item.property?.name || 'Asset Liquidated'}</span>
                                                    <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-all" />
                                                </a>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] ${item.status === 'Pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                    {item.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                {item.status === 'Pending' ? (
                                                    <button
                                                        onClick={() => handleResolve(item._id)}
                                                        className="group relative overflow-hidden px-5 py-2.5 bg-[#080E4B] text-white rounded-xl transition-all shadow-lg active:scale-95"
                                                    >
                                                        <div className="absolute inset-0 bg-[#C5A358] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                        <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-[#080E4B]">
                                                            Finalize
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <div className="flex justify-end text-emerald-500">
                                                        <CheckCircle size={20} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#F8F9FB] border-t border-gray-50 px-8 py-2">
                    <Pagination
                        current={pagination.currentPage}
                        total={pagination.totalPages}
                        onPageChange={(p) => setPage(p)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default ManageComplaints;