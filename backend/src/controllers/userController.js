const User = require('../model/User');

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