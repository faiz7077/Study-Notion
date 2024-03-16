const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { getAllPublishedCourses, getCourse, createCourse, getFullCourseDetails, editCourse, deleteCourse, getEnrolledCourseData } = require('../controllers/CourseC');

router.route('/').get(getAllPublishedCourses).post(protect, authorize('Instructor'), createCourse);

router.get('/getcourse/:courseId', getCourse);

router.post('/getfullcoursedetails', protect, authorize('Instructor'), getFullCourseDetails);
router.post('/getenrolledcoursedata', protect, authorize('Student'), getEnrolledCourseData);
router.put('/editcourse', protect, authorize('Instructor'), editCourse);
router.delete('/deletecourse', protect, authorize('Instructor'), deleteCourse);


module.exports = router;
