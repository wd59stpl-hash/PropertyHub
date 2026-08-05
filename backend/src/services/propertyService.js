const Property = require('../model/Property');
exports.createProperty = async (data, userId, imageUrls, videoUrl) => {
    return await Property.create({
        ...data,
        owner: userId,
        images: imageUrls,
        video: videoUrl,
        newProject: data.newProject === 'true' || data.newProject === true,
        parking: data.parking === 'true' || data.parking === true,
        readyToMove: data.readyToMove === 'true' || data.readyToMove === true,
        price: Number(data.price),
        area: Number(data.area),
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,

        location: {
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            geo: {
                type: 'Point',
                coordinates: [parseFloat(data.lng) || 0, parseFloat(data.lat) || 0]
            }
        }
    });
};
exports.queryProperties = async (query) => {
    const { newProject, search, type, minPrice, maxPrice, bedrooms, sort, page = 1, limit = 9 } = query;
    
    let queryObj = { isApproved: true };
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        queryObj.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { "location.address": searchRegex },
            { "location.city": searchRegex },
            { "location.state": searchRegex },
            { "location.pincode": searchRegex }
        ];
    }

    if (newProject === 'true' || newProject === true) {
        queryObj.newProject = true;
    }

    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.$gte = Number(minPrice);
        if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    if (type && type !== '') queryObj.type = type.toLowerCase();
    if (bedrooms) queryObj.bedrooms = bedrooms === '4+' ? { $gte: 4 } : Number(bedrooms);

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
        Property.find(queryObj)
            .populate('owner', 'name') 
            .sort(sort || '-createdAt')
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Property.countDocuments(queryObj)
    ]);

    return {
        properties,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page) 
    };
};
exports.getPropertyDetail = async (id) => {
    return await Property.findById(id).populate('owner', 'name email');
};

exports.getMyListings = async (userId, page = 1, limit = 8) => {
    const skip = (page - 1) * limit;    
    const [properties, total] = await Promise.all([
        Property.find({ owner: userId })
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Property.countDocuments({ owner: userId })
    ]);

    return { 
        properties, 
        total, 
        pages: Math.ceil(total / limit), 
        currentPage: Number(page) 
    };
};
exports.updateUserProperty = async (propertyId, userId, updateBody, newImages, newVideo) => {
    if (newImages.length > 0) updateBody.images = newImages;
    if (newVideo) updateBody.video = newVideo;
    const updated = await Property.findOneAndUpdate(
        { _id: propertyId, owner: userId }, 
        { $set: updateBody },
        { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new Error('Unauthorized or Not Found');
    return updated;
};

exports.deleteUserProperty = async (id, userId) => {
    const property = await Property.findOne({ _id: id, owner: userId });
    if (!property) throw new Error('Unauthorized or Property Not Found');
    return await Property.findByIdAndDelete(id);
};
