const Message = require('../model/Message');

class ChatRepository {
    async createMessage(data) {
        return await Message.create(data);
    }

    async findChatHistory(senderId, receiverId) {
        return await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });
    }

    async updateReadStatus(senderId, receiverId) {
        return await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { isRead: true }
        );
    }

    async getAggregatedConversations(userId) {
        const mongoose = require('mongoose');
        const uid = new mongoose.Types.ObjectId(userId);
        return await Message.aggregate([
            { $match: { $or: [{ sender: uid }, { receiver: uid }] } },
            { $sort: { createdAt: -1 } },
            { $group: {
                _id: { $cond: [{ $eq: ["$sender", uid] }, "$receiver", "$sender"] },
                lastMessage: { $first: "$content" },
                lastTime: { $first: "$createdAt" },
                unreadCount: { 
                    $sum: { $cond: [{ $and: [{ $eq: ["$receiver", uid] }, { $eq: ["$isRead", false] }] }, 1, 0] } 
                }
            }},
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userInfo" } },
            { $unwind: "$userInfo" },
            { $project: { "userInfo.password": 0, "userInfo.__v": 0 } }
        ]);
    }
}

module.exports = new ChatRepository();