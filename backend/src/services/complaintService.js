const complaintRepository = require('../repositories/complaintRepository');

exports.fileNewComplaint = async (userId, complaintData) => {
    const formattedData = {
        user: userId,
        property: complaintData.property,
        subject: complaintData.subject,
        message: complaintData.description 
    };
    return await complaintRepository.create(formattedData);
};
exports.getAllComplaintsForAdmin = async () => {
    return await complaintRepository.findAll();
};

exports.resolveComplaint = async (id, status, remarks) => {
    const complaint = await complaintRepository.updateStatus(id, status, remarks);
    if (!complaint) throw new Error('Complaint not found');
    return complaint;
};