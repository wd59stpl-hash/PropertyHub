const chatRepo = require('../repositories/chatRepository');
const { encrypt, decrypt } = require('../utils/encryption');
const User = require('../model/User'); 
const notifHelper = require('../utils/notificationHelper');

class ChatService {
    async saveAndEncryptMessage(senderId, receiverId, content) {
        const encryptedContent = encrypt(content);
        const message = await chatRepo.createMessage({
            sender: senderId,
            receiver: receiverId,
            content: encryptedContent
        });

        const sender = await User.findById(senderId).select('name');
        await notifHelper.createAndSendNotification(receiverId, {
            title: `New Message from ${sender?.name || 'User'} 💬`,
            message: content.length > 50 ? content.substring(0, 50) + "..." : content, 
            type: 'NEW_INQUIRY', 
            sender: senderId
        });
        const plainMsg = message.toObject();
        plainMsg.content = content; 
        return plainMsg;
    }

    async getDecryptedMessages(senderId, receiverId) {
        const messages = await chatRepo.findChatHistory(senderId, receiverId);
        return messages.map(msg => {
            const m = msg.toObject();
            m.content = decrypt(m.content);
            return m;
        });
    }

    async getInboxList(userId) {
        const list = await chatRepo.getAggregatedConversations(userId);
        return list.map(item => {
            item.lastMessage = decrypt(item.lastMessage);
            return item;
        });
    }

    async markMessagesAsRead(senderId, receiverId) {
        return await chatRepo.updateReadStatus(senderId, receiverId);
    }
}

module.exports = new ChatService();