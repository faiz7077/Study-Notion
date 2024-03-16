const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSection',
    },
  ],
});

module.exports = mongoose.model('Section', sectionSchema);
