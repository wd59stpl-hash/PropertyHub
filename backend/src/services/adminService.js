const Property = require('../model/Property');
const adminRepository = require('../repositories/adminRepository');
const socketUtil = require('../utils/socket'); 
const notifHelper = require('../utils/notificationHelper');

exports.getDashboardStats = async () => {
    const counts = await adminRepository.getStatsCount();
    const marketValueResult = await adminRepository.calculateMarketValue();
    return {
        users: { total: counts.totalUsers, sellers: counts.totalSellers, buyers: counts.totalBuyers },
        properties: { total: counts.totalProperties, pending: counts.pendingApprovals },
        bookings: counts.totalBookings,
        estimatedMarketValue: marketValueResult[0]?.total || 0
    };
};

exports.getPendingProperties = async (params) => {
    return await adminRepository.findPending(params);
};

exports.approveOrRejectProperty = async (propertyId, status) => {
    const property = await Property.findByIdAndUpdate(
        propertyId, 
        { isApproved: status }, 
        { new: true }
    );

    if (property) {
        await notifHelper.createAndSendNotification(property.owner, {
            title: status ? "Property Approved!" : "Property Rejected",
            message: `Your property "${property.name}" has been ${status ? 'approved' : 'rejected'}.`,
            type: status ? 'PROPERTY_APPROVED' : 'PROPERTY_REJECTED',
            propertyId: property._id
        });
    }

    return property;
};
exports.getUsersList = async (params) => {
    return await adminRepository.findAllUsers(params);
};

exports.toggleUserSuspension = async (userId, status) => {
    return await adminRepository.updateUserStatus(userId, status);
};

exports.manageCategory = async (name, description) => {
    return await adminRepository.createCategory({ name, description });
};

exports.fetchCategories = async () => {
    return await adminRepository.getAllCategories();
};

exports.getFullSalesReport = async () => {
    const stats = await adminRepository.getRevenueStats();
    return {
        revenue: stats[0]?.totalRevenue || 0,
        salesCount: stats[0]?.totalSales || 0
    };
};

exports.getComplaints = async (params) => {
    return await adminRepository.findAllComplaints(params);
};
exports.removeUser = async (userId) => {
    const deletedUser = await adminRepository.deleteUserById(userId);
    if (!deletedUser) throw new Error('User not found');
    return deletedUser;
};

exports.getFullAnalyticsReport = async () => {
    const [revenueTrend, userDist, propertyInv, complaintStats] = await Promise.all([
        adminRepository.getRevenueTrend(),
        adminRepository.getUserDistribution(),
        adminRepository.getPropertyInventory(),
        adminRepository.getComplaintStats()
    ]);

    return {
        revenueTrend,
        userDistribution: userDist,
        inventory: propertyInv,
        complaints: complaintStats,
        generatedAt: new Date()
    };
};