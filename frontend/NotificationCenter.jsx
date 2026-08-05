import React, { useState } from 'react';
import { 
    Bell, CheckCircle2, MessageSquare, Calendar, 
    AlertCircle, Trash2, MoreHorizontal, Check 
} from 'lucide-react';

const NotificationCenter = () => {
    const [filter, setFilter] = useState('all');

    const [notifications, setNotifications] = useState([
        { id: 1, type: 'visit', title: 'Visit Scheduled!', desc: 'Seller Rajesh accepted your visit request for Sky Villa.', time: '2 mins ago', unread: true, icon: <Calendar className="text-blue-600"/>, color: 'bg-blue-50' },
        { id: 2, type: 'chat', title: 'New Message', desc: 'Amit sent you a message: "Is the price negotiable?"', time: '1 hour ago', unread: true, icon: <MessageSquare className="text-purple-600"/>, color: 'bg-purple-50' },
        { id: 3, type: 'success', title: 'Listing Approved!', desc: 'Your property "Modern Loft" is now live on the platform.', time: '5 hours ago', unread: false, icon: <CheckCircle2 className="text-emerald-600"/>, color: 'bg-emerald-50' },
        { id: 4, type: 'alert', title: 'Price Drop Alert', desc: 'A property in your wishlist just dropped its price by 5%.', time: 'Yesterday', unread: false, icon: <AlertCircle className="text-amber-600"/>, color: 'bg-amber-50' },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotes = filter === 'unread' ? notifications.filter(n => n.unread) : notifications;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tight">
                        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                            <Bell size={28} className="text-white"/>
                        </div>
                        Notifications
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">Manage your alerts and stay updated with your property journey.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            Unread
                        </button>
                    </div>
                    <button 
                        onClick={markAllRead}
                        className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest"
                    >
                        <Check size={16}/> Mark all as read
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                {filteredNotes.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {filteredNotes.map((note) => (
                            <div 
                                key={note.id} 
                                className={`p-8 flex items-start gap-6 transition-all hover:bg-slate-50/80 group relative ${note.unread ? 'bg-blue-50/30' : ''}`}
                            >
                                {note.unread && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-400"></div>}
                                <div className={`w-14 h-14 ${note.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
                                    {note.icon}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-lg font-bold tracking-tight ${note.unread ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {note.title}
                                        </h4>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{note.time}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{note.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => deleteNotification(note.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                    <button className="p-2 text-slate-300 hover:text-slate-900 rounded-lg">
                                        <MoreHorizontal size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-100">
                            <Bell className="text-slate-200" size={40}/>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800">All caught up!</h4>
                            <p className="text-slate-400 text-sm mt-1">You don't have any new notifications right now.</p>
                        </div>
                        <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/20">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                        <AlertCircle size={24} className="text-blue-400"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight">Push Notifications</h4>
                        <p className="text-slate-400 text-xs mt-1">Enable desktop alerts to never miss a site visit request.</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-blue-700 transition-all whitespace-nowrap shadow-lg shadow-blue-500/30">
                    Enable Alerts
                </button>
            </div>
        </div>
    );
};

export default NotificationCenter;