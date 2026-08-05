const complaintService = require('../services/complaintService');

exports.createComplaint = async (req, res) => {
    try {
        const complaint = await complaintService.fileNewComplaint(req.user.id, req.body);
        res.status(201).json({ success: true, message: "Complaint filed successfully", data: complaint });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAdminComplaints = async (req, res) => {
    try {
        const data = await complaintService.getAllComplaintsForAdmin();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        await complaintService.resolveComplaint(req.params.id, status, remarks);
        res.status(200).json({ success: true, message: "Complaint status updated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};