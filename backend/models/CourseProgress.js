const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSection'
    }
  ]
});

module.exports = mongoose.model('CourseProgress', courseProgressSchema);

