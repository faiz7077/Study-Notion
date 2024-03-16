const cloudinary = require('cloudinary').v2;
const clgDev = require('./clgDev');

const cloudUploader = async (file, folder, height, quality) => {
  const options = {
    folder,
    public_id: file.name,
    resource_type: 'auto',
  };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  try {
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, options);
    return uploadResponse;
  } catch (err) {
    throw err;
  }
};

module.exports = cloudUploader;
