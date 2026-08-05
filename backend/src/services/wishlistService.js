const wishlistRepo = require('../repositories/wishlistRepository');
const Property = require('../model/Property');

exports.toggleWishlist = async (userId, propertyId) => {
    const exists = await wishlistRepo.checkExists(userId, propertyId);
    if (exists) {
        await wishlistRepo.removeFromWishlist(userId, propertyId);
        return { message: "Removed", added: false };
    } else {
        await wishlistRepo.addToWishlist(userId, propertyId);
        const property = await Property.findById(propertyId);
        return { message: "Saved", added: true, property };
    }
};

exports.getWishlist = async (userId) => {
    const list = await wishlistRepo.getUserWishlist(userId);
    return list.map(item => item.property).filter(p => p !== null);
};