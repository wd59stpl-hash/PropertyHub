const categoryRepository = require('../repositories/categoryRepository');

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.findAllActive();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const category = await categoryRepository.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: "Category already exists" });
    }
};