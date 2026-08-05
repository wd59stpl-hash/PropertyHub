const reviewRepo = require('../repositories/reviewRepository');

exports.addReview = async (reviewData, buyerId, imageUrls) => {
    const existing = await reviewRepo.checkExisting(buyerId, reviewData.propertyId);
    if (existing) throw new Error('You have already reviewed this property');
    const data = {
        property: reviewData.propertyId,
        buyer: buyerId,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        images: imageUrls
    };

    return await reviewRepo.create(data);
};

exports.getPropertyReviews = async (propertyId) => {
    return await reviewRepo.findByProperty(propertyId);
};exports.getSellerReviews = async (sellerId) => {
    const allReviews = await reviewRepo.findBySeller(sellerId);
    return allReviews.filter(rev => rev.property !== null);
};