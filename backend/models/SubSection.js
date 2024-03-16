const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // timeDuration will be in seconds
  timeDuration: {
    type: String,
    required: true,
    default: '0'
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
  },
});

module.exports = mongoose.model('SubSection', subSectionSchema);
