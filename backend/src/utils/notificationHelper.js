const Notification = require('../model/Notification');
const socketUtil = require('./socket');

/**
 * @param {String} recipientId 
 * @param {Object} data - 
 */
exports.createAndSendNotification = async (recipientId, data) => {
    try {
        const newNotif = await Notification.create({
            recipient: recipientId,
            title: data.title,
            message: data.message,
            type: data.type,
            property: data.propertyId,
            sender: data.senderId || null
        });

        socketUtil.emitToUser(recipientId.toString(), 'new_notification', newNotif);

        return newNotif;
    } catch (error) {
        console.error("Notification Error:", error.message);
    }
};