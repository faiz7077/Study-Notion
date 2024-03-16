const mongoose = require('mongoose');
const CourseProgress = require('../models/CourseProgress');
const SubSection = require('../models/SubSection');

// @desc      Mark subsection as completed
// @route     POST /api/v1/courseprogress/marksubsectionascompleted
// @access    Private/student
exports.markSubSectionAsCompleted = async (req, res, next) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    if (!(courseId && subSectionId)) {
      return next(new Error('Invalid request', 404));
    }

    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return next(new ErrorResponse('No such lecture found', 404));
    }

    const courseProgress = await CourseProgress.findOneAndUpdate(
      {
        userId,
        courseId,
      },
      { $push: { completedVideos: subSectionId } },
      { new: true }
    );

    if (!courseProgress) {
      return next(new ErrorResponse('No such course progress found', 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        completedVideos: courseProgress.completedVideos,
      }
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetch enrolled course data', 500));
  }
};
