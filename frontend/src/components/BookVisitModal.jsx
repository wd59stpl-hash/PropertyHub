import React, { useState } from 'react';
import { X, Calendar, Clock, Send, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/slices/bookingSlice';
import { motion, AnimatePresence } from 'framer-motion';

const BookVisitModal = ({ isOpen, onClose, propertyId, propertyName }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.bookings);

    const [formData, setFormData] = useState({
        visitDate: '',
        visitTime: '',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createBooking({
            propertyId,
            ...formData
        })).then((res) => {
            if (!res.error) onClose();
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#080E4B]/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
                >
                    <div className="p-8 md:p-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-[#C5A358] text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">Private Tour</span>
                                <h2 className="text-2xl font-serif text-[#080E4B] leading-tight">Schedule Your Visit</h2>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 truncate max-w-[250px]">
                                    {propertyName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="text-[9px] font-black uppercase text-[#C5A358] tracking-[0.2em] mb-2 ml-1 block">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A358] transition-colors" size={16} />
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FB] border border-gray-100 rounded-2xl focus:border-[#C5A358] focus:ring-0 outline-none font-bold text-xs text-[#080E4B] transition-all"
                                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[9px] font-black uppercase text-[#C5A358] tracking-[0.2em] mb-2 ml-1 block">Time Window</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A358] transition-colors" size={16} />
                                    <select
                                        required
                                        className="w-full pl-12 pr-10 py-3.5 bg-[#F8F9FB] border border-gray-100 rounded-2xl focus:border-[#C5A358] focus:ring-0 outline-none font-bold text-xs text-[#080E4B] appearance-none transition-all cursor-pointer"
                                        onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                                    >
                                        <option value="">Select a Slot</option>
                                        <option value="10:00 AM - 12:00 PM">Morning (10AM - 12PM)</option>
                                        <option value="12:00 PM - 03:00 PM">Afternoon (12PM - 3PM)</option>
                                        <option value="03:00 PM - 06:00 PM">Evening (3PM - 6PM)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black uppercase text-[#C5A358] tracking-[0.2em] mb-2 ml-1 block">Special Requests (Optional)</label>
                                <textarea
                                    placeholder="Tell us any specific requirements..."
                                    className="w-full p-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl focus:border-[#C5A358] focus:ring-0 outline-none font-medium text-xs text-gray-600 h-24 resize-none transition-all placeholder:text-gray-300"
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#080E4B] hover:bg-[#C5A358] text-white hover:text-[#080E4B] font-black rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-[0.3em] overflow-hidden group relative"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Request Invitation
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[8px] text-gray-300 uppercase tracking-widest mt-4">
                                    Our consultant will contact you within 24 hours.
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookVisitModal;