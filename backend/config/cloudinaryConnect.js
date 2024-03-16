const cloudinary = require('cloudinary').v2;
const clgDev = require('../utils/clgDev');
// require('dotenv').config({ path: './config.env' });
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  } catch (err) {
    clgDev(err.message);
  }
};

module.exports = cloudinaryConnect;
