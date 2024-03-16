const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { sendOtp, signup, login, logOut, getMe, changePassword, forgotPassword, resetPassword, createAdmin } = require('../controllers/AuthC');

router.post('/sendotp', sendOtp);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logOut);
router.get('/getme', protect, getMe);
router.put('/changepassword', protect, changePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.post('/createadmin', protect, isSiteOwner, createAdmin);

module.exports = router;
