const propertyService = require('../services/propertyService');
const { propertySchema } = require('../validations/propertyValidation');

exports.createProperty = async (req, res) => {
    try {
        const { error } = propertySchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const imageUrls = req.files?.images?.map(f => f.path) || [];
        const videoUrl = req.files?.video ? req.files.video[0].path : "";

        const property = await propertyService.createProperty(req.body, req.user.id, imageUrls, videoUrl);
        res.status(201).json({ success: true, property });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllProperties = async (req, res) => { 
    try {
        const result = await propertyService.queryProperties(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProperty = async (req, res) => {
    try {
        const property = await propertyService.getPropertyDetail(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Not Found" });
        res.status(200).json({ success: true, data: property });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid ID" });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await propertyService.getMyListings(
            req.user.id, 
            page || 1, 
            limit || 8
        );
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const imageUrls = req.files?.images?.map(f => f.path) || [];
        const videoUrl = req.files?.video ? req.files.video[0].path : null;

        const property = await propertyService.updateUserProperty(req.params.id, req.user.id, req.body, imageUrls, videoUrl);
        res.status(200).json({ success: true, message: "Updated", data: property });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        await propertyService.deleteUserProperty(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};