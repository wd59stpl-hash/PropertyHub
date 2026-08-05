const buyerRepository = require('../repositories/buyerRepository');

exports.getDashboardData = async (userId) => {
    const stats = await buyerRepository.getBuyerStats(userId);
    const activities = await buyerRepository.getRecentActivities(userId);
    
    return {
        stats: {
            wishlistCount: stats.wishlistCount, 
            visitsPending: stats.pendingVisits,
            newAlerts: stats.newAlerts
        },
        activities
    };
};