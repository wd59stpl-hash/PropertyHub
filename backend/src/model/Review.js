const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }], 
}, { timestamps: true });

reviewSchema.index({ property: 1, buyer: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = async function(propertyId) {
    const stats = await this.aggregate([
        { $match: { property: propertyId } },
        { 
            $group: { 
                _id: '$property', 
                nRating: { $sum: 1 }, 
                avgRating: { $avg: '$rating' } 
            } 
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Property').findByIdAndUpdate(propertyId, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].nRating
        });
    } else {
        await mongoose.model('Property').findByIdAndUpdate(propertyId, {
            averageRating: 0,
            totalReviews: 0
        });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.property);
});

module.exports = mongoose.model('Review', reviewSchema);