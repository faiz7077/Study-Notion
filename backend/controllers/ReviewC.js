const Review = require('../models/Review');
const Course = require('../models/Course');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc      Get all reviews
// @route     GET /api/v1/reviews/getallreviews
// @access    Public // VERIFIED
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .sort({ rating: 'desc' })
      .populate({
        path: 'user',
        select: 'firstName lastName email avatar',
      })
      .populate({
        path: 'course',
        select: 'title _id',
      })
      .exec();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching all reviews', 500));
  }
};

// @desc      Get a review
// @route     POST /api/v1/reviews/getreview
// @access    Public // VERIFIED
exports.getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return next(new ErrorResponse('Invalid request', 404));
    }

    const review = await Review.findById(reviewId)
      .populate({
        path: 'user',
        select: 'firstName lastName email avatar',
      })
      .populate({
        path: 'course',
        select: 'title _id',
      });

    if (!review) {
      return next(new ErrorResponse('No such review found', 404));
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching Review. Please try again'));
  }
};


// @desc      Get all reviews of a course
// @route     POST /api/v1/reviews/getreviewsofcourse
// @access    Public // VERIFIED
exports.getReviewsOfCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return next(new ErrorResponse("Invalid request", 404));
    }

    const course = await Course.findById(courseId).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName email avatar',
      },
    }).populate({
      path: 'reviews',
      populate: {
        path: 'course',
        select: 'title _id',
      },
    });

    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    return res.status(200).json({
      success: true,
      count: course.reviews.length,
      data: course.reviews,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching Reviews. Please try again', 500));
  }
};


// @desc      Create Review
// @route     POST /api/v1/createreview
// @access    Private/Student // VERIFIED
exports.createReview = async (req, res, next) => {
  try {
    const { review, rating, courseId } = req.body;
    const userId = req.user.id;
    if (!(review && rating && courseId)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    // Check if user is enrolled or not
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    if (!course.studentsEnrolled.includes(userId)) {
      return next(new ErrorResponse('Student is not enrolled in the course', 404));
    }

    // check if student already reviewed the course
    const alreadyReviewed = await Review.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return next(new ErrorResponse('Course is already reviewed by the student', 404));
    }

    // create review
    const reviewDetails = await Review.create({
      review,
      rating,
      course: courseId,
      user: userId,
    });

    // update user
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { reviews: reviewDetails._id },
      },
      { new: true }
    );

    // update course
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { reviews: reviewDetails._id },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: reviewDetails,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create Review. Please try again', 500));
  }
};

// @desc      Delete a review
// @route     DELETE /api/v1/deletereview
// @access    Private/Student+Admin // VERIFIED
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.body;
    if (!reviewId) {
      return next(new ErrorResponse('Invalid request', 404));
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ErrorResponse('No such review found', 404));
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse('Not authorized for this task', 404));
    }

    // update course and user
    await User.findByIdAndUpdate(
      review.user,
      {
        $pull: { reviews: review._id },
      },
      { new: true }
    );

    await Course.findByIdAndUpdate(
      review.course,
      {
        $pull: { reviews: review._id },
      },
      { new: true }
    );

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: 'Review deleted successfully',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to delete Review. Please try again'));
  }
};
