const Property = require('../model/Property');
const Booking = require('../model/Booking');
const Payment = require('../model/Payment');

exports.getSellerDashboardStats = async (sellerId) => {
    const propertyStats = await Property.aggregate([
        { $match: { owner: sellerId } },
        { 
            $group: { 
                _id: null, 
                totalViews: { $sum: "$views" },
                totalProperties: { $sum: 1 }, 
                activeListings: { $sum: { $cond: [{ $eq: ["$isApproved", true] }, 1, 0] } }
            } 
        }
    ]);

    const visitRequests = await Booking.countDocuments({ seller: sellerId, status: 'Pending' });

    const sellerProperties = await Property.find({ owner: sellerId }).select('_id');
    const propertyIds = sellerProperties.map(p => p._id);

    const revenueStats = await Payment.aggregate([
        { $match: { property: { $in: propertyIds }, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return {
        totalViews: propertyStats[0]?.totalViews || 0,
        totalProperties: propertyStats[0]?.totalProperties || 0, 
        activeListings: propertyStats[0]?.activeListings || 0,
        visitRequests,
        totalRevenue: revenueStats[0]?.total || 0
    };
};