import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingProperties, updatePropertyStatus } from '../redux/slices/adminSlice';
import Pagination from '../components/common/Pagination';
import {
    Check, X, Eye, Loader2, ShieldAlert, MapPin,
    Bed, Bath, Maximize, Building2, Search, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const PropertyApprovals = () => {
    const dispatch = useDispatch();
    const { pendingProperties, propertiesPagination, loading } = useSelector(state => state.admin);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchPendingProperties({ page, limit: 6 }));
    }, [dispatch, page]);

    const handleOpenModal = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const handleAction = (id, status, name) => {
        dispatch(updatePropertyStatus({ id, status })).then((res) => {
            if (!res.error) {
                toast.success(status ? `${name} Approved` : `${name} Rejected`, {
                    style: { background: '#080E4B', color: '#fff', borderRadius: '10px' }
                });
            }
        });
        setShowModal(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-[#C5A358]" size={40} />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Inventory</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#080E4B] rounded-2xl flex items-center justify-center text-[#C5A358] shadow-xl shadow-blue-900/20">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Verification Portal</span>
                        <h1 className="text-3xl font-serif text-[#080E4B]">Property Approvals</h1>
                    </div>
                </div>
                <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Awaiting Review: <span className="text-[#C5A358] ml-2 text-sm">{pendingProperties?.length || 0}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Listing Details</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Ownership</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Valuation</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-center">Protocol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {pendingProperties.map((prop) => (
                                <motion.tr
                                    key={prop._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="hover:bg-[#F8F9FB]/50 transition-colors group"
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <img src={prop.images[0]} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                                <div className="absolute -top-2 -right-2 bg-[#C5A358] text-[#080E4B] p-1 rounded-lg shadow-lg">
                                                    <ArrowUpRight size={12} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#080E4B] text-base mb-0.5">{prop.name}</p>
                                                <p className="flex items-center text-xs text-gray-400 font-medium">
                                                    <MapPin size={12} className="mr-1 text-[#C5A358]" /> {prop.location.city}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#080E4B] text-sm">{prop.owner?.name}</span>
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider mt-1">Authorized Seller</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="font-serif text-[#080E4B] text-lg">₹{prop.price.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleOpenModal(prop)}
                                                className="p-3 bg-[#F8F9FB] text-[#080E4B] rounded-xl hover:bg-[#080E4B] hover:text-white transition-all shadow-sm"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(prop._id, true, prop.name)}
                                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(prop._id, false, prop.name)}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {pendingProperties.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="text-gray-200" size={32} />
                        </div>
                        <h3 className="text-xl font-serif text-[#080E4B]">All Clear</h3>
                        <p className="text-gray-400 text-sm mt-2 font-medium">No properties are currently pending approval.</p>
                    </div>
                )}
            </div>
            <Pagination
                current={propertiesPagination.currentPage}
                total={propertiesPagination.totalPages}
                onPageChange={(p) => setPage(p)}
            />

            <AnimatePresence>
                {showModal && selectedProperty && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-[#080E4B]/40 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl relative z-10 flex flex-col md:flex-row"
                        >
                            <div className="md:w-5/12 bg-[#F8F9FB] p-8 overflow-y-auto">
                                <div className="space-y-4">
                                    <img
                                        src={selectedProperty.images[0]}
                                        className="w-full h-80 object-cover rounded-[2rem] shadow-2xl border-4 border-white"
                                        alt="Main"
                                    />
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedProperty.images.slice(1, 4).map((img, i) => (
                                            <img key={i} src={img} className="w-full h-24 object-cover rounded-2xl shadow-sm hover:scale-105 transition-transform" alt="" />
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 bg-[#080E4B] rounded-[2rem] text-white">
                                        <span className="text-[#C5A358] text-[9px] font-black uppercase tracking-[0.3em] mb-4 block">Merchant Profile</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#C5A358] rounded-full flex items-center justify-center font-bold text-[#080E4B]">
                                                {selectedProperty.owner?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white leading-tight">{selectedProperty.owner?.name}</p>
                                                <p className="text-xs text-white/50">{selectedProperty.owner?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-7/12 p-10 overflow-y-auto relative">
                                <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#080E4B] transition-colors"><X /></button>

                                <span className="px-4 py-1.5 bg-[#C5A358]/10 text-[#C5A358] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#C5A358]/20">
                                    {selectedProperty.type} • For {selectedProperty.category}
                                </span>

                                <h2 className="text-4xl font-serif text-[#080E4B] mt-6 mb-2">{selectedProperty.name}</h2>
                                <p className="flex items-center text-gray-400 text-sm gap-2 mb-8 font-medium italic">
                                    <MapPin size={16} className="text-[#C5A358]" /> {selectedProperty.location.address}, {selectedProperty.location.city}
                                </p>

                                <div className="text-4xl font-serif text-[#C5A358] mb-10 border-b border-gray-50 pb-8">
                                    ₹{selectedProperty.price.toLocaleString()}
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-10">
                                    {[
                                        { icon: <Bed />, label: 'Bedrooms', val: selectedProperty.bedrooms },
                                        { icon: <Bath />, label: 'Bathrooms', val: selectedProperty.bathrooms },
                                        { icon: <Maximize />, label: 'Square Ft', val: selectedProperty.area }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-[#F8F9FB] rounded-2xl text-center border border-gray-50">
                                            <div className="text-[#C5A358] flex justify-center mb-2">{item.icon}</div>
                                            <p className="text-lg font-bold text-[#080E4B]">{item.val}</p>
                                            <p className="text-[9px] font-black uppercase tracking-tighter text-gray-400">{item.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-8 mb-12">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">Listing Description</h4>
                                        <p className="text-[#080E4B] text-sm leading-relaxed font-medium opacity-80">{selectedProperty.description}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">Key Amenities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProperty.amenities.map((item, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-white border border-gray-100 text-[#080E4B] rounded-xl text-xs font-bold shadow-sm">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => handleAction(selectedProperty._id, true, selectedProperty.name)}
                                        className="flex-1 bg-[#080E4B] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A358] hover:text-[#080E4B] transition-all shadow-xl flex items-center justify-center gap-3 group"
                                    >
                                        <Check size={18} /> Approve Asset
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedProperty._id, false, selectedProperty.name)}
                                        className="px-10 bg-red-50 text-red-600 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PropertyApprovals;