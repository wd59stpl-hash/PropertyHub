import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom'; 

const SocketHandler = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    const currentUserId = user?._id || user?.id;

    useEffect(() => {
        if (isAuthenticated && currentUserId) {
            const socket = io(import.meta.env.VITE_BASE_URL, {
                transports: ['websocket'],
                withCredentials: true
            });

            socket.on('connect', () => {
                socket.emit('join', currentUserId.toString());
            });
            socket.on('receive_message', (msg) => {
                const isMessageFromOthers = msg.sender.toString() !== currentUserId.toString();
                const isNotOnChatPage = location.pathname !== '/seller/messages';

                if (isMessageFromOthers && isNotOnChatPage) {
                    toast.custom((t) => (
                        <div className={`${t.visible ? 'animate-bounce' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-blue-600`}>
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-bold text-gray-900">
                                            New Message 💬
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 truncate">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-100">
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-medium text-blue-600 hover:text-blue-500"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ));

                    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
                }
            });

            socket.on('new_notification', (data) => {
                toast.success(data.message, {
                    icon: data.type === 'PROPERTY_SOLD' ? '💰' : '🔔',
                    duration: 6000
                });
                new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
            });

            return () => socket.disconnect();
        }
    }, [isAuthenticated, currentUserId, location.pathname]);

    return null;
};

export default SocketHandler;