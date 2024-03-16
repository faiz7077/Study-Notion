const Category = require('../models/Category');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const clgDev = require('../utils/clgDev');

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Public // VERIFIED
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching all categories', 500));
  }
};

// @desc      Get all courses of a category [+ other courses + top 10 selling courses]
// @route     GET /api/v1/categories/getcategorycourses/:categoryId
// @access    Public // VERIFIED
exports.getAllCategoryCourses = async (req, res, next) => {
  try {
    // Get requested category courses - If selected category is not found, return null for only selected
    const { categoryId } = req.body;
    let requestedCategory = null;
    let requestedCategoryCoursesMost = null;
    let requestedCategoryCoursesNew = null;

    if (categoryId) {
      const reqCat = await Category.findById(categoryId)
        .populate({
          path: 'courses',
          match: { status: 'Published' },
          populate: {
            path: 'instructor',
          },
        })
        .exec();

      requestedCategory = {
        name: reqCat.name,
        description: reqCat.description,
        _id: reqCat._id,
      };

      if (reqCat.courses.length) {
        requestedCategoryCoursesMost = reqCat.courses.sort((a, b) => b.numberOfEnrolledStudents - a.numberOfEnrolledStudents);

        requestedCategoryCoursesNew = reqCat.courses.sort((a, b) => b.createdAt - a.createdAt);
      }
    }

    // Get courses for other categories
    const categoriesExceptRequested = await Category.find({ _id: { $ne: categoryId } });

    const otherCategoryCourses = await Category.findById(categoriesExceptRequested[getRandomInt(categoriesExceptRequested.length)]._id).populate({
      path: 'courses',
      match: { status: 'Published' },
      populate: {
        path: 'instructor',
      },
    });

    // Get top 10 selling courses
    const topSellingCourses = await Course.find({
      status: 'Published',
    })
      .sort({
        numberOfEnrolledStudents: 'desc',
      })
      .populate({
        path: 'category',
        match: { status: 'Published' },
        select: 'name',
      })
      .populate('instructor')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        requestedCategory,
        requestedCategoryCoursesMost,
        requestedCategoryCoursesNew,
        otherCategoryCourses,
        topSellingCourses,
      },
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse('Failed to fetching all category courses. Please try again', 500));
  }
};

// @desc      Create a category
// @route     POST /api/v1/categories
// @access    Private/Admin // VERIFIED
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return next(new ErrorResponse('Please add category name', 400));
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create category', 500));
  }
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
