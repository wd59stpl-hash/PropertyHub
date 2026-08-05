import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerInquiries, updateBookingStatus } from '../../redux/slices/bookingSlice';
import { 
    Calendar, Clock, Home, Check, X, 
    MessageSquare, Search, Users, CalendarCheck, ShieldCheck,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/common/Pagination'; 

const Schedules = () => {
    const dispatch = useDispatch();
    const { sellerInquiries, pagination, loading } = useSelector(state => state.bookings);    
    const [activeTab, setActiveTab] = useState('Pending');
    const [page, setPage] = useState(1);
    const limit = 5;

    useEffect(() => {
        dispatch(fetchSellerInquiries({ page, limit }));
    }, [dispatch, page]);

    const handleStatusUpdate = (id, status) => {
        dispatch(updateBookingStatus({ id, status }));
    };

    const filteredInquiries = sellerInquiries?.filter(item => item.status === activeTab);
    const stats = [
        { label: 'Inquiries', value: pagination?.totalItems || 0, icon: <Users size={18}/>, color: 'from-blue-500/10' },
        { label: 'Active Page', value: page, icon: <Clock size={18}/>, color: 'from-amber-500/10' },
        { label: 'Total Pages', value: pagination?.totalPages || 0, icon: <CalendarCheck size={18}/>, color: 'from-[#C5A358]/10' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Tour Management</span>
                    <h1 className="text-4xl font-serif text-[#080E4B]">Visit Schedules</h1>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent`} />
                            <div className="relative z-10">
                                <div className="text-[#C5A358] mb-2">{stat.icon}</div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-serif text-[#080E4B]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div className="flex gap-8">
                    {['Pending', 'Accepted', 'Rejected'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] relative ${
                                activeTab === tab ? 'text-[#080E4B]' : 'text-gray-300'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A358]" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A358]" /></div>
                ) : filteredInquiries?.length > 0 ? filteredInquiries.map((inquiry) => (
                    <motion.div layout key={inquiry._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 flex flex-col lg:flex-row gap-8 items-center shadow-sm hover:shadow-md transition-all">
                        <div className="w-16 h-16 bg-[#F8F9FB] rounded-2xl flex items-center justify-center text-[#080E4B] font-serif italic text-2xl border border-gray-50 shadow-inner">
                            {inquiry.buyer?.name?.charAt(0)}
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-lg font-bold text-[#080E4B]">{inquiry.buyer?.name}</h3>
                            <p className="text-gray-400 text-xs">Property: <span className="text-[#C5A358] font-bold">{inquiry.property?.name}</span></p>
                        </div>

                        <div className="flex gap-6 px-6 py-4 bg-[#F8F9FB] rounded-2xl border border-gray-50">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-gray-300 uppercase mb-1">Date</p>
                                <p className="text-xs font-bold text-[#080E4B] flex items-center gap-1"><Calendar size={12}/> {inquiry.visitDate}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-gray-300 uppercase mb-1">Window</p>
                                <p className="text-xs font-bold text-[#080E4B] flex items-center gap-1"><Clock size={12}/> {inquiry.visitTime}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {inquiry.status === 'Pending' ? (
                                <>
                                    <button onClick={() => handleStatusUpdate(inquiry._id, 'Accepted')} className="h-12 w-12 bg-[#080E4B] text-[#C5A358] rounded-xl flex items-center justify-center hover:bg-[#C5A358] hover:text-[#080E4B] transition-all shadow-lg"><Check size={20}/></button>
                                    <button onClick={() => handleStatusUpdate(inquiry._id, 'Rejected')} className="h-12 w-12 bg-white border border-gray-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>
                                </>
                            ) : (
                                <div className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${inquiry.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {inquiry.status}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-50">
                        <MessageSquare className="mx-auto text-gray-100 mb-4" size={40} />
                        <p className="text-gray-400 font-medium">No tour requests in this category.</p>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-gray-50">
                <Pagination 
                    current={pagination?.currentPage || 1} 
                    total={pagination?.totalPages || 1} 
                    onPageChange={(p) => setPage(p)} 
                />
            </div>
        </motion.div>
    );
};

export default Schedules;