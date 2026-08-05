const Property = require('../model/Property');
const adminService = require('../services/adminService');

exports.getAdminStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPendingProperties = async (req, res) => {
    try {
        const result = await adminService.getPendingProperties({ 
            page: parseInt(req?.query?.page) || 1, 
            limit: parseInt(req?.query?.limit) || 10 
        });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.approveProperty = async (req, res) => {
    try {
        const { status } = req.body; 
        const { id } = req.params;   
        const updatedProperty = await adminService.approveOrRejectProperty(id, status);
        
        res.status(200).json({ 
            success: true, 
            message: status ? "Property Approved Successfully" : "Property Rejected Successfully",
            data: updatedProperty
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAllUsers = async (req, res) => {
    try {

        const result = await adminService.getUsersList({ 
            page: parseInt(req?.query?.page) || 1, 
            limit: parseInt(req?.query?.limit) || 10,
            search: req?.query?.search || ""
        });

        res.status(200).json({ 
            success: true, 
            ...result 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { isSuspended } = req.body;
        await adminService.toggleUserSuspension(req.params.id, isSuspended);
        res.status(200).json({ success: true, message: "User status updated successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await adminService.manageCategory(name, description);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await adminService.fetchCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRevenueReport = async (req, res) => {
    try {
        const report = await adminService.getFullSalesReport();
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComplaintsList = async (req, res) => {
    try {
        const result = await adminService.getComplaints({ 
            page: parseInt(req?.query?.page) || 1, 
            limit: parseInt(req?.query?.limit) || 10 
        });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        await adminService.removeUser(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAnalyticsReport = async (req, res) => {
    try {
        const reportData = await adminService.getFullAnalyticsReport();
        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};