const Property = require('../model/Property');

exports.create = async (data, session) => {
    return await Property.create([data], { session });
};

exports.findById = async (id) => {
    return await Property.findById(id).populate('owner', 'name email');
};

exports.findAll = async (queryObj, sort, skip, limit) => {
    return await Property.find(queryObj)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name');
};

exports.count = async (queryObj) => {
    return await Property.countDocuments(queryObj);
};