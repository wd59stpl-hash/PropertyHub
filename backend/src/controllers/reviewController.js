const reviewService = require('../services/reviewService');

exports.createReview = async (req, res, next) => {
    try {
        const imageUrls = req.files?.map(f => f.path) || [];
        const review = await reviewService.addReview(req.body, req.user.id, imageUrls);
        
        res.status(201).json({ 
            success: true, 
            message: "Review added successfully", 
            data: review 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getPropertyReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getPropertyReviews(req.params.propertyId);
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};