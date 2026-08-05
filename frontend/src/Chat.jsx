import React, { useState } from 'react';
import { 
    Search, MoreVertical, Send, Paperclip, 
    Image as ImageIcon, Smile, Phone, Video, CheckCheck, Circle 
} from 'lucide-react';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(1);

    const conversations = [
        { id: 1, name: 'Amit Sharma', role: 'Buyer', lastMsg: 'Is the price negotiable?', time: '10:30 AM', online: true, unread: 2, avatar: 'AS' },
        { id: 2, name: 'Priya Verma', role: 'Seller', lastMsg: 'I have shared the floor plan.', time: 'Yesterday', online: false, unread: 0, avatar: 'PV' },
        { id: 3, name: 'PropertyHub Support', role: 'Admin', lastMsg: 'Your property is now live!', time: 'Oct 20', online: true, unread: 0, avatar: 'PH' },
    ];

    const messages = [
        { id: 1, text: "Hello! I saw your 'Luxury Sky Villa' listing.", sender: 'them', time: '10:25 AM' },
        { id: 2, text: "Yes, it is currently available. Would you like to schedule a visit?", sender: 'me', time: '10:26 AM' },
        { id: 3, text: "Yes, I am interested. Is the price negotiable?", sender: 'them', time: '10:30 AM' },
    ];

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-50 flex overflow-hidden border-t border-slate-100">
            <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Messages</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map((chat) => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat.id)}
                            className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${activeChat === chat.id ? 'bg-blue-50 border-blue-600' : 'border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border-2 border-white shadow-sm">
                                    {chat.avatar}
                                </div>
                                {chat.online && <Circle size={12} fill="#10b981" className="text-emerald-500 absolute bottom-0 right-0 border-2 border-white rounded-full" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-slate-800 truncate text-sm">{chat.name}</h4>
                                    <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-slate-500 truncate italic">{chat.lastMsg}</p>
                                    {chat.unread > 0 && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{chat.unread}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-slate-50 relative">
                <header className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">AS</div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Amit Sharma</h3>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                                <Circle size={8} fill="currentColor"/> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button className="hover:text-blue-600 transition-colors"><Phone size={20}/></button>
                        <button className="hover:text-blue-600 transition-colors"><Video size={20}/></button>
                        <button className="hover:text-slate-800 transition-colors"><MoreVertical size={20}/></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-80">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm relative ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className={`flex items-center gap-1 mt-1 justify-end ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    <span className="text-[10px] font-bold">{msg.time}</span>
                                    {msg.sender === 'me' && <CheckCheck size={12}/>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                        <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                            <button className="text-slate-400 hover:text-blue-600"><Paperclip size={20}/></button>
                            <button className="text-slate-400 hover:text-blue-600"><ImageIcon size={20}/></button>
                        </div>
                        <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent border-none outline-none text-sm font-medium p-2" />
                        <div className="flex items-center gap-2">
                            <button className="text-slate-400 hover:text-amber-500"><Smile size={20}/></button>
                            <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                <Send size={20} fill="currentColor"/>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;