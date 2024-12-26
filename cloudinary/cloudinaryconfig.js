const cloudinary= require('cloudinary').v2;
const {CloudinaryStorage}= require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloudname,
    api_key: process.env.APIkey,
    api_secret: process.env.APIsecret
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

module.exports={
    cloudinary, 
    storage
}