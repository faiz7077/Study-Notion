import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Spinner from '../../common/Spinner';
import { getEnrolledCourses } from '../../../services/operations/studentFeaturesServices';
import ProgressBar from '@ramonak/react-progress-bar'
import { Link } from 'react-router-dom';

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      await getEnrolledCourses(token, setEnrolledCourses, dispatch, navigate);
      setLoading(false);
    };
    fetchEnrolledCourses();
  }, [token, dispatch, navigate]);


  return (
    <div className='bg-richblack-900'>
      <h2 className='text-richblack-50 text-3xl' >Enrolled Courses</h2>
      <div className=''>
        {
          loading
            ?
            (
              <div className='grid h-[calc(100vh-20rem)] place-items-center mt-5 lg:mt-10' >
                <Spinner />
              </div>
            )
            : (!enrolledCourses || !enrolledCourses.length)
              ?
              (
                <div className='grid place-items-center h-[10vh]  ' >
                  <p className='text-lg font-semibold mt-5 lg:mt-10 text-richblack-25' >You have not enrolled in any course yet.</p>
                </div>
              )
              :
              (
                <div className='overflow-x-auto'>
                  <div className='my-8 text-richblack-5 w-[650px] md:w-full' >
                    {/* Headings  */}
                    <div className='flex rounded-t-lg bg-richblack-500' >
                      <p className='w-[45%] px-5 py-3' >Course Name</p>
                      <p className='w-[25%] px-2 py-3' >Duration</p>
                      <p className='flex-1 px-2 py-3' >Progress</p>
                    </div>

                    {/* Course Names */}
                    <div>
                      {
                        enrolledCourses.map((course, ind, arr) => (
                          <div key={ind} className={`flex items-center border border-richblack-700
                      ${ind === arr.length - 1 && 'rounded-b-lg'}`} >
                            <Link to={`/view-course/${course?._id}/section/${course?.sections?.[0]?._id}/sub-section/${course?.sections?.[0]?.subSections?.[0]?._id}`} className='w-[45%] px-5 py-3'>
                              <div className='flex cursor-pointer gap-4'
                                onClick={() => navigate(
                                  `/view-course/${course?._id}/section/${course?.sections?.[0]?._id}/sub-section/${course?.sections?.[0]?.subSections?.[0]?._id}`
                                )}
                              >
                                <img src={course?.thumbnail} className='h-14 w-14 rounded-lg object-cover' alt="course_img" />

                                <div className='flex flex-col max-w-xs gap-2' >
                                  <p className='font-semibold' >{course?.title}</p>
                                  <p className='text-xs text-richblack-300'>
                                    {course?.description.length > 50 ? `${course?.description.slice(0, 50)}...` : course?.description}
                                  </p>
                                </div>
                              </div>
                            </Link>


                            <div className='w-[25%] px-2 py-3' >
                              {course?.duration}
                            </div>

                            <div className='flex flex-col gap-2 w-1/5 px-2 py-2 ' >
                              <p>Progress : {course?.progressPercentage} %</p>
                              <ProgressBar
                                completed={course.progressPercentage || 0}
                                height='8px'
                                bgColor={course.progressPercentage === 100 ? '#06D6A0' : '#47A5C5'}
                                isLabelVisible={false}
                              />
                            </div>
                          </div>
                        ))
                      }
                    </div>

                  </div>
                </div>
              )
        }
      </div>
    </div>
  )
}

export default EnrolledCourses
