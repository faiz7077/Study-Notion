const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { getAllReviews, getReview, createReview, deleteReview, getReviewsOfCourse } = require('../controllers/ReviewC');

router.get('/getallreviews', getAllReviews);
router.post('/getreview', getReview);
router.post('/getreviewsofcourse', getReviewsOfCourse);
router.post('/createreview', protect, authorize('Student'), createReview);
router.delete('/deletereview', protect, authorize('Student', 'Admin'), deleteReview);

module.exports = router;
