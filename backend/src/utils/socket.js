const { Server } = require('socket.io');
let io;
const onlineUsers = new Map(); 

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: { 
                origin: "*", 
                methods: ["GET", "POST", "PATCH", "DELETE"], 
                credentials: true 
            },
            transports: ['websocket', 'polling']
        });

        io.on('connection', (socket) => {
            socket.on('join', (userId) => {
                if (!userId) return;
                const uid = userId.toString();
                socket.join(uid); 
                onlineUsers.set(uid, socket.id);
                io.emit('user_online', Array.from(onlineUsers.keys()));
            });

            socket.on('send_message', async (data) => {
                const { senderId, receiverId, content } = data;
                try {
                    const chatService = require('../services/chatService');
                    const newMessage = await chatService.saveAndEncryptMessage(senderId, receiverId, content);
                    io.to(receiverId.toString()).emit('receive_message', newMessage);
                    io.to(senderId.toString()).emit('receive_message', newMessage);
                } catch (err) {
                    console.error("Socket Send Message Error:", err);
                }
            });
            socket.on('mark_read', async ({ senderId, receiverId }) => {
                try {
                    const chatService = require('../services/chatService');
                    await chatService.markMessagesAsRead(senderId, receiverId);
                    
                    io.to(senderId.toString()).emit('messages_read_update', { readerId: receiverId });
                } catch (err) {
                    console.error("❌ Socket Mark Read Error:", err);
                }
            });

            socket.on('typing', ({ senderId, receiverId }) => {
                io.to(receiverId.toString()).emit('display_typing', { senderId });
            });

            socket.on('stop_typing', ({ senderId, receiverId }) => {
                io.to(receiverId.toString()).emit('hide_typing', { senderId });
            });

            socket.on('disconnect', () => {
                for (let [uid, sid] of onlineUsers.entries()) {
                    if (sid === socket.id) {
                        onlineUsers.delete(uid);
                        break;
                    }
                }
                io.emit('user_online', Array.from(onlineUsers.keys()));
            });
        });

        return io;
    },

    emitToUser: (userId, event, data) => {
        if (io && userId) {
            const uid = userId.toString();
            io.to(uid).emit(event, data);
        } else {
            console.log("Cannot emit notification: Socket.io not initialized or userId missing");
        }
    },
    sendNotification: (userId, notificationData) => {
        if (io && userId) {
            const uid = userId.toString();
            io.to(uid).emit('new_notification', notificationData);
        }
    }
};