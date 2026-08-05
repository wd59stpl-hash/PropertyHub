const wishlistService = require('../services/wishlistService');
const purchaseService = require('../services/purchaseService');
const buyerService = require('../services/buyerService');

exports.handleWishlist = async (req, res, next) => {
    try {
        const result = await wishlistService.toggleWishlist(req.user.id, req.body.propertyId);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getMyWishlist = async (req, res, next) => {
    try {
        const properties = await wishlistService.getWishlist(req.user.id);
        res.status(200).json({ success: true, data: properties });
    } catch (error) { next(error); }
};

exports.getMyPurchases = async (req, res, next) => {
    try {
        const purchases = await purchaseService.getPurchasedProperties(req.user.id);
        res.status(200).json({ success: true, data: purchases });
    } catch (error) { next(error); }
};
exports.getDashboard = async (req, res) => {
    try {
        const data = await buyerService.getDashboardData(req.user._id);
        
        res.status(200).json({
            success: true,
            data: {
                userName: req.user.name,
                ...data
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard", 
            error: error.message 
        });
    }
};
