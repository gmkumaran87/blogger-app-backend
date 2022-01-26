const cloudinary = require("cloudinary").v2;

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUpload = async(image) => {
    try {
        const result = await cloudinary.uploader.upload(image);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
};

module.exports = imageUpload;