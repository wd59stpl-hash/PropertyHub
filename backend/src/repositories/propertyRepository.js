const Property = require('../model/Property');

exports.create = async (propertyData) => {
    return await Property.create(propertyData);
};

exports.findAll = async (queryObj, sortBy, skip, limit) => {
    return await Property.find(queryObj)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'name');
};

exports.count = async (queryObj) => {
    return await Property.countDocuments(queryObj);
};

exports.findById = async (id) => {
    return await Property.findById(id).populate('owner', 'name email');
};

exports.delete = async (id) => {
    return await Property.findByIdAndDelete(id);
};