const User = require('../model/User');
const Property = require('../model/Property');
const Booking = require('../model/Booking');
const Payment = require('../model/Payment');
const Category = require('../model/Category');
const Complaint = require('../model/Complaint');
exports.getStatsCount = async () => {
    const [totalUsers, totalSellers, totalBuyers, totalProperties, pendingApprovals, totalBookings] = await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        User.countDocuments({ role: 'seller' }),
        User.countDocuments({ role: 'buyer' }),
        Property.countDocuments(),
        Property.countDocuments({ isApproved: false }),
        Booking.countDocuments()
    ]);

    return { totalUsers, totalSellers, totalBuyers, totalProperties, pendingApprovals, totalBookings };
};

exports.calculateMarketValue = async () => {
    return await Property.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
};

exports.findAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
    const skip = (page - 1) * limit;
    const query = {
        role: { $ne: 'admin' },
        ...(search && {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        })
    };

    const [data, totalItems] = await Promise.all([
        User.find(query)
            .select('-password') 
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        User.countDocuments(query)
    ]);

    return {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page)
    };
};

exports.updateUserStatus = async (id, isSuspended) => {
    return await User.findByIdAndUpdate(id, { isSuspended }, { new: true });
};

exports.deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};

exports.findPending = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const query = { isApproved: false };

    const [data, totalItems] = await Promise.all([
        Property.find(query)
            .populate('owner', 'name email') 
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        Property.countDocuments(query)
    ]);

    return {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page)
    };
};

exports.updateApproval = async (id, status) => {
    return await Property.findByIdAndUpdate(id, { isApproved: status }, { new: true });
};

exports.getRevenueTrend = async () => {
    return await Payment.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
            $group: {
                _id: { 
                    month: { $month: "$createdAt" }, 
                    year: { $year: "$createdAt" } 
                },
                totalRevenue: { $sum: "$amount" },
                salesCount: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};

exports.getRevenueStats = async () => {
    return await Payment.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { 
            $group: { 
                _id: null, 
                totalRevenue: { $sum: "$amount" }, 
                totalSales: { $sum: 1 } 
            } 
        }
    ]);
};

exports.getPropertyInventory = async () => {
    return await Property.aggregate([
        {
            $group: {
                _id: { category: "$category", type: "$type" },
                count: { $sum: 1 },
                avgPrice: { $avg: "$price" }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

exports.getUserDistribution = async () => {
    return await User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
};

exports.findAllComplaints = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await Promise.all([
        Complaint.find()
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        Complaint.countDocuments()
    ]);

    return {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page)
    };
};

exports.getComplaintStats = async () => {
    return await Complaint.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
};

exports.createCategory = async (data) => {
    return await Category.create(data);
};

exports.getAllCategories = async () => {
    return await Category.find().sort('name');
};