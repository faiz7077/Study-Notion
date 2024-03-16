import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/common/Spinner';
import { getAllReviewsOfCourse, getCourse } from '../services/operations/courseServices';
import Footer from '../components/common/Footer';
import RatingStars from '../components/common/RatingStars';
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import dateTimeFormatter from '../utils/dateTimeFormatter';
import CourseBuyNowCard from '../components/core/Course/CourseBuyNowCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { toast } from "react-hot-toast"
import { ROLE_TYPE } from '../utils/constants'
import { addToCart } from '../redux/slices/cartSlice';
import { useSelector } from 'react-redux';
import { FaShareSquare } from "react-icons/fa"
import copy from 'copy-to-clipboard';
import ReactMarkdown from 'react-markdown'
import secToDurationFormatter from '../utils/secToDurationFormatter';
// import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { BsDot } from 'react-icons/bs'
import CourseSectionAccordion from '../components/core/Course/CourseSectionAccordion';
import { buyCourses } from '../services/operations/paymentServices';
import { getAllReviews } from '../services/operations/otherServices';
import ReviewsSlider from '../components/common/ReviewsSlider';


const CourseDetails = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModalData, setConfirmationModalData] = useState(null);
  const { user } = useSelector(state => state.profile);
  const { token } = useSelector(state => state.auth);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [openSections, setOpenSections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading2, setLoading2] = useState(false);



  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      const result = await getCourse(courseId);
      if (result) {
        setCourseData(result);
        let lectures = 0;
        result.sections.forEach((section) => {
          lectures += section.subSections.length
        })
        setTotalNoOfLectures(lectures)
      }
      setLoading(false);
    };


    const fetchAllReviews = async () => {
      setLoading2(true);
      const response = await getAllReviewsOfCourse(courseId);
      if (response) {
        setReviews(response);
      }
      setLoading2(false);
    };

    fetchCourseData();
    fetchAllReviews();
  }, [courseId])

  const handleAddToCart = () => {
    // User is Instructor
    if (user && user.role === ROLE_TYPE.INSTRUCTOR) {
      toast.error("Instructor can't buy a course")
      return;
    }

    // User is student
    if (user) {
      dispatch(addToCart(courseData));
      return;
    }

    // When the user is not logged in
    setConfirmationModalData({
      text1: 'You are not logged in !!',
      text2: 'Please login to add to Cart',
      btn1Text: 'LogIn',
      btn2Text: 'Cancel',
      btn1Handler: () => navigate('/login'),
      btn2Handler: () => setConfirmationModalData(null),
      closeModalHandler: () => setConfirmationModalData(null),
    })
  }

  const handleBuyNowClick = async () => {
    // User is Instructor
    if (user && user.role === ROLE_TYPE.INSTRUCTOR) {
      toast.error("Instructor can't buy a course")
      return;
    }

    // User is already bought that course
    if (user && courseData.studentsEnrolled.includes(user._id)) {
      // navigate('/dashboard/enrolled-courses')
      navigate(`/view-course/${courseData._id}/section/${courseData.sections[0]._id}/sub-section/${courseData.sections[0].subSections[0]._id}`)
      return
    }

    if (user) {
      await buyCourses([courseId], user, token, false, dispatch, navigate);
      return;
    }

    // When the user is not logged in
    setConfirmationModalData({
      text1: 'You are not logged in !!',
      text2: 'Please login to Buy this Course',
      btn1Text: 'LogIn',
      btn2Text: 'Cancel',
      btn1Handler: () => navigate('/login'),
      btn2Handler: () => setConfirmationModalData(null),
      closeModalHandler: () => setConfirmationModalData(null),
    })
  }

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to the clipboard")
  }


  const handleCollapseExpand = () => {
    if (openSections.length === 0) {
      // Expand all
      const allSectionsIds = courseData.sections.map((section) => section._id)
      setOpenSections(allSectionsIds)
    } else {
      // Collapse all
      setOpenSections([]);
    }
  }

  const handleOpenSection = (sectionId) => {
    setOpenSections(
      openSections.includes(sectionId) ?
        openSections.filter(secId => secId !== sectionId)
        : [...openSections, sectionId]
    )
  }

  return (
    <div className='bg-richblack-900' >

      {
        loading && (
          <div className='grid place-items-center min-h-[calc(100vh-3.5rem)]' >
            <Spinner />
          </div>
        )
      }

      {
        !loading && !courseData && (
          <div className='grid place-items-center min-h-[calc(100vh-3.5rem)]' >
            <p className='text-xl text-center text-richblack-5' >No Such Course Found</p>
          </div>
        )
      }

      {
        !loading && courseData &&
        (
          <div className='bg-richblack-900 text-richblack-5' >
            <div className='bg-richblack-800 text-richblack-5 '  >
              {/* Course Details */}
              <div className='mx-auto px-4 py-8 lg:w-[1260px] min-h-[450px]  2xl:relative' >

                <div className='mx-auto lg:mx-0 flex flex-col items-center lg:items-start max-w-maxContentTab xl:max-w-[810px]' >
                  <p className='text-sm w-full ml-5 lg:ml-0 text-left text-richblack-300' >Home / Learning /
                    {" "}
                    <span className='text-yellow-25' >
                      {courseData.category.name}
                    </span>
                  </p>

                  {/* Course thumbnail - For small screen */}
                  <div className='lg:hidden relative max-h-[30rem] mt-5' >
                    <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                    <img
                      src={courseData.thumbnail}
                      alt="course thumbnail"
                      className='w-full aspect-ratio'
                    />
                  </div>

                  <div className='flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5 my-5' >

                    <p className='text-3xl sm:text-4xl font-bold text-richblack-5 ' >{courseData.title}</p>
                    <p className='text-richblack-200' >{courseData.description}</p>

                    <div className='flex items-center flex-wrap gap-2 text-md' >
                      <p className='text-yellow-25' >{courseData.averageRating}</p>

                      <RatingStars rating={courseData.averageRating} starSize={24} />

                      <p className='text-richblack-200' >( {courseData.reviews.length} ratings ) </p>
                      <p className='text-richblack-200' >{courseData.numberOfEnrolledStudents} students</p>
                    </div>

                    <p className='text-richblack-5' >Created by {courseData.instructor.firstName} {courseData.instructor.lastName}</p>

                    <div className='flex flex-wrap gap-5 text-lg' >
                      <p className='flex items-center gap-2' >
                        <BiInfoCircle />
                        Created at {dateTimeFormatter(courseData.createdAt)}
                      </p>

                      <p className='flex items-center gap-2'>
                        <HiOutlineGlobeAlt />
                        {courseData.language || "English"}
                      </p>
                    </div>

                  </div>

                  {/* Buy now - For small screen */}
                  <div className='lg:hidden w-full flex flex-col gap-4 border-y border-y-richblack-500 py-4 ' >
                    <p className='pb-4 text-3xl font-semibold text-richblack-5 text-center' >
                      ₹ {courseData.price}
                    </p>

                    <button
                      className='rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900'
                      onClick={handleBuyNowClick}
                    >
                      {
                        user && courseData.studentsEnrolled.includes(user._id) ?
                          "Go To Course" :
                          "Buy Now"
                      }
                    </button>

                    {
                      (!user || !courseData.studentsEnrolled.includes(user._id)) &&
                      (
                        <button
                          className='rounded-md bg-richblack-800 px-5 py-2 font-semibold text-richblack-5'
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </button>
                      )
                    }

                    <div className='mx-auto text-center'>
                      <button className='py-6 text-yellow-100' onClick={handleShare} >
                        <div className='flex items-center gap-2' >
                          <FaShareSquare size={15} />
                          <p>Share</p>
                        </div>
                      </button>
                    </div>


                  </div>
                </div>

                {/* Buy Now Card - For larger screen */}
                <div className='hidden lg:block lg:absolute right-4 top-[80px]' >
                  <CourseBuyNowCard
                    courseData={courseData}
                    handleBuyNowClick={handleBuyNowClick}
                    handleAddToCart={handleAddToCart}
                    handleShare={handleShare}
                    setConfirmationModalData={setConfirmationModalData}
                  />
                </div>
              </div>


            </div>

            <div className='bg-richblack-900 text-richblack-5' >
              <div className='px-4 lg:w-[1260px] mx-auto' >
                <div className='mx-auto lg:mx-0 max-w-maxContentTab xl:max-w-[810px]' >

                  {/* What you will learn */}
                  <div className='border border-richblack-600 my-8 p-8' >
                    <p className='text-3xl font-semibold' >What you will learn</p>
                    <div className='mt-5' >
                      <ReactMarkdown  >
                        {courseData.whatYouWillLearn}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className='max-w-[830px]' >
                    <div className='flex flex-col gap-y-3' >
                      <p className='text-[28px] font-semibold' >Course Content</p>

                      <div className='flex flex-wrap justify-between gap-2' >

                        <div className='flex gap-1 text-sm text-richblack-200' >
                          <p>{courseData.sections.length} section(s)</p>
                          <p className='flex  items-center'>
                            <BsDot size={24} />
                            {totalNoOfLectures}
                            <span> lectures</span>
                          </p>
                          <p className='flex items-center'>
                            <BsDot size={24} />
                            {secToDurationFormatter(courseData.totalDuration)}
                            <span>total length</span>
                          </p>
                        </div>

                        <div>
                          <button
                            className='text-yellow-25'
                            onClick={() => handleCollapseExpand()}
                          >
                            {openSections.length ? "Collapse all sections" : "Expand all sections"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Course Details  */}
                    <div className='py-4' >
                      {
                        courseData?.sections.map((section, ind) => (
                          <div key={ind} >
                            <CourseSectionAccordion
                              section={section}
                              openSections={openSections}
                              handleOpenSection={handleOpenSection}
                            />
                          </div>
                        ))
                      }
                    </div>

                  </div>

                  {/* Author Details */}
                  <div className='max-w-[830px] mb-12 py-4'>
                    <p className='text-[28px] font-semibold' >Author</p>
                    <div className='flex gap-x-2 items-center py-4' >
                      <img
                        src={courseData.instructor.avatar}
                        alt="Author"
                        className='h-14 aspect-square rounded-full object-cover'
                      />

                      <p className='text-lg' >{courseData.instructor.firstName} {courseData.instructor.lastName}</p>
                    </div>
                    <p className='text-richblack-50' >
                      {courseData?.instructor?.profile?.about}
                    </p>
                  </div>

                </div>
              </div>

            </div>


            {/* Reviews Section */}
            <div className='mt-8' >
              <h2 className='text-center text-3xl md:text-4xl font-semibold mt-8' >
                Reviews from other learners
              </h2>

              {/* Reviews Slider */}
              <div className='' >
                {
                  loading2 ?
                    (
                      <div className='min-h-[150px] grid place-items-center' >
                        <Spinner />
                      </div>
                    )
                    :
                    (
                      <div>
                        <ReviewsSlider reviews={reviews} />
                      </div>
                    )
                }
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        )
      }

      {
        confirmationModalData && <ConfirmationModal
          modalData={confirmationModalData}
        />
      }

    </div>
  )
}

export default CourseDetails
