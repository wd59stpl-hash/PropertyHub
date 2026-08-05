const PropertyType = require('../model/PropertyType');

exports.getAllTypes = async (req, res) => {
    try {
        const types = await PropertyType.find({ isActive: true });
        res.status(200).json({ 
            success: true, 
            data: types  
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addPropertyType = async (req, res) => {
    try {
        const type = await PropertyType.create(req.body);
        res.status(201).json({ success: true, data: type });
    } catch (error) {
        res.status(400).json({ success: false, message: "This type already exists" });
    }
};

exports.deletePropertyType = async (req, res) => {
    try {
        await PropertyType.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Type deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error deleting type" });
    }
};