import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Image, CheckCheck, Loader2 } from 'lucide-react';
import api from '../services/api';

const Chat = ({ receiverId, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io(import.meta.env.VITE_BASE_URL, { transports: ['websocket'] });
        socket.current.emit('join', currentUser.id);

        socket.current.on('receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
            socket.current.emit('message_seen', { senderId: msg.senderId });
        });

        socket.current.on('user_status', (users) => setOnlineUsers(users));
        socket.current.on('display_typing', () => setIsTyping(true));
        socket.current.on('hide_typing', () => setIsTyping(false));

        return () => socket.current.disconnect();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const msgData = { receiverId, senderId: currentUser.id, content: input };
        setMessages([...messages, msgData]);
        await api.post('/chat/send', msgData);
        socket.current.emit('send_message', msgData);
        socket.current.emit('stop_typing', { receiverId });
        setContent("");
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-[3rem] border shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex justify-between">
                <div>
                    <h3 className="font-black">{receiverName}</h3>
                    <p className="text-[10px]">{onlineUsers.includes(receiverId) ? '🟢 Online' : '⚪ Offline'}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[70%] ${m.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                            {m.content}
                            <div className="text-[8px] mt-1 text-right opacity-70">
                                {m.senderId === currentUser.id && <CheckCheck size={10} className="inline ml-1" />}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && <p className="text-xs italic text-slate-400">Typing...</p>}
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                <button type="button" className="p-3 text-slate-400 hover:text-blue-600"><Image size={20}/></button>
                <input 
                    value={input} 
                    onChange={(e) => {
                        setContent(e.target.value);
                        socket.current.emit('typing', { senderId: currentUser.id, receiverId });
                    }}
                    className="flex-1 bg-slate-100 rounded-2xl px-4 outline-none" 
                    placeholder="Type a message..." 
                />
                <button className="bg-blue-600 text-white p-3 rounded-2xl"><Send size={20}/></button>
            </form>
        </div>
    );
};

export default Chat;