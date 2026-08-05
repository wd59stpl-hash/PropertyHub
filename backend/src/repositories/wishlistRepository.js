const Wishlist = require('../model/Wishlist');

exports.checkExists = async (userId, propertyId) => {
    return await Wishlist.findOne({ user: userId, property: propertyId });
};

exports.addToWishlist = async (userId, propertyId) => {
    return await Wishlist.create({ user: userId, property: propertyId });
};

exports.removeFromWishlist = async (userId, propertyId) => {
    return await Wishlist.findOneAndDelete({ user: userId, property: propertyId });
};

exports.getUserWishlist = async (userId) => {
    return await Wishlist.find({ user: userId }).populate('property');
};