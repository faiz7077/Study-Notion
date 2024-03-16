const express = require('express');
const router = express.Router();
const { protect, authorize, isSiteOwner } = require('../middlewares/auth');

// import controllers
const { createSection, updateSection, deleteSection } = require('../controllers/SectionC');

router.post('/', protect, authorize('Instructor'), createSection);
router.put('/', protect, authorize('Instructor'), updateSection);
router.delete('/', protect, authorize('Instructor'), deleteSection);

module.exports = router;
