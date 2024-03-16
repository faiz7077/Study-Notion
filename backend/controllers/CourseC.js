const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const cloudUploader = require('../utils/cloudUploader');
const clgDev = require('../utils/clgDev');
const ErrorResponse = require('../utils/ErrorResponse');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const CourseProgress = require('../models/CourseProgress');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// @desc      Get all published courses
// @route     GET /api/v1/courses
// @access    Public
exports.getAllPublishedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ status: 'Published' }).populate('instructor').populate('category').exec();

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetch all published courses', 500));
  }
};

// @desc      Get single courses (Only published course)
// @route     GET /api/v1/courses/getcourse/:courseId
// @access    Public // VERIFIED
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate({
        path: 'instructor',
        populate: {
          path: 'profile',
        },
      })
      .populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections',
          select: '-videoUrl',
        },
      })
      .exec();

    if (!course || course.status === 'Draft') {
      return next(new ErrorResponse('No such course found', 404));
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse('Failed to fetching course', 500));
  }
};

// @desc      Get full details of a course
// @route     POST /api/v1/courses/getFullCourseDetails
// @access    Private
exports.getFullCourseDetails = async (req, res, next) => {
  try {
    // Full details can be seen by instructor who created it
    const instructorId = req.user.id;

    const { courseId } = req.body;

    if (!courseId) {
      return next(new Error('Invalid request', 404));
    }

    const course = await Course.findById(courseId)
      .populate({
        path: 'instructor',
        populate: {
          path: 'profile',
        },
      })
      .populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections',
        },
      })
      .exec();

    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    if (course.instructor._id.toString() !== instructorId) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse('Failed to fetching course', 500));
  }
};


// @desc      Create Course
// @route     POST /api/v1/courses
// @access    Private/instructor
exports.createCourse = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const { title, description, whatYouWillLearn, price, category } = req.body;
    const tags = req.body?.tags ? JSON.parse(req.body?.tags) : null;
    const instructions = req.body?.instructions ? JSON.parse(req.body?.instructions) : null;
    const thumbnail = req.files?.thumbnail;

    if (!(instructorId && title && description && whatYouWillLearn && price && category && tags && instructions && thumbnail)) {
      return next(new ErrorResponse('All fields are mandatory', 404));
    }

    // check if category is a valid category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return next(new ErrorResponse('No such category found', 404));
    }

    // validate and upload thumbnail
    if (thumbnail.size > process.env.THUMBNAIL_MAX_SIZE) {
      return next(new ErrorResponse(`Please upload a image less than ${process.env.THUMBNAIL_MAX_SIZE / 1024} KB`, 400));
    }

    if (!thumbnail.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload a image file', 400));
    }

    const allowedFileType = ['jpeg', 'jpg', 'png'];
    const thumbnailType = thumbnail.mimetype.split('/')[1];

    if (!allowedFileType.includes(thumbnailType)) {
      return next(new ErrorResponse('Please upload a valid image file', 400));
    }

    thumbnail.name = `thumbnail_${instructorId}_${Date.now()}`;
    const image = await cloudUploader(thumbnail, process.env.THUMBNAIL_FOLDER_NAME, 200, 80);

    // create course
    const courseDetails = await Course.create({
      title,
      description,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      category,
      instructions,
      thumbnail: image.secure_url,
      tags,
    });

    // update user
    await User.findByIdAndUpdate(
      instructorId,
      {
        $push: { courses: courseDetails._id },
      },
      { new: true }
    );

    // update category
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      {
        $push: { courses: courseDetails._id },
      },
      { new: true }
    );

    const courseFullDetails = await Course.findById(courseDetails._id)
      .populate({
        path: 'instructor',
        populate: {
          path: 'profile',
        },
      })
      .populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections',
        },
      })
      .exec();

    res.status(201).json({
      success: true,
      data: courseFullDetails,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create course', 500));
  }
};

