const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image');
        
        return {
            folder: 'PropertyHub/Properties',
            allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
            resource_type: 'auto',
            transformation: isImage ? [
                { width: 1200, height: 800, crop: "limit" }, 
                { quality: "auto:good" },
                { fetch_format: "auto" }  
            ] : []
        };
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

module.exports = { cloudinary, upload };