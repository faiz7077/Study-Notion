const User = require('../models/User');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/ErrorResponse');
const cloudUploader = require('../utils/cloudUploader');
const clgDev = require('../utils/clgDev');
const secToDuration = require('../utils/secToDuration');
const CourseProgress = require('../models/CourseProgress');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin // VERIFIED
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate('profile').populate('courses').exec();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to get all users, please try again', 404));
  }
};

// @desc      Get single user by id
// @route     GET /api/v1/users/getuser/:id
// @access    Private/Admin // VERIFIED
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('profile').populate('courses').exec();

    if (!user) {
      return next(new ErrorResponse('No such user found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to get user, please try again', 500));
  }
};

// @desc      Get current user
// @route     GET /api/v1/users/currentuser
// @access    Private // VERIFIED
exports.currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('profile').populate('courses').exec();
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to get current user, please try again', 500));
  }
};

// @desc      Change avatar of user
// @route     PUT /api/v1/users/changeavatar
// @access    Private // VERIFIED
exports.changeAvatar = async (req, res, next) => {
  try {
    if (!(req.files && req.files.file)) {
      return next(new ErrorResponse('Image not found', 400));
    }

    const avatar = req.files.file;

    if (avatar.size > process.env.AVATAR_MAX_SIZE) {
      return next(new ErrorResponse(`Please upload a image less than ${process.env.AVATAR_MAX_SIZE / 1024} KB`, 400));
    }

    if (!avatar.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload a image file', 400));
    }

    const allowedFileType = ['jpeg', 'jpg'];
    const avatarType = avatar.mimetype.split('/')[1];

    // check file type
    if (!allowedFileType.includes(avatarType)) {
      return next(new ErrorResponse('Please upload a valid image file', 400));
    }

    avatar.name = `avatar_${req.user.id}_${Date.now()}.${avatarType}`;
    const img = await cloudUploader(avatar, process.env.AVATAR_FOLDER_NAME, 100, 80);
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: img.secure_url }, { new: true });

    res.status(200).json({
      success: true,
      data: img.secure_url,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse('Failed to update profile pic', 404));
  }
};

// @desc      Get all enrolled courses of a student
// @route     GET /api/v1/users/getenrolledcourses
// @access    Private/Student
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id).populate({
      path: 'courses',
      populate: {
        path: 'sections',
        populate: {
          path: 'subSections'
        }
      }
    }).exec();

    user = user.toObject();

    // set totalDuration of each  course
    for (let i = 0; i < user.courses.length; i++) {
      let totalDurationInSeconds = parseInt(user.courses[i].totalDuration);
      user.courses[i].duration = secToDuration(totalDurationInSeconds);

      let subsectionCount = 0;
      for (let j = 0; j < user.courses[i].sections.length; j++) {
        subsectionCount += user.courses[i].sections[j].subSections.length;
      }

      const courseProgress = await CourseProgress.findOne({
        courseId: user.courses[i]._id,
        userId: user._id
      });

      const courseProgressCount = courseProgress.completedVideos.length;
      let progressPercentage = 100;
      if (subsectionCount !== 0) {
        progressPercentage = Math.round((courseProgressCount / subsectionCount) * 100 * 100) / 100;
      }

      user.courses[i].progressPercentage = progressPercentage;
    }

    res.status(200).json({
      success: true,
      count: user.courses.length,
      data: user.courses,
    });
  } catch (err) {
    console.log(err)
    next(new ErrorResponse('Failed to fetch all courses', 500));
  }
};

// @desc      Get all courses created by current instructor
// @route     GET /api/v1/users/getcreatedcourses
// @access    Private/Instructor 
exports.getCreatedCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('courses').exec();

    res.status(200).json({
      success: true,
      count: user.courses.length,
      data: user.courses,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetch all courses', 500));
  }
};

// @desc      Get all review by a student
// @route     GET /api/v1/users/getallreviews
// @access    Private/Student
exports.getAllReviews = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('reviews').exec();

    res.status(200).json({
      success: true,
      count: user.reviews.length,
      data: user.reviews,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching all reviews. Please try again'));
  }
};

// TODO
// @desc      Delete current user
// @route     DELETE /api/v1/users/deletecurrentuser
// @access    Private /Student+Instructor
exports.deleteCurrentUser = async (req, res, next) => {
  try {
    // TODO - Do it by job scheduling
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);
    // Check what more we can do
    const user = await User.findById(req.user.id).exec();

    await Profile.findByIdAndDelete(user.profile);

    // TODO - Unenroll User From All the Enrolled Courses
    await User.findByIdAndDelete(user._id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to delete user, Please try again', 500));
  }
};


// TODO
// @desc      Get Instructor Dashboard data of a Instructor
// @route     GET /api/v1/users/getinstructordashboarddata
// @access    Private/Instructor 
exports.getInstructorDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'courses',
      match: { status: 'Published' }
    }).exec();

    if (!user) {
      return next(new ErrorResponse('No such user found', 404));
    }

    let totalPublishedCourses = user.courses.length;
    let totalStudents = 0;
    let totalIncome = 0;


    const coursesWithStats = user.courses.map((course) => {
      let courseWithStats = {
        course,
        stats: {
          totalStudents: course.numberOfEnrolledStudents,
          totalIncome: course.price * course.numberOfEnrolledStudents
        }
      }

      totalStudents += courseWithStats.stats.totalStudents;
      totalIncome += courseWithStats.stats.totalIncome;
      return courseWithStats
    });

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        userFirstName: user.firstName,
        totalPublishedCourses,
        totalStudents,
        totalIncome,
        coursesWithStats,
      }
    });
  } catch (err) {
    next(new ErrorResponse('Failed to get user, please try again', 500));
  }
};
