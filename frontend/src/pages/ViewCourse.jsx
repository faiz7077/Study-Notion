import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { fetchEnrolledCourseData } from '../services/operations/studentFeaturesServices';
import { useDispatch } from 'react-redux';
import CourseDetailsSidebar from '../components/core/ViewCourse/CourseDetailsSidebar';
import VideoDetails from '../components/core/ViewCourse/VideoDetails';
import AddReviewModal from '../components/core/ViewCourse/AddReviewModal';

const ViewCourse = () => {
  const { token } = useSelector(state => state.auth);
  const { courseId, sectionId, subSectionId } = useParams();
  const [loading, setLoading] = useState(true);
  const { courseData } = useSelector(state => state.viewCourse);
  const dispatch = useDispatch();
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);
  const [currentOpenSection, setCurrentOpenSection] = useState("");
  const [currentSubSection, setCurrentSubSection] = useState("");
  const navigate = useNavigate();

  // Fetch course details
  useEffect(() => {
    setLoading(true);
    if (!(courseId && sectionId && subSectionId)) {
      navigate('/dashboard/enrolled-courses');
      return;
    }

    const fetchCourseData = async () => {
      await fetchEnrolledCourseData(courseId, token, dispatch);
    };
    fetchCourseData();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token, dispatch]);


  useEffect(() => {
    // ; (() => { })() // other way to call function

    if (!(courseId && sectionId && subSectionId)) {
      navigate('/dashboard/enrolled-courses');
      return;
    }

    if (!courseData) return;

    ; (() => {
      // Mark current section and subsection
      let wrongDataFound = false;

      let currentSectionInd = courseData.sections.findIndex(section => section._id === sectionId);
      if (currentSectionInd === -1) {
        currentSectionInd = 0;
        wrongDataFound = true;
      }

      let currentSubsectionInd = courseData.sections[currentSectionInd].subSections.findIndex(subSection => subSection._id === subSectionId);
      if (currentSubsectionInd === -1) {
        currentSubsectionInd = 0;
        wrongDataFound = true;
      }

      if (wrongDataFound) {
        return navigate(`/view-course/${courseId}/section/${courseData.sections[currentSectionInd]._id}/sub-section/${courseData.sections[currentSectionInd].subSections[currentSubsectionInd]._id}`)
      }

      setCurrentOpenSection(courseData.sections[currentSectionInd]._id)
      setCurrentSubSection(courseData.sections[currentSectionInd].subSections[currentSubsectionInd])
    })();
  }, [courseData, sectionId, subSectionId, navigate, courseId]);


  return (
    <div className='bg-richblack-900'>
      {
        loading ?
          (
            <div className='min-h-[calc(100vh-10rem)] flex justify-center items-center' >
              <Spinner />
            </div>
          )
          : !courseData
            ?
            (
              <div className='min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-richblack-200 mx-auto font-semibold text-center mt-10 text-xl space-y-5' >
                <p className=''>No Such Course (or Lecture) Found !!</p>
                <p className='' >Check URL</p>
              </div>
            )
            :
            (
              <div className='relative flex bg-richblack-900 text-white' >
                {/* left - Course Details SideBar */}
                <div className='min-h-[calc(100vh-3.5rem)] bg-richblack-800' >
                  <div className='h-[calc(100vh-3.5rem)] last:text-white w-[175px] md:w-[350px] max-w-[450px] ' >
                    <CourseDetailsSidebar
                      currentOpenSection={currentOpenSection}
                      setCurrentOpenSection={setCurrentOpenSection}
                      currentSubSection={currentSubSection}
                      setCurrentSubSection={setCurrentSubSection}
                      setIsOpenReviewModal={setIsOpenReviewModal}
                    />
                  </div>
                </div>

                {/* Right - Video Player */}
                <div className='min-h-[calc(100vh-3.5rem)] w-full bg-pink-100' >
                  <div className='overflow-y-auto w-full bg-richblack-800 h-[calc(100vh-3.5rem)]' >
                    <VideoDetails
                      subSection={currentSubSection}
                      loading={loading}
                    />
                  </div>
                </div>

                {
                  isOpenReviewModal &&
                  <AddReviewModal setIsOpenReviewModal={setIsOpenReviewModal} />
                }
              </div>
            )
      }
    </div>
  )
}

export default ViewCourse
