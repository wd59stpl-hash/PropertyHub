import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, Info, Calendar, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteNotification, clearAllNotifications } from '../redux/slices/notificationSlice';
import { toast } from 'react-hot-toast';

const NotificationSidebar = ({ isOpen, onClose, notifications }) => {
    const dispatch = useDispatch();

    const handleDeleteOne = (e, id) => {
        e.stopPropagation();
        dispatch(deleteNotification(id));
        toast.success("Deleted");
    };

    const handleClearAll = () => {
        if (window.confirm("Clear all alerts?")) {
            dispatch(clearAllNotifications());
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        className="fixed right-0 top-0 h-full w-full max-w-[360px] bg-white shadow-2xl z-[1000] flex flex-col"
                    >
                        <div className="p-6 bg-[#080E4B] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-[#C5A358]" />
                                <h2 className="text-lg font-serif">Notifications</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                        </div>

                        {notifications && notifications.length > 0 && (
                            <div className="p-3 bg-red-50 border-b border-red-100 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{notifications.length} Alerts</span>
                                <button onClick={handleClearAll} className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">
                                    <Trash2 size={12} /> Clear All
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {notifications && notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div key={notif._id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm relative group">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-[#C5A358]">
                                                <Info size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-[#080E4B] pr-5">{notif.title}</h4>
                                                    <button onClick={(e) => handleDeleteOne(e, notif._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                                <p className="text-[9px] text-gray-300 font-bold mt-2 uppercase">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                                    <AlertCircle size={40} className="mb-2 opacity-20" />
                                    <p className="text-sm font-serif italic text-gray-400">Your inbox is clear.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationSidebar;