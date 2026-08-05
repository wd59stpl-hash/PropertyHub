const Wishlist = require('../model/Wishlist');
const Booking = require('../model/Booking');
const Notification = require('../model/Notification');
const Property = require('../model/Property');


exports.getBuyerStats = async (userId) => {
    const [wishlistCount, pendingVisits, newAlerts] = await Promise.all([
        Wishlist.countDocuments({ user: userId }),
        Booking.countDocuments({ buyer: userId, status: 'Pending' }),
        Notification.countDocuments({ recipient: userId, isRead: false })
    ]);
    return { wishlistCount, pendingVisits, newAlerts };
};

exports.getRecentActivities = async (userId) => {
    const latestWishlist = await Wishlist.find({ user: userId })
        .populate('property', 'name')
        .sort('-createdAt')
        .limit(2);
    const latestBookings = await Booking.find({ buyer: userId })
        .populate('property', 'name')
        .populate('seller', 'name')
        .sort('-updatedAt')
        .limit(2);
    const latestNotifications = await Notification.find({ recipient: userId })
        .sort('-createdAt')
        .limit(2);

    let activities = [
        ...latestWishlist.map(w => ({ 
            type: 'wishlist', 
            text: `You saved '${w.property?.name}' to your wishlist`, 
            date: w.createdAt 
        })),
        ...latestBookings.map(b => ({ 
            type: 'booking', 
            text: b.status === 'Accepted' ? `Seller ${b.seller?.name} accepted your visit request` : `Visit for '${b.property?.name}' is ${b.status}`, 
            date: b.updatedAt 
        })),
        ...latestNotifications.map(n => ({ 
            type: 'notification', 
            text: n.message, 
            date: n.createdAt 
        }))
    ];
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
};