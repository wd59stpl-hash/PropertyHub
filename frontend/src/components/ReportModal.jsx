import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendComplaint } from '../redux/slices/complaintSlice';
import { X, AlertTriangle, Loader2, ShieldAlert, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ReportModal = ({ isOpen, onClose, propertyId, propertyName }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await dispatch(sendComplaint({
                property: propertyId,
                ...formData
            }));
            if (!res.error) {
                toast.success("Report submitted to our compliance team.");
                onClose();
            }
        } catch (error) {
            toast.error("Failed to send report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#080E4B]/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-10"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-8 md:p-10">

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <span className="text-[#C5A358] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Compliance Office</span>
                                <h2 className="text-xl font-serif text-[#080E4B]">Report Inaccuracy</h2>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]">
                                    {propertyName}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="group">
                                <label className="text-[9px] font-black uppercase text-[#C5A358] tracking-[0.2em] mb-2 ml-1 block">Reason for flag</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full pl-5 pr-10 py-3.5 bg-[#F8F9FB] border border-gray-100 rounded-2xl focus:border-[#C5A358] focus:ring-0 outline-none font-bold text-xs text-[#080E4B] appearance-none cursor-pointer transition-all"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="">Select a Category</option>
                                        <option value="Fraudulent Listing">Fraudulent Listing</option>
                                        <option value="Incorrect Information">Incorrect Information</option>
                                        <option value="Misleading Media">Misleading Media/Video</option>
                                        <option value="Seller Behavior">Seller Behavior</option>
                                        <option value="Duplicate Listing">Duplicate Listing</option>
                                        <option value="Other">Other Issues</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black uppercase text-[#C5A358] tracking-[0.2em] mb-2 ml-1 block">Description of Issue</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full p-5 bg-[#F8F9FB] border border-gray-100 rounded-2xl focus:border-[#C5A358] focus:ring-0 outline-none font-medium text-xs text-gray-600 resize-none transition-all placeholder:text-gray-300 h-32"
                                    placeholder="Please provide specific details to help our team investigate..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#080E4B] hover:bg-red-600 text-white font-black rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-[0.3em] group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <AlertTriangle size={16} className="group-hover:animate-bounce" />
                                            Submit Formal Report
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[8px] text-gray-300 uppercase tracking-widest mt-6 leading-relaxed">
                                    All reports are confidential. Our team will review this listing within 12 business hours.
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReportModal;