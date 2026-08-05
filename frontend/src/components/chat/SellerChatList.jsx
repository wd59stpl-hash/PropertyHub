import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerChatList = ({ onSelectUser }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/api/chat/conversations');
                setConversations(res.data.data);
            } catch (err) {
                console.error("Error fetching conversations", err);
            }
        };
        fetchConversations();
    }, []);

    return (
        <div className="w-full max-w-md bg-white border rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-100 font-bold border-b">Recent Chats</div>
            <div className="divide-y overflow-y-auto max-h-[500px]">
                {conversations.map((conv) => (
                    <div 
                        key={conv._id} 
                        onClick={() => onSelectUser({ id: conv._id, name: conv.userInfo.name })}
                        className="p-4 hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">{conv.userInfo.name}</p>
                            <p className="text-xs text-gray-500 truncate w-40">{conv.lastMessage}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">
                            {new Date(conv.lastTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerChatList;