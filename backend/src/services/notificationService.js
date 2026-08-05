const Notification = require('../model/Notification');
const socketUtil = require('../utils/socket');
const notificationRepository = require('../repositories/notificationRepository');

exports.sendAndSaveNotification = async (recipientId, data) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            title: data.title,
            message: data.message,
            type: data.type,
            property: data.propertyId,
            sender: data.senderId || null
        });
        socketUtil.emitToUser(recipientId.toString(), 'new_notification', notification);
        return notification;
    } catch (error) {
        console.error("Notification Service Error:", error);
    }
};

exports.getUserNotifications = async (userId) => {
    const notifications = await notificationRepository.getNotificationsByUser(userId);
    const unreadCount = await notificationRepository.getUnreadCount(userId);
    return { notifications, unreadCount };
};

exports.markNotificationRead = async (notificationId) => {
    return await notificationRepository.markAsRead(notificationId);
};

