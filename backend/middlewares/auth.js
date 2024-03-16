const ErrorResponse = require('../utils/ErrorResponse');
const jwt = require('jsonwebtoken');
const clgDev = require('../utils/clgDev');

exports.protect = async (req, res, next) => {
  try {
    // TODO : test which is better
    // const token = req.cookie.token || req.header("Authorization").replace("Bearer ", "");
    const token = req.cookies?.token || req.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new ErrorResponse('User not authorized to access this route', 401));
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      return next();
    } catch (err) {
      return next(new ErrorResponse('User not authorized to access this route', 401));
    }
  } catch (err) {
    next(new ErrorResponse('Something went wrong while validating user', 500));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('User not authorized to access this route', 401));
    }
    next();
  };
};


exports.adminAuthorization = () => {
  return (req, res, next) => {
    if (req.user.email !== process.env.SITE_OWNER_EMAIL) {
      return next(new ErrorResponse('User not authorized to access this route', 401));
    }
    next();
  };
}

exports.isSiteOwner = (req, res, next) => {
  if (req.user.email !== process.env.SITE_OWNER_EMAIL) {
    next(new ErrorResponse('User not authorized to access this route', 401));
  }
  next();
};
