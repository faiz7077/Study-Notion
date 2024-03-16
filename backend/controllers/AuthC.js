const OTP = require('../models/OTP');
const User = require('../models/User');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/ErrorResponse');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const emailSender = require('../utils/emailSender');
const passwordUpdateTemplate = require('../mail/templates/passwordUpdateTemplate');
const crypto = require('crypto');
const clgDev = require('../utils/clgDev');
const jwt = require('jsonwebtoken');
const accountCreationTemplate = require('../mail/templates/accountCreationTemplate');
const adminCreatedTemplate = require('../mail/templates/adminCreatedTemplate');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// @desc      Send OTP for email verification
// @route     POST /api/v1/auth/sendotp
// @access    Public // VERIFIED
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    if (await User.findOne({ email })) {
      return next(new ErrorResponse('User is already registered', 401));
    }

    // Generate OTP which is not present in database
    const options = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    };
    let otp = '';
    let user;

    do {
      otp = otpGenerator.generate(6, options);
      user = await OTP.findOne({ otp });
    } while (user);

    // Create OTP
    const otpObj = await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      data: 'OTP sent successfully',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to send otp. Please try again', 500));
  }
};

// @desc      SignUp a user
// @route     POST /api/v1/auth/signup
// @access    Public // VERIFIED
exports.signup = async (req, res, next) => {
  try {
    let { firstName, lastName, email, password, role, contactNumber, otp } = req.body;

    role = role.charAt(0).toUpperCase() + role.slice(1);

    if (!(firstName && lastName && email && password && role && otp)) {
      return next(new ErrorResponse('Some fields are missing', 403));
    }

    // Find the most recent OTP for the email
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
      // OTP not found or Database Otp not match with given otp for this email'
      return next(new ErrorResponse('OTP is not valid. Please try again.', 400));
    }

    // check if user already exists
    if (await User.findOne({ email })) {
      return next(new ErrorResponse('User already exist. Please sign in to continue', 400));
    }

    // check if role is not admin
    if (role === 'Admin') {
      return next(new ErrorResponse('User not authorized', 403));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // LATER  - what is approved
    let approved = role === 'Instructor' ? false : true;

    const profile = await Profile.create({});

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      approved,
      profile: profile._id,
      avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // send a notification to user for account creation
    emailSender(email, `Account created successfully for ${firstName} ${lastName}`, accountCreationTemplate(firstName + ' ' + lastName));

    sendTokenResponse(res, user, 201);
  } catch (err) {
    next(new ErrorResponse('Failed to signUp user. Please try again', 500));
  }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public  // VERIFIED
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please fill an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    sendTokenResponse(res, user, 200);
  } catch (err) {
    next(new ErrorResponse('Login failed. Please try again', 500));
  }
};

// @desc      Logout current user / cleat cookie
// @route     POST /api/v1/auth/logout
// @access    Private  // VERIFIED
exports.logOut = async (req, res, next) => {
  try {
    res
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        data: {},
      });
  } catch (err) {
    next(new ErrorResponse('Failed to log out. Please try again', 500));
  }
};

// @desc      Get current logged in user
// @route     GET /api/v1/auth/getme
// @access    Private  // VERIFIED
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to fetching current user details. Please try again', 500));
  }
};

// @desc      Change Password
// @route     PUT /api/v1/auth/changepassword
// @access    Private  // VERIFIED
exports.changePassword = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id).select('+password');
    const { oldPassword, newPassword } = req.body;

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return next(new ErrorResponse('The password is incorrect', 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user = await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

    // Send password change email to user
    try {
      const response = await emailSender(user.email, `Password updated successfully for ${user.firstName} ${user.lastName}`, passwordUpdateTemplate(user.email, `${user.firstName} ${user.lastName}`));
    } catch (err) {
      return next(new ErrorResponse('Error occurred while sending email', 500));
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to change password. Please try again', 500));
  }
};

// @desc      Forgot Password - send rest url to user
// @route     POST /api/v1/auth/forgotpassword
// @access    Public  // VERIFIED
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Email not found. Please enter a valid email', 400));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user = await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: Date.now() + 10 * 60 * 1000,
      },
      { new: true }
    );

    const resetUrl = `${process.env.STUDY_NOTION_FRONTEND_SITE}/reset-password?reset-token=${resetToken}`;

    try {
      const response = emailSender(
        user.email,
        `Password reset for ${user.firstName} ${user.lastName}`,
        `You are receiving this email because you (or someone else) has requested the reset of your Study Notion account password. 
        Please click below to reset your password : \n\n ${resetUrl}
        `
      );
    } catch (err) {
      return next(new ErrorResponse('Failed to send reset email. Please try again', 500));
    }

    res.status(200).json({
      success: true,
      data: 'Reset email sent successfully. Please check your email to reset password',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to send reset password email. Please try again', 500));
  }
};

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword
// @access    Public  // VERIFIED
exports.resetPassword = async (req, res, next) => {
  try {
    const { password, resetToken } = req.body;
    if (!(password && resetToken)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    let user = await User.findOne({
      resetPasswordToken,
    });

    if (!user) {
      return next(new ErrorResponse('Invalid request', 404));
    }

    if (Date.now() > user.resetPasswordExpire) {
      return next(new ErrorResponse('Token is Expired. Please Regenerate your token', 404));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      },
      { new: true }
    );

    // send mail to user for reset password
    try {
      const response = emailSender(
        user.email,
        `Password has been reset successfully for ${user.firstName} ${user.lastName}`,
        `Your password has been reset successfully. Thanks for being with us.
        To visit our site : ${process.env.STUDY_NOTION_FRONTEND_SITE}
        `
      );
    } catch (err) {
      return next(new ErrorResponse('Failed to send reset successful email. Please try again', 500));
    }

    sendTokenResponse(res, user, 200);
  } catch (err) {
    next(new ErrorResponse('Failed to reset password. Please try again', 500));
  }
};

// @desc      Create Admin
// @route     POST /api/v1/auth/createadmin
// @access    Private/SiteOwner // VERIFIED
exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;
    const role = 'Admin';

    if (!(firstName && lastName && email && password && role && contactNumber)) {
      return next(new ErrorResponse('Some fields are missing', 403));
    }

    // check if user already exists
    if (await User.findOne({ email })) {
      return next(new ErrorResponse('User already exist. Please sign in to continue', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // LATER  - what is approved
    let approved = role === 'Instructor' ? false : true;

    const profile = await Profile.create({ contactNumber });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      approved,
      profile: profile._id,
      avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // send a notification to user for account creation
    emailSender(email, `Admin account created successfully for ${firstName} ${lastName}`, adminCreatedTemplate(firstName + ' ' + lastName));

    res.status(400).json({
      success: false,
      data: 'Admin created successfully',
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create admin, Please try again', 500));
  }
};

// Function to send token in cookies  // VERIFIED
const sendTokenResponse = (res, user, statusCode) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('token', token, options).status(statusCode).json({
    success: true,
    user,
    token,
  });
};
