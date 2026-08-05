const chatService = require('../services/chatService');

exports.getMessages = async (req, res) => {
    try {
        const data = await chatService.getDecryptedMessages(req.user.id, req.params.receiverId);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const data = await chatService.getInboxList(req.user.id);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};