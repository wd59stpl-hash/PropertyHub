const User = require('../model/User');

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email }).select('+password');
};

exports.createUser = async (userData) => {
    return await User.create(userData);
};

exports.findUserById = async (id) => {
    return await User.findById(id).select('-password');
};

exports.updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

exports.findUserByResetToken = async (hashedToken) => {
    return await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
};

exports.updateUserSecretFields = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.findUserByResetToken = async (token) => {
    return await User.findOne({ 
        resetPasswordToken: token, 
        resetPasswordExpire: { $gt: Date.now() } 
    });
};