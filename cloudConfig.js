//<<<<-----this file using on routes/listing.js------>>>>

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//BACKEND ko Cloudinay account k saath jodna(yani Configure karna)-->
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


//storage ko apne liye defined karna--->>
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});


module.exports = {
    cloudinary,
    storage,
};