const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const ErrorResponse = require('../utils/ErrorResponse');
const clgDev = require('../utils/clgDev');
const cloudUploader = require('../utils/cloudUploader');
const Course = require('../models/Course');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// @desc      Create a subsection
// @route     POST /api/v1/subsections
// @access    Private/instructor // VERIFIED
exports.createSubSection = async (req, res, next) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const userId = req.user.id;
    const video = req?.files?.video;

    if (!(title && timeDuration && sectionId && video)) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }


    // check section is present or not
    let sectionDetails = await Section.findById(sectionId);
    if (!sectionDetails) {
      return next(new ErrorResponse('No such section found', 404));
    }

    if (sectionDetails.user.toString() !== userId) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    ///////////////////////* upload video **///////////////////////
    if (video.size > process.env.VIDEO_MAX_SIZE) {
      return next(new ErrorResponse(`Please upload a video less than ${process.env.VIDEO_MAX_SIZE / (1024 * 1024)} MB`, 400));
    }

    if (!video.mimetype.startsWith('video')) {
      return next(new ErrorResponse('Please upload a video file', 400));
    }

    const allowedFileType = ['mp4', 'mkv'];
    const videoType = video.mimetype.split('/')[1];

    if (!allowedFileType.includes(videoType)) {
      return next(new ErrorResponse('Please upload a valid image file', 400));
    }

    video.name = `vid_${req.user.id}_${Date.now()}.${videoType}`;
    const videoDetails = await cloudUploader(video, process.env.VIDEO_FOLDER_NAME, undefined, 75);
    /////////////////////////// ***** ///////////////////////////////////


    // create sub section
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      section: sectionId,
      user: userId,
      videoUrl: videoDetails.secure_url,
    });

    // update section
    sectionDetails = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSections: subSection._id },
      },
      { new: true }
    );

    // update course - updated time duration of course
    const updatedCourse = await Course.findByIdAndUpdate(
      sectionDetails.course,
      { $inc: { totalDuration: timeDuration } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: subSection,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to create sub section. Please try again', 500));
  }
};

// @desc      Update a subsection
// @route     PUT /api/v1/subsections
// @access    Private/instructor // VERIFIED
exports.updateSubSection = async (req, res, next) => {
  try {
    const subSectionId = req.body.subSectionId;

    if (!subSectionId) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return next(new ErrorResponse('No such subsection found', 404));
    }

    if (subSection.user.toString() !== req.user.id) {
      return next(new ErrorResponse('User is not allowed for this task', 404));
    }

    // update sub section
    const { title, timeDuration, description } = req.body;
    let videoUrl = null;

    // Update video
    if (req.files && req.files.video) {
      const video = req.files.video;
      ///////////////////////* upload video **///////////////////////
      if (video.size > process.env.VIDEO_MAX_SIZE) {
        return next(new ErrorResponse(`Please upload a video less than ${process.env.VIDEO_MAX_SIZE / (1024 * 1024)} MB`, 400));
      }

      if (!video.mimetype.startsWith('video')) {
        return next(new ErrorResponse('Please upload a video file', 400));
      }

      const allowedFileType = ['mp4', 'mkv'];
      const videoType = video.mimetype.split('/')[1];

      if (!allowedFileType.includes(videoType)) {
        return next(new ErrorResponse('Please upload a valid image file', 400));
      }

      video.name = `vid_${req.user.id}_${Date.now()}.${videoType}`;
      const videoDetails = await cloudUploader(video, process.env.VIDEO_FOLDER_NAME, undefined, 75);
      videoUrl = videoDetails.secure_url;
      /////////////////////////// ***** ///////////////////////////////////
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSection._id,
      {
        title,
        timeDuration,
        description,
        videoUrl
      },
      { new: true }
    );

    const updatedSection = await Section.findById(subSection.section).populate("subSections");

    // update course - updated time duration of course
    if (timeDuration) {
      const updatedCourse = await Course.findByIdAndUpdate(
        updatedSection.course,
        { $inc: { totalDuration: timeDuration - subSection.timeDuration } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to update sub section', 500));
  }
};

// @desc      Delete a subsection
// @route     DELETE /api/v1/subsections
// @access    Private/instructor // VERIFIED
exports.deleteSubSection = async (req, res, next) => {
  try {
    const subSectionId = req.body.subSectionId;
    const instructorId = req.user.id;

    if (!subSectionId) {
      return next(new ErrorResponse('Some fields are missing', 404));
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return next(new ErrorResponse('No such subsection found', 404));
    }

    if (subSection.user.toString() !== instructorId) {
      return next(new ErrorResponse('User is not allowed for this task', 404));
    }

    // update section
    const updatedSection = await Section.findByIdAndUpdate(
      subSection.section,
      {
        $pull: { subSections: subSection._id },
      },
      { new: true }
    ).populate("subSections");


    // update course - updated time duration of course
    const updatedCourse = await Course.findByIdAndUpdate(
      updatedSection.course,
      { $inc: { totalDuration: -subSection.timeDuration } },
      { new: true }
    );

    subSection.deleteOne();

    res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (err) {
    next(new ErrorResponse('Failed to delete sub section. Please try again', 500));
  }
};
