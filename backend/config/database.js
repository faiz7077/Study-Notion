const mongoose = require('mongoose');
const clgDev = require('../utils/clgDev');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config.env' });
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    clgDev("MongoDB connected successfully".cyan.underline.bold);
  } catch (err) {
    clgDev(`${err.message}`.red.underline.bold);
    process.exit(1);
  }
}



module.exports = connectDB;
