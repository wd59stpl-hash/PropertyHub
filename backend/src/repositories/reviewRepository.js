const Review = require('../model/Review');

exports.create = async (data) => {
    return await Review.create(data);
};

exports.findByProperty = async (propertyId) => {
    return await Review.find({ property: propertyId })
        .populate('buyer', 'name avatar')
        .sort('-createdAt');
};

exports.checkExisting = async (userId, propertyId) => {
    return await Review.findOne({ buyer: userId, property: propertyId });
};

exports.delete = async (reviewId) => {
    return await Review.findByIdAndDelete(reviewId);
};exports.findBySeller = async (sellerId) => {
    return await Review.find()
        .populate({
            path: 'property',
            match: { owner: sellerId }, 
            select: 'name price images'
        })
        .populate('buyer', 'name email avatar')
        .sort('-createdAt');
};