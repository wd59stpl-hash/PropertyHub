const sellerRepository = require('../repositories/sellerRepository');
const Property = require('../model/Property');

exports.getDashboardData = async (sellerId) => {
    const stats = await sellerRepository.getSellerDashboardStats(sellerId);
    const listings = await Property.find({ owner: sellerId })
        .sort('-createdAt')
        .limit(5);

    return { stats, listings };
};