import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit3, Trash2, ExternalLink, Home, Plus } from 'lucide-react';
import { getSellerProperties, deleteProperty } from '../../redux/slices/propertySlice';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Pagination from '../../components/common/Pagination'; 

const ManageListings = () => {
    const dispatch = useDispatch();
    const { sellerProperties, sellerPagination, loading } = useSelector((state) => state.properties);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getSellerProperties({ page, limit: 5 }));
    }, [dispatch, page]);

    const handleDelete = (id) => {
        if (window.confirm("This will permanently remove the estate. Proceed?")) {
            dispatch(deleteProperty(id));
        }
    };

    const formatPrice = (num) => {
        if (!num) return "₹0";
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Portfolio</span>
                    <h2 className="text-4xl font-serif text-[#080E4B]">Manage Estates</h2>
                </div>
                <Link to="/seller/add-property" className="bg-[#080E4B] text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-[#C5A358] transition-all">
                    <Plus size={18}/> <span className="text-[11px] font-black uppercase">New Listing</span>
                </Link>
            </div>

            {sellerProperties?.length === 0 && !loading ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                    <Home className="mx-auto text-gray-200 mb-4" size={48} />
                    <h3 className="text-xl font-serif text-[#080E4B]">No Properties</h3>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Estate Details</th>
                                <th className="px-6 py-6">Valuation</th>
                                <th className="px-6 py-6 text-center">Status</th>
                                <th className="px-10 py-6 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sellerProperties?.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <img src={item.images[0]} className="w-14 h-14 rounded-xl object-cover" />
                                            <div>
                                                <p className="font-bold text-[#080E4B]">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.location?.city}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-7 font-serif text-[#080E4B]">{formatPrice(item.price)}</td>
                                    <td className="px-6 py-7 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {item.isApproved ? 'Published' : 'Under Review'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/seller/edit-property/${item._id}`} className="p-2 text-gray-400 hover:text-[#080E4B]"><Edit3 size={18}/></Link>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="bg-[#F8F9FB] border-t border-gray-100 px-10 py-2">
                        <Pagination 
                            current={sellerPagination.currentPage} 
                            total={sellerPagination.pages} 
                            onPageChange={(p) => setPage(p)} 
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ManageListings;