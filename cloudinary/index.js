const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    api_key: process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET,
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:'campground-images',
        allowedFormats: ['jpeg','png', 'jpg']
    }
    
})

module.exports = {
    storage , cloudinary
}