import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../services/api';
import { Send, User, CheckCheck, Loader2 } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_BASE_URL;
const BuyerMessages = () => {
    const { user } = useSelector(state => state.auth);
    const currentUserId = user?._id || user?.id;

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const socket = useRef();
    const scrollRef = useRef();
    const activeChatRef = useRef(null);

    const fetchInbox = async () => {
        const res = await api.get('chat/conversations');
        setConversations(res.data.data);
    };

    useEffect(() => {
        if (!currentUserId) return;
        socket.current = io(SOCKET_URL);
        socket.current.emit('join', currentUserId.toString());

        socket.current.on('user_online', (users) => setOnlineUsers(users));
        
        socket.current.on('receive_message', (msg) => {
            const isRelevant = activeChatRef.current && (msg.sender.toString() === activeChatRef.current.id || msg.receiver.toString() === activeChatRef.current.id);
            if (isRelevant) {
                setMessages(prev => (prev.find(m => m._id === msg._id) ? prev : [...prev, msg]));
                if(msg.sender.toString() !== currentUserId.toString()) {
                    socket.current.emit('mark_read', { senderId: msg.sender, receiverId: currentUserId });
                }
            }
            fetchInbox();
        });

        socket.current.on('messages_read_update', (data) => {
            if(activeChatRef.current && data.readerId.toString() === activeChatRef.current.id) {
                setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
            }
        });

        socket.current.on('display_typing', (data) => {
            if(activeChatRef.current && data.senderId.toString() === activeChatRef.current.id) setIsTyping(true);
        });
        socket.current.on('hide_typing', () => setIsTyping(false));

        fetchInbox();
        return () => socket.current.disconnect();
    }, [currentUserId]);

    const openChat = async (conv) => {
        const targetId = conv._id.toString();
        const targetData = { id: targetId, name: conv.userInfo.name };
        setSelectedUser(targetData);
        activeChatRef.current = targetData;

        const res = await api.get(`chat/messages/${targetId}`);
        setMessages(res.data.data);
        socket.current.emit('mark_read', { senderId: targetId, receiverId: currentUserId });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if(!text.trim() || !selectedUser) return;
        const tempMsg = { _id: Date.now(), sender: currentUserId, content: text, createdAt: new Date(), isRead: false };
        setMessages(prev => [...prev, tempMsg]);
        socket.current.emit('send_message', { senderId: currentUserId, receiverId: selectedUser.id, content: text });
        setText("");
        socket.current.emit('stop_typing', { receiverId: selectedUser.id });
    };

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    return (
        <div className="flex h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 m-4">
            <div className="w-1/3 border-r bg-slate-50 flex flex-col">
                <div className="p-6 font-black text-xl border-b bg-white">Messages</div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div key={conv._id} onClick={() => openChat(conv)} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white border-b ${selectedUser?.id === conv._id ? 'bg-white border-r-4 border-blue-600 shadow-md' : ''}`}>
                            <div className="relative w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                {conv.userInfo.name[0]}
                                {onlineUsers.includes(conv._id.toString()) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-sm truncate">{conv.userInfo.name}</h4>
                                <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-50">
                {selectedUser ? (
                    <>
                        <div className="p-4 bg-white border-b font-bold flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser.id) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            {selectedUser.name}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender.toString() === currentUserId.toString() ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 px-4 rounded-2xl text-sm max-w-[70%] shadow-sm ${m.sender.toString() === currentUserId.toString() ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none'}`}>
                                        {m.content}
                                        <div className="text-[9px] mt-1 text-right opacity-50 flex items-center justify-end gap-1">
                                            {new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                            {m.sender.toString() === currentUserId.toString() && (
                                                <span className={m.isRead ? "text-blue-300 font-bold" : "text-white"}>{m.isRead ? "✓✓" : "✓"}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="text-xs text-slate-400 italic">Typing...</div>}
                            <div ref={scrollRef} />
                        </div>
                        <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                            <input value={text} onChange={(e) => {
                                setText(e.target.value);
                                socket.current.emit('typing', { senderId: currentUserId, receiverId: selectedUser.id });
                            }} placeholder="Write a message..." className="flex-1 bg-slate-100 rounded-xl px-4 py-3 outline-none" />
                            <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:scale-105 transition-all"><Send size={20}/></button>
                        </form>
                    </>
                ) : (
                    <div className="m-auto text-slate-400 flex flex-col items-center gap-2">
                        <User size={48} className="opacity-20" />
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default BuyerMessages;