const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const { OTP_TEMPLATE, RESET_PASSWORD_TEMPLATE } = require('../utils/emailTemplates');
const sendEmail = require('../utils/sendEmail');
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

exports.register = async (userData) => {
    const existing = await userRepository.findUserByEmail(userData.email);
    if (existing) throw new Error("Email already registered");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; 
    const user = await userRepository.createUser({ ...userData, otp, otpExpire });
    await sendEmail({
        email: userData.email,
        subject: "Verify your PropertyHub Account",
        message: OTP_TEMPLATE(otp, userData.name) 
    });
    const tokens = generateTokens(user._id);
    return { user, tokens }; 
};


exports.login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid Credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Credentials');

    const tokens = generateTokens(user._id);
    return { user, tokens };
};

exports.forgotPassword = async (email, protocol, host) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found with this email');

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await userRepository.updateUserSecretFields(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: Date.now() + 10 * 60 * 1000
    });

    const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset your PropertyHub Password",
            message: RESET_PASSWORD_TEMPLATE(resetUrl, user.name)
        });
    } catch (error) {
        await userRepository.updateUserSecretFields(user._id, {
            resetPasswordToken: undefined,
            resetPasswordExpire: undefined
        });
        throw new Error('Email could not be sent');
    }
};

exports.resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findUserByResetToken(hashedToken);

    if (!user) throw new Error('Invalid or expired token');

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return user;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
    const user = await userRepository.findUserById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');

    user.password = newPassword;
    await user.save();
};
exports.verifyOTP = async (email, otp) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isVerified) {
        throw new Error("Email is already verified. Please login.");
    }
    if (user.otp !== otp) {
        throw new Error("Invalid verification code");
    }

    if (user.otpExpire < Date.now()) {
        throw new Error("Verification code has expired. Please register again.");
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    const tokens = generateTokens(user._id);
    return { user, tokens };
};