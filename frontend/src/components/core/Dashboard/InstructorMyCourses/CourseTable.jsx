import React from 'react'
import dateTimeFormatter from '../../../../utils/dateTimeFormatter'
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiEdit2 } from "react-icons/fi"
import { FaCheck } from "react-icons/fa"
import { HiClock } from "react-icons/hi"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { COURSE_STATUS } from '../../../../utils/constants'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import secToDurationFormatter from '../../../../utils/secToDurationFormatter'
import { toast } from "react-hot-toast"
import ConfirmationModal from '../../../common/ConfirmationModal'
import { deleteCourse, getCreatedCourses } from '../../../../services/operations/courseServices'
import { Link } from 'react-router-dom'

const CourseTable = ({ courses, setCourses }) => {
  const NO_OF_WORDS = 30;
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(null);
  const [confirmationModalData, setConfirmationModalData] = useState(null);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await getCreatedCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModalData(null);
    setLoading(false);
  }

  const handleCourseDeleteClick = (course) => {
    // If students are enrolled in the course
    if (course.studentsEnrolled.length !== 0) {
      toast.error("Can't delete course, some students are enrolled");
      return;
    }

    const modalData = {
      text1: 'Do you want to delete this course ?',
      text2: 'All the data related to this course will be deleted',
      btn1Text: loading ? 'Loading...' : 'Delete',
      btn2Text: 'Cancel',
      btn1Handler: loading ? () => { } : () => handleCourseDelete(course._id),
      btn2Handler: loading ? () => { } : () => setConfirmationModalData(null),
      closeModalHandler: () => setConfirmationModalData(null),
    }
    setConfirmationModalData(modalData)
  }

  return (
    <div className='rounded-md border border-richblack-800 overflow-x-auto'>
      <div className='w-[850px] md:w-full'>
        <table >
          <thead >
            <tr className="flex gap-x-10 border-b border-b-richblack-800 py-2 px-6" >
              <th className="flex-1 text-left text-sm uppercase font-medium text-richblack-100" >Course</th>
              <th className="text-left text-sm uppercase font-medium text-richblack-100" >Duration</th>
              <th className="text-left text-sm uppercase font-medium text-richblack-100">Price</th>
              <th className="text-left text-sm uppercase font-medium text-richblack-100">Actions</th>
            </tr>
          </thead>

          <tbody className="flex flex-col gap-y-5" >
            {
              courses.map((course) => (
                <tr key={course._id} className='mt-0 flex gap-x-10 border-b border-b-richblack-800 py-8 px-6' >
                  <td >
                    <Link to={course.status === COURSE_STATUS.PUBLISHED ? `/course/${course._id}` : ''} >
                      <div className='flex flex-1 gap-x-4 cursor-pointer'>
                        <img
                          src={course.thumbnail}
                          alt={"course-thumbnail"}
                          className='h-[148px] w-[220px] rounded-lg object-cover'
                        />

                        <div className='flex flex-col justify-between' >
                          <p className='text-lg font-semibold text-richblack-5' >{course.title} :</p>
                          <p className='text-xs text-richblack-300' >
                            {
                              course.description.split(" ").length > NO_OF_WORDS
                                ?
                                course.description.split(" ").slice(0, NO_OF_WORDS).join(" ") + " ..."
                                :
                                course.description
                            }
                          </p>
                          <p className='text-xs text-white' >Created: {dateTimeFormatter(course.createdAt)}</p>
                          <div >
                            {
                              course.status === COURSE_STATUS.DRAFT
                                ?
                                <div className='flex gap-x-2 items-center w-fit text-sm py-[2px] px-2 rounded-full text-pink-100 bg-richblack-700 font-medium' >
                                  <HiClock size={14} />
                                  <span>Drafted</span>
                                </div>
                                :
                                <div className='flex gap-x-2 items-center w-fit text-sm py-[2px] px-2 rounded-full text-yellow-100 bg-richblack-700 font-medium'>
                                  <div className='grid place-items-center bg-yellow-100 text-richblack-700 h-3 aspect-square rounded-full' >
                                    <FaCheck size={8} />
                                  </div>
                                  <span>Published</span>
                                </div>
                            }
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>

                  <td className="text-sm font-medium text-richblack-100" >
                    {secToDurationFormatter(course.totalDuration)}
                  </td>

                  <td className="text-sm font-medium text-richblack-100">
                    ₹ {course.price}
                  </td>

                  <td className="text-sm font-medium text-richblack-100">
                    <button
                      disabled={loading}
                      onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                      title='Edit'
                      className='px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300'
                    >
                      <FiEdit2 size={20} />
                    </button>

                    <button
                      onClick={() => handleCourseDeleteClick(course)}
                      title='delete'
                      className='px-2 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]'
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>

                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {
        confirmationModalData && <ConfirmationModal
          modalData={confirmationModalData}
        />
      }
    </div>
  )
}

export default CourseTable
