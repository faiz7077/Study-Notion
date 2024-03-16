const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { getUsers, getUser, currentUser, changeAvatar, getEnrolledCourses, getCreatedCourses, getAllReviews, deleteCurrentUser, getInstructorDashboardData } = require('../controllers/UserC');

router.get('/', protect, authorize('Admin'), getUsers);
router.get('/getuser/:id', protect, authorize('Admin'), getUser);
router.get('/currentuser', protect, currentUser);
router.put('/changeavatar', protect, changeAvatar);
router.get('/getenrolledcourses', protect, authorize('Student'), getEnrolledCourses);
router.get('/getcreatedcourses', protect, authorize('Instructor'), getCreatedCourses);
router.get('/getinstructordashboarddata', protect, authorize('Instructor'), getInstructorDashboardData);
router.get('/getallreviews', protect, authorize('Student'), getAllReviews);
router.delete('/deletecurrentuser', protect, authorize('Student', 'Instructor'), deleteCurrentUser);

module.exports = router;
