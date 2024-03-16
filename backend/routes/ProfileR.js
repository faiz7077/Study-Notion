const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { updateProfile } = require('../controllers/ProfileC');

router.put('/', protect, updateProfile);

module.exports = router;
