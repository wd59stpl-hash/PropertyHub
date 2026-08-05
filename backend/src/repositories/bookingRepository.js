const Booking = require('../model/Booking');

exports.create = async (data) => {
    return await Booking.create(data);
};

exports.findForSeller = async (sellerId) => {
    return await Booking.find({ seller: sellerId })
        .populate('property', 'name price images location')
        .populate('buyer', 'name email')
        .sort('-createdAt');
};

exports.findForBuyer = async (buyerId) => {
    return await Booking.find({ buyer: buyerId })
        .populate('property', 'name price location images')
        .populate('seller', 'name email')
        .sort('-createdAt');
};

exports.findById = async (id) => {
    return await Booking.findById(id);
};

exports.updateStatus = async (id, status) => {
    return await Booking.findByIdAndUpdate(id, { status }, { new: true });
};