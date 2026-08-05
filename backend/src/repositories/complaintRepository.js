const Complaint = require('../model/Complaint');

exports.create = async (data) => {
    return await Complaint.create(data);
};

exports.findAll = async () => {
    return await Complaint.find()
        .populate('user', 'name email')
        .populate('property', 'name price')
        .sort('-createdAt');
};

exports.findById = async (id) => {
    return await Complaint.findById(id).populate('user', 'name email');
};

exports.updateStatus = async (id, status, remarks) => {
    return await Complaint.findByIdAndUpdate(
        id, 
        { status, adminRemarks: remarks }, 
        { new: true }
    );
};