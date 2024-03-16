const Course = require('../models/Course');
const User = require('../models/User');
const clgDev = require('../utils/clgDev');
const ErrorResponse = require('../utils/ErrorResponse');
const emailSender = require('../utils/emailSender');
const courseEnrollmentEmailTemplate = require('../mail/templates/courseEnrollmentEmailTemplate');
const mongoose = require('mongoose');
const razorpayInstance = require('../config/razorpayInstance');
const CourseProgress = require('../models/CourseProgress');
const paymentSuccessEmailTemplate = require('../mail/templates/paymentSuccessEmailTemplate');
const crypto = require('crypto');

// @desc      Create an Razorpay order and capture payment automatically
// @route     POST /api/v1/payments/createorder
// @access    Private/Student
exports.createOrder = async (req, res, next) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (courses.length == 0) {
      return next(new ErrorResponse('No courses found', 404));
    }

    let totalAmount = 0;
    for (const courseId of courses) {
      const course = await Course.findOne({
        _id: courseId,
        status: 'Published',
      });

      if (!course) {
        return next(new ErrorResponse('No such course found', 404));
      }

      // Check if student is already enrolled in this course
      if (course.studentsEnrolled.includes(user._id)) {
        return next(new ErrorResponse('Student is already enrolled in a course', 404));
      }

      totalAmount += course.price;
    }

    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `R${userId}-${Date.now()}`,
      notes: {
        userId: userId,
      },
    };

    // Create order
    const paymentResponse = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create order. Please try again', 500));
  }
};

// @desc      Verify signature of Razorpay and server
// @route     POST /api/v1/payments/verifypaymentsignature
// @access    Private/Student
exports.verifyPaymentSignature = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    if (!(razorpay_order_id && razorpay_payment_id && razorpay_signature && courses && userId)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    // Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout.
    const orderId = razorpay_order_id;
    const body = orderId + '|' + razorpay_payment_id;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_PAY_KEY_SECRET).update(body.toString()).digest('hex');

    // verify signature
    if (generated_signature !== razorpay_signature) {
      return next(new ErrorResponse('Invalid request', 400));
    }

    // Fulfill the action - Enroll in courses
    await enrollStudent(courses, userId, res, next);

    return res.status(200).json({
      success: true,
      data: 'Payment Verified and Student enrolled in Courses',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to verify signature', 500));
  }
};

// @desc      Send an email to Student for successful payment
// @route     POST /api/v1/payments/sendpaymentsuccessemail
// @access    Private/Student
exports.sendPaymentSuccessEmail = async (req, res, next) => {
  try {
    const { orderId, paymentId, amount } = req.body;

    if (!(orderId && paymentId && amount)) {
      return next(new ErrorResponse('Failed to send payment success email, some fields are missing', 404));
    }

    const user = await User.findById(req.user.id);
    const emailResponse = await emailSender(user.email, 'Payment Received', paymentSuccessEmailTemplate(`${user.firstName} ${user.lastName}`, amount / 100, orderId, paymentId));

    res.status(200).json({
      success: true,
      data: 'Payment success email sent successfully',
    });
  } catch (error) {
    next(new ErrorResponse('Failed to send payment success email', 500));
  }
};

// Enroll student in courses
const enrollStudent = async (courses, userId, res, next) => {
  if (!(courses && courses.length && userId)) {
    return next(new ErrorResponse('Please provide course and user details', 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse('No such user found', 404));
  }

  // Enroll in courses
  for (const courseId of courses) {
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        status: 'Published',
      },
      { $push: { studentsEnrolled: user._id }, $inc: { numberOfEnrolledStudents: 1 } },
      { new: true }
    );

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    const courseProgress = await CourseProgress.create({
      courseId,
      userId,
    });

    const student = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: course._id,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    if (!student) {
      return next(new ErrorResponse('Student not found', 500));
    }

    // Send an enrollment email to enrolled student
    const emailResponse = await emailSender(user.email, `Successfully enroll into ${course.title}`, courseEnrollmentEmailTemplate(course.title, `${user.firstName} ${user.lastName}`));
  }
};

/**
 * 
 * Below Code uses Razorpay webhook and used to buy only one course
 * 
 */ 

// @desc      Capture the payment and create the Razorpay order
// @route     POST /api/v1/payments/capturepayment
// @access    Private/Student

exports.capturePayment = async (req, res, next) => {
  try {
    const { courseId } = req.user.id;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    if (!courseId) {
      return next(new ErrorResponse('Please enter a valid course ID', 404));
    }

    // check if course exist or not
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('Could not find the course, please enter vaild course details', 404));
    }

    // check if user already paid for this course
    if (course.studentsEnrolled.includes(userId)) {
      return next(new ErrorResponse('Student is already enrolled', 404));
    }

    // Create order
    try {
      const options = {
        amount: course.price * 100,
        currency: 'INR',
        receipt: `${userId}.${Date.now()}`,
        notes: {
          courseId,
          userId,
        },
      };

      // Initiate the payment using razorpay
      const paymentResponse = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        courseTitle: course.title,
        courseDescription: course.description,
        courseThumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (err) {
      return next(new ErrorResponse('Could not create order. Please try again', 500));
    }
  } catch (err) {
    next(new ErrorResponse('Failed to create order. Please try again', 500));
  }
};

// // @desc      Verify signature of Razorpay and server
// // @route     POST /api/v1/payments/verifysignature
// // @access    Private/Student
exports.verifySignature = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const shasum = crypto.createHmace('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    // verify signature
    if (signature !== digest) {
      return next(new ErrorResponse('Invalid request', 400));
    }

    // Fulfill the action
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    addCourse(res, courseId, userId);
  } catch (err) {
    next(new ErrorResponse('Failed to verify signature', 500));
  }
};


// Add a course to Student courses array
const addCourse = async (res, courseId, userId) => {
  // Find the course and enroll the student in it
  if (!(courseId && userId)) {
    return next(new ErrorResponse('Invalid request', 404));
  }

  // update course
  const enrolledCourse = await Course.findOneAndUpdate(
    { _id: courseId },
    {
      $push: { studentsEnrolled: userId },
      $inc: { numberOfEnrolledStudents: 1 },
    },
    { new: true }
  );

  if (!enrolledCourse) {
    return next(new ErrorResponse('Course not found', 404));
  }

  // update student - enroll the student
  const enrolledUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { courses: courseId },
    },
    { new: true }
  );

  if (!enrolledUser) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Create a courseProgress 
  const courseProgress = await CourseProgress.create({
    courseId,
    userId
  })

  // Send course enrollment mail to user
  try {
    const emailResponse = await emailSender(enrolledUser.email, 'Congratulations for buying new course from StudyNotion', courseEnrollmentEmailTemplate(enrolledCourse.title, enrolledUser.firstName));

    res.status(200).json({
      success: true,
      data: 'Course added to user',
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      data: 'Course added to user, but failed to send course enrollment email',
    });
  }
};