// @desc      Edit Course
// @route     PUT /api/v1/courses/editcourse
// @access    Private/instructor
exports.editCourse = async (req, res, next) => {
  try {
    const instructorId = req.user.id;

    const { courseId } = req.body;
    const updates = req.body;
    const thumbnail = req.files?.thumbnail;

    if (updates.hasOwnProperty('thumbnail') && !thumbnail) {
      return next(new Error('Please select a thumbnail', 404));
    }

    if (!courseId) {
      return next(new Error('Invalid request', 404));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    if (course.instructor._id.toString() !== instructorId) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }

    /////////////////////// ** Course Thumbnail ** ///////////////////////
    if (thumbnail) {
      // validate and upload thumbnail
      if (thumbnail.size > process.env.THUMBNAIL_MAX_SIZE) {
        return next(new ErrorResponse(`Please upload a image less than ${process.env.THUMBNAIL_MAX_SIZE / 1024} KB`, 400));
      }

      if (!thumbnail.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload a image file', 400));
      }

      const allowedFileType = ['jpeg', 'jpg'];
      const thumbnailType = thumbnail.mimetype.split('/')[1];

      if (!allowedFileType.includes(thumbnailType)) {
        return next(new ErrorResponse('Please upload a valid image file', 400));
      }

      thumbnail.name = `thumbnail_${instructorId}_${Date.now()}`;
      const image = await cloudUploader(thumbnail, process.env.THUMBNAIL_FOLDER_NAME, 200, 80);
      course.thumbnail = image.secure_url;
    }
    /////////////////////////// ***** ///////////////////////////

    if (updates.tags) updates.tags = JSON.parse(updates.tags);
    if (updates.instructions) updates.instructions = JSON.parse(updates.instructions);

    // Update only properties that are present in the request body (and not inherited in updates)
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        course[key] = updates[key];
      }
    }

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: 'instructor',
        populate: {
          path: 'profile',
        },
      })
      .populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections',
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to edit course', 500));
  }
};

// @desc      Delete Course - Course can be delete only if no students is enrolled
// @route     DELETE /api/v1/courses/deletecourse
// @access    Private/instructor
exports.deleteCourse = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return next(new Error('Invalid request', 404));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    if (course.instructor._id.toString() !== instructorId) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }

    if (course.studentsEnrolled.length !== 0) {
      return next(new ErrorResponse("Can't delete course, some students are enrolled", 404));
    }

    // Delete sections and sub-sections
    const courseSections = course.sections;
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      const subSections = section.subSections;

      // Delete the sub sections of section
      for (const subSectionId of subSections) {
        await SubSection.findByIdAndDelete(subSectionId);
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to delete course', 500));
  }
};

// @desc      Fetch course data, in which user is enrolled
// @route     POST /api/v1/courses/getenrolledcoursedata
// @access    Private/student
exports.getEnrolledCourseData = async (req, res, next) => {
  try {
    // Only User who is enrolled in this course can get course data
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return next(new Error('Invalid request', 404));
    }

    const course = await Course.findOne({
      _id: courseId,
      status: 'Published',
    })
      .populate({
        path: 'instructor',
        populate: {
          path: 'profile',
        },
      })
      .populate('category')
      .populate('reviews')
      .populate({
        path: 'sections',
        populate: {
          path: 'subSections',
        },
      })
      .exec();

    if (!course) {
      return next(new ErrorResponse('No such course found', 404));
    }

    if (!course.studentsEnrolled.includes(userId)) {
      return next(new ErrorResponse('Student is not enrolled in Course', 401));
    }

    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      return next(new ErrorResponse('No such course progress found', 404));
    }

    let totalNoOfVideos = 0;
    for (let section of course.sections) {
      totalNoOfVideos += section.subSections.length;
    }

    return res.status(200).json({
      success: true,
      data: {
        course,
        completedVideos: courseProgress.completedVideos,
        totalNoOfVideos,
      },
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetch enrolled course data', 500));
  }
};
