const User = require('../model/User');
const authService = require('../services/authService');
const { registerValidation, loginValidation } = require('../validations/authValidation');
exports.registerUser = async (req, res) => {
    try {
        const { error } = registerValidation.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { user, tokens } = await authService.register(req.body);
        if (tokens && tokens.refreshToken) {
            res.cookie('refreshToken', tokens.refreshToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Please verify OTP.",
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            accessToken: tokens ? tokens.accessToken : null
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { user, tokens } = await authService.login(req.body.email, req.body.password);

        res.cookie('refreshToken', tokens.refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            success: true,
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            accessToken: tokens.accessToken
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};


exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, bio, address } = req.body;
        const updateData = { name, phone, bio, address };
        if (req.file) {
            updateData.profilePic = req.file.path; 
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        await authService.forgotPassword(req.body.email, req.protocol, req.get('host'));
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        await authService.resetPassword(req.params.token, req.body.password);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        await authService.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.verifyEmail = async (req, res) => { 
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const { user, tokens } = await authService.verifyOTP(email, otp);
        res.cookie('refreshToken', tokens.refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            accessToken: tokens.accessToken
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};