import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { Send, User, MessageSquare, Search, CheckCheck, ShieldCheck, Loader2, MoreVertical, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SellerMessages = () => {
    const { user } = useSelector(state => state.auth);
    const currentUserId = user?._id || user?.id;
    const [conversations, setConversations] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const socket = useRef();
    const scrollRef = useRef();
    const activeBuyerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const fetchInbox = async () => {
        const res = await api.get('chat/conversations');
        setConversations(res.data.data);
    };

    useEffect(() => {
        if (!currentUserId) return;
        socket.current = io(import.meta.env.VITE_BASE_URL);
        socket.current.emit('join', currentUserId.toString());

        socket.current.on('user_online', (users) => setOnlineUsers(users));

        socket.current.on('receive_message', (msg) => {
            const sId = msg.sender.toString();
            const rId = msg.receiver.toString();
            if (activeBuyerRef.current && (sId === activeBuyerRef.current.id || rId === activeBuyerRef.current.id)) {
                setMessages(prev => [...prev, msg]);
            }
            fetchInbox();
        });

        socket.current.on('display_typing', (data) => {
            if(activeBuyerRef.current && data.senderId.toString() === activeBuyerRef.current.id.toString()) setIsTyping(true);
        });
        socket.current.on('hide_typing', () => setIsTyping(false));

        fetchInbox();
        return () => socket.current.disconnect();
    }, [currentUserId]);

    const openChat = async (conv) => {
        setLoading(true);
        const buyerData = { id: conv._id.toString(), name: conv.userInfo.name };
        setSelectedBuyer(buyerData);
        activeBuyerRef.current = buyerData;
        try {
            const res = await api.get(`chat/messages/${buyerData.id}`);
            setMessages(res.data.data);
            socket.current.emit('mark_read', { senderId: buyerData.id, receiverId: currentUserId.toString() });
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (val) => {
        setText(val);
        socket.current.emit('typing', { senderId: currentUserId, receiverId: selectedBuyer.id });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.current.emit('stop_typing', { senderId: currentUserId, receiverId: selectedBuyer.id });
        }, 2000);
    };

    const send = (e) => {
        e.preventDefault();
        if(!text.trim()) return;
        socket.current.emit('send_message', { senderId: currentUserId, receiverId: selectedBuyer.id, content: text });
        setText("");
    };

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    return (
        <div className="flex h-[85vh] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 font-sans">            
            <div className="w-1/3 border-r border-gray-100 bg-[#F8F9FB] flex flex-col">
                <div className="p-8 bg-white border-b border-gray-100">
                    <h2 className="text-2xl font-serif text-[#080E4B] mb-6">Inquiries</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A358] transition-colors" size={16} />
                        <input 
                            placeholder="Find buyer..." 
                            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FB] rounded-xl text-xs font-bold text-[#080E4B] outline-none border border-transparent focus:border-[#C5A358]/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {conversations.map(conv => (
                        <div 
                            key={conv._id} 
                            onClick={() => openChat(conv)} 
                            className={`p-6 flex items-center gap-4 cursor-pointer transition-all relative
                                ${selectedBuyer?.id === conv._id 
                                    ? 'bg-white shadow-sm' 
                                    : 'hover:bg-gray-100/50'}`}
                        >
                            {selectedBuyer?.id === conv._id && (
                                <motion.div layoutId="activeInd" className="absolute left-0 w-1.5 h-12 bg-[#C5A358] rounded-r-full" />
                            )}
                            
                            <div className="relative">
                                <div className="w-14 h-14 bg-[#080E4B] rounded-2xl flex items-center justify-center font-serif italic text-xl text-[#C5A358] border border-[#C5A358]/10 shadow-inner">
                                    {conv.userInfo.name[0]}
                                </div>
                                {onlineUsers.includes(conv._id.toString()) && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={`font-bold text-sm truncate ${selectedBuyer?.id === conv._id ? 'text-[#080E4B]' : 'text-gray-500'}`}>
                                        {conv.userInfo.name}
                                    </h4>
                                    <span className="text-[9px] font-black text-gray-300 uppercase">12:45 PM</span>
                                </div>
                                <p className="text-[11px] text-gray-400 truncate font-medium">{conv.lastMessage || "Started a conversation"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
                {selectedBuyer ? (
                    <>
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#F8F9FB] rounded-xl flex items-center justify-center text-[#080E4B] border border-gray-100">
                                    <User size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#080E4B]">{selectedBuyer.name}</h3>
                                        <ShieldCheck size={14} className="text-blue-500" />
                                    </div>
                                    <p className="text-[10px] font-black text-[#C5A358] uppercase tracking-[0.2em]">
                                        {onlineUsers.includes(selectedBuyer.id) ? '● Available' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-3 text-gray-300 hover:text-[#080E4B] transition-colors"><Phone size={18} /></button>
                                <button className="p-3 text-gray-300 hover:text-[#080E4B] transition-colors"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#F8F9FB]/50 no-scrollbar">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-[#C5A358]" />
                                </div>
                            ) : (
                                messages.map((m, i) => {
                                    const isMe = m.sender.toString() === currentUserId.toString();
                                    return (
                                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm
                                                ${isMe 
                                                    ? 'bg-[#080E4B] text-white rounded-tr-none' 
                                                    : 'bg-white text-[#080E4B] border border-gray-100 rounded-tl-none'}
                                            `}>
                                                {m.content}
                                                <div className="flex items-center justify-end gap-1 mt-2 opacity-30 text-[9px] font-bold">
                                                    {isMe && <CheckCheck size={12} className={m.isRead ? 'text-[#C5A358]' : ''} />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {isTyping && (
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Buyer is typing</span>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={send} className="p-6 bg-white border-t border-gray-50 flex gap-4 items-center">
                            <input 
                                value={text} 
                                onChange={(e) => handleInput(e.target.value)} 
                                placeholder="Consult with buyer..." 
                                className="flex-1 bg-[#F8F9FB] rounded-2xl px-6 py-4 text-xs font-bold text-[#080E4B] outline-none border border-transparent focus:border-[#C5A358]/20 transition-all placeholder:text-gray-300" 
                            />
                            <button className="bg-[#080E4B] text-[#C5A358] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/10 active:scale-95 transition-transform">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="m-auto text-center space-y-4">
                        <div className="w-24 h-24 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto">
                            <MessageSquare size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-serif text-[#080E4B]">No Active Session</h3>
                        <p className="text-gray-400 text-sm max-w-xs font-medium">Select a buyer from the directory to start coordinating property visits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default SellerMessages;