const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    trim: true,
    required: true,
  },
  rating: {
    type: Number,
    min: [1, 'Please give a rating between 1 and 5'],
    max: [5, 'Please give a rating between 1 and 5'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.statics.getAverageRating = async function (courseId) {
  console.log(this);
  try {
    const obj = await this.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $group: {
          _id: '$course',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    try {
      await this.model('Course').findByIdAndUpdate(courseId, {
        averageRating: obj.length ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

reviewSchema.post('save', async function (doc) {
  await this.constructor.getAverageRating(this.course);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function (next) {
  await this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);
