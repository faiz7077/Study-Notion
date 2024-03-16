const Section = require('../models/Section');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const clgDev = require('../utils/clgDev');

// @desc      Create a section
// @route     POST /api/v1/sections
// @access    Private/instructor  // VERIFIED
exports.createSection = async (req, res, next) => {
  try {
    const { title, courseId } = req.body;

    if (!(title && courseId)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return next(new ErrorResponse('No such course found', 404));
    }

    // only instructor of course can add section in course
    if (req.user.id !== courseDetails.instructor.toString()) {
      return next(new ErrorResponse('User not authorized', 404));
    }

    const section = await Section.create({
      title,
      course: courseDetails._id,
      user: req.user.id
    });

    // update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { sections: section._id },
      },
      { new: true }
    ).populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections'
        },
      })
      .exec();

    // return the updated course
    res.status(201).json({
      success: true,
      data: updatedCourse,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create section. Please try again', 500));
  }
};

// @desc      Update a section
// @route     PUT /api/v1/sections
// @access    Private/instructor 
exports.updateSection = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const { sectionId, title } = req.body;

    if (!(sectionId && title)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return next(new ErrorResponse('No such section found', 404));
    }

    // only section creator (instructor) can update section
    if (section.user.toString() !== instructorId) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }


    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { title },
      {
        runValidators: true,
        new: true,
      }
    );


    const updatedCourse = await Course.findByIdAndUpdate(
      section.course,
    ).populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections'
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to update section. Please try again', 500));
  }
};

// @desc      Delete a section
// @route     DELETE /api/v1/sections
// @access    Private/instructor 
exports.deleteSection = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const { sectionId } = req.body;

    if (!sectionId) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return next(new ErrorResponse('No such section found', 404));
    }

    // only section creator (instructor) can update section
    if (section.user.toString() !== instructorId) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }

    if (section.user.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized to do this task', 404));
    }

    // update course
    const updatedCourse = await Course.findByIdAndUpdate(
      section.course,
      {
        $pull: { sections: section._id },
      },
      { new: true }
    ).populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections'
        },
      })
      .exec();

    // await Section.findByIdAndDelete(sectionId);
    await section.deleteOne();

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to delete section. Please try again', 500));
  }
};
