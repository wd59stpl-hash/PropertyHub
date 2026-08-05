const Notification = require('../model/Notification');

exports.getNotificationsByUser = async (userId) => {
    return await Notification.find({ recipient: userId }).sort('-createdAt').limit(20);
};

exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

exports.getUnreadCount = async (userId) => {
    return await Notification.countDocuments({ recipient: userId, isRead: false });
};
exports.deleteNotification = async (id) => {
    return await Notification.findByIdAndDelete(id);
};

exports.deleteAll = async (userId) => {
    return await Notification.deleteMany({ recipient: userId });
};