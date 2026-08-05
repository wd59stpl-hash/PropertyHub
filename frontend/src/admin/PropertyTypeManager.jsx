import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyTypes, addPropertyType, removePropertyType } from '../redux/slices/propertyTypeSlice';
import { Plus, Trash2, Home, Loader2, LayoutGrid, Sparkles, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyTypeManager = () => {
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const { list: types, loading } = useSelector((state) => state.propertyTypes);

    useEffect(() => {
        dispatch(fetchPropertyTypes());
    }, [dispatch]);

    const handleAdd = () => {
        if (!name.trim()) return toast.error("Classification name is required");
        dispatch(addPropertyType({ name: name.trim() })).then((res) => {
            if (!res.error) {
                toast.success(`${name} added to architecture list`, {
                    style: { background: '#080E4B', color: '#fff', borderRadius: '10px' }
                });
                setName("");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#080E4B] rounded-2xl flex items-center justify-center text-[#C5A358] shadow-xl shadow-blue-900/20">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <span className="text-[#C5A358] text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Administrative Control</span>
                        <h1 className="text-3xl font-serif text-[#080E4B]">Architecture Classifications</h1>
                    </div>
                </div>
                <div className="px-4 py-2 bg-[#F8F9FB] border border-gray-100 rounded-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Total Categories: <span className="text-[#080E4B]">{types?.length || 0}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 mb-12 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A358] transition-colors">
                        <Sparkles size={20} />
                    </div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-[#F8F9FB] border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-[#C5A358]/20 font-bold text-[#080E4B] placeholder:text-gray-300 transition-all shadow-inner"
                        placeholder="Define new type (e.g. Waterfront Villa, Sky Loft)"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="group relative overflow-hidden bg-[#080E4B] text-white px-12 py-5 rounded-[2rem] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-[#C5A358] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-[#080E4B]">Add Entry</span>
                                <Plus size={18} className="group-hover:text-[#080E4B]" />
                            </>
                        )}
                    </div>
                </button>
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {types?.map((type) => (
                        <motion.div
                            key={type._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-3xl flex items-center justify-between shadow-sm border border-gray-100 group hover:border-[#C5A358] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-[#C5A358] rounded-full group-hover:animate-pulse" />
                                <span className="font-bold text-[#080E4B] text-sm tracking-wide">{type.name}</span>
                            </div>

                            <button
                                onClick={() => dispatch(removePropertyType(type._id))}
                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                title="Remove Classification"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {types?.length === 0 && !loading && (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 border-dashed">
                    <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-6">
                        <LayoutGrid className="text-gray-200" size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-[#080E4B]">Taxonomy Empty</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto font-medium">No architecture types defined. Use the portal above to add new classifications.</p>
                </div>
            )}

            {!loading && types?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-3">
                    <div className="w-1 h-1 bg-[#C5A358] rounded-full" />
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">System Real-time Sync Active</p>
                    <div className="w-1 h-1 bg-[#C5A358] rounded-full" />
                </div>
            )}
        </div>
    );
};

export default PropertyTypeManager;