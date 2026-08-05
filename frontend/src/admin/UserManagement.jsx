import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser, updateUserStatus } from '../redux/slices/adminSlice';
import { 
    Search, Mail, Loader2, Calendar, Trash2, 
    ShieldCheck, UserMinus, UserCheck, ShieldAlert,
    Filter, ArrowUpRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Pagination from '../components/common/Pagination';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users = [], usersPagination, loading } = useSelector((state) => state.admin);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchAllUsers({ 
                page, 
                search, 
                role: roleFilter === "all" ? "" : roleFilter,
                limit: 10 
            }));
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, page, search, roleFilter]);

    const handleStatusToggle = (id, currentStatus) => {
        dispatch(updateUserStatus({ id, isSuspended: !currentStatus }));
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to permanently remove ${name}?`)) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="max-w-7xl mx-auto p-6 space-y-8 font-sans"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Executive Oversight</span>
                    <h1 className="text-4xl font-serif text-[#080E4B]">User Management</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select 
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            className="pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#080E4B] outline-none shadow-sm cursor-pointer hover:border-[#C5A358] transition-all appearance-none"
                        >
                            <option value="all">All Classifications</option>
                            <option value="seller">Sellers Only</option>
                            <option value="buyer">Buyers Only</option>
                        </select>
                    </div>

                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search identity..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#C5A358]/20 font-medium text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8F9FB] border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Member Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Classification</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Registration</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Integrity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#C5A358]" size={40}/>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Accessing Secure Database...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <ShieldAlert className="mx-auto text-gray-200 mb-4" size={48} />
                                        <h3 className="text-xl font-serif text-[#080E4B]">No Identities Found</h3>
                                        <p className="text-gray-400 text-sm mt-2">Adjust your filters or search query.</p>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode='wait'>
                                    {users.map((user) => (
                                        <motion.tr 
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-[#F8F9FB]/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#C5A358] bg-[#080E4B] shadow-lg shadow-blue-900/10">
                                                        {user.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#080E4B] text-sm">{user.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5 leading-none">
                                                            <Mail size={10}/> {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                    user.role === 'seller' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px]">
                                                    <Calendar size={13} className="text-[#C5A358]"/>
                                                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] ${user.isVerified ? 'text-emerald-500' : 'text-gray-300'}`}>
                                                    <ShieldCheck size={14} className={user.isVerified ? "opacity-100" : "opacity-20"}/>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2  transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => handleStatusToggle(user._id, user.isSuspended)}
                                                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                                                            user.isSuspended 
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' 
                                                            : 'bg-white border-gray-100 text-gray-400 hover:text-[#080E4B] hover:border-[#080E4B]'
                                                        }`}
                                                        title={user.isSuspended ? "Activate User" : "Suspend User"}
                                                    >
                                                        {user.isSuspended ? <UserCheck size={16} /> : <UserMinus size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                                                        title="Revoke Access"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-[#F8F9FB] border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Syncing <span className="text-[#080E4B]">{users.length}</span> Records in Real-time
                    </p>
                    
                    <Pagination 
                        current={usersPagination?.currentPage || 1}
                        total={usersPagination?.totalPages || 1}
                        onPageChange={(p) => setPage(p)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagement;