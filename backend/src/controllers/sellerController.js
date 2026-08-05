const reviewService = require('../services/reviewService');
const sellerService = require('../services/sellerService');
exports.getMyReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.getSellerReviews(req.user.id);
        res.status(200).json({ success: true, data: reviews });
    } catch (error) { next(error); }
};


exports.getSellerDashboard = async (req, res) => {
    try {
        const data = await sellerService.getDashboardData(req.user._id);
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};