import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_BASE_URL;

const ChatWidget = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const currentUserId = user?._id || user?.id;

    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const socket = useRef();
    const scrollRef = useRef();
    const activeChatRef = useRef(null); 
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const handleOpenChat = (e) => { 
            setActiveChat(e.detail); 
            activeChatRef.current = e.detail;
            setIsOpen(true); 
        };
        window.addEventListener('openChat', handleOpenChat);
        return () => window.removeEventListener('openChat', handleOpenChat);
    }, []);

    useEffect(() => {
        if (isAuthenticated && currentUserId) {
            socket.current = io(SOCKET_URL);
            socket.current.emit('join', currentUserId.toString());
            socket.current.on('user_online', (users) => setOnlineUsers(users));
            socket.current.on('receive_message', (msg) => {
                const sId = msg.sender.toString();
                if (activeChatRef.current && (sId === activeChatRef.current.id)) {
                    setMessages(prev => [...prev, msg]);
                }
            });
            socket.current.on('display_typing', (data) => { 
                if(activeChatRef.current && data.senderId.toString() === activeChatRef.current.id.toString()) setIsTyping(true);
            });
            socket.current.on('hide_typing', () => setIsTyping(false));
            return () => socket.current.disconnect();
        }
    }, [isAuthenticated, currentUserId]);

    useEffect(() => {
        if (activeChat?.id && isOpen) {
            const fetchHistory = async () => {
                setLoading(true);
                const res = await api.get(`chat/messages/${activeChat.id}`);
                setMessages(res.data.data);
                setLoading(false);
            };
            fetchHistory();
        }
    }, [activeChat, isOpen]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const handleInput = (val) => {
        setNewMessage(val);
        socket.current.emit('typing', { senderId: currentUserId, receiverId: activeChat.id });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.current.emit('stop_typing', { senderId: currentUserId, receiverId: activeChat.id });
        }, 2000);
    };

    const send = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        socket.current.emit('send_message', { senderId: currentUserId, receiverId: activeChat.id, content: newMessage });
        setNewMessage("");
    };

    if (!isAuthenticated || !activeChat) return null;
    const isOnline = onlineUsers.includes(activeChat.id.toString());

    return (
        <div className="fixed bottom-8 right-8 z-[1000] font-sans">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)} 
                className="w-16 h-16 bg-[#080E4B] text-[#C5A358] rounded-full shadow-[0_10px_30px_rgba(8,14,75,0.3)] flex items-center justify-center border border-[#C5A358]/20 relative group"
            >
                <div className="absolute inset-0 rounded-full bg-[#C5A358] opacity-0 group-hover:opacity-10 transition-opacity" />
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                {!isOpen && isOnline && <span className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-[#080E4B]"></span>}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[380px] h-[580px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100"
                    >
                        <div className="p-6 bg-[#080E4B] text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A358] opacity-5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-[#C5A358] font-serif italic text-xl">
                                        {activeChat.name[0]}
                                    </div>
                                    {isOnline && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#080E4B] rounded-full"></div>}
                                </div>
                                <div>
                                    <h4 className="font-serif text-base tracking-wide flex items-center gap-2">
                                        {activeChat.name}
                                        <ShieldCheck size={14} className="text-[#C5A358]" />
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                        {isOnline ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-white/40" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F9FB] no-scrollbar">
                            {loading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#C5A358]" /></div>
                            ) : (
                                messages.map((m, i) => {
                                    const isMe = m.sender.toString() === currentUserId.toString();
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0, x: isMe ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i} 
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm
                                                ${isMe 
                                                    ? 'bg-[#080E4B] text-white rounded-tr-none' 
                                                    : 'bg-white text-[#080E4B] border border-gray-100 rounded-tl-none'}
                                            `}>
                                                {m.content}
                                                <div className={`flex items-center justify-end gap-1 mt-2 opacity-30 text-[9px] font-bold`}>
                                                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && <CheckCheck size={12} className={m.isRead ? 'text-[#C5A358]' : ''} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Consultant is typing</span>
                                </motion.div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={send} className="p-5 bg-white border-t border-gray-50 flex items-center gap-3">
                            <input 
                                value={newMessage} 
                                onChange={(e) => handleInput(e.target.value)} 
                                placeholder="Write a message..." 
                                className="flex-1 bg-[#F8F9FB] rounded-2xl px-5 py-4 text-xs outline-none border border-transparent focus:border-[#C5A358]/20 transition-all placeholder:text-gray-300 font-medium" 
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#080E4B] text-[#C5A358] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10"
                            >
                                <Send size={18} />
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ChatWidget;