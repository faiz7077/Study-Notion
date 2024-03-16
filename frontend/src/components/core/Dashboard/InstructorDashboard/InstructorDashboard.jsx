import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { Link } from 'react-router-dom';
import { getInstructorDashboardData } from '../../../../services/operations/profileServices';
import InstructorChart from './InstructorChart';



const InstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth)
  const { user } = useSelector(state => state.profile)
  const [dashboardData, setDashboardData] = useState(null);


  useEffect(() => {
    const fetchInstructorDashboardData = async () => {
      setLoading(true);
      const response = await getInstructorDashboardData(token);
      if (response) {
        setDashboardData(response);
      }
      // console.log(response);

      // Fetch created Courses
      // const result = await getCreatedCourses(token);
      // if (result) {
      //   setCourses(result);
      // }
      setLoading(false);
    };
    fetchInstructorDashboardData();
  }, [token]);



  return (
    <div>
      <div className='space-y-2' >
        <p className='text-richblack-5 text-2xl font-bold ' >Hi, {user.firstName} 👋 </p>
        <p className='text-richblack-200 font-medium ' >Let's start something new</p>
      </div>

      <div>
        {
          loading ?
            (
              <div className='h-[calc(100vh-10rem)] grid place-items-center' >
                <Spinner />
              </div>
            )
            : !dashboardData || dashboardData.totalPublishedCourses === 0 ?
              (
                <div className='text-center mt-20 bg-richblack-800 px-6  py-20 rounded-md' >
                  <p className='text-2xl font-bold text-richblack-5' >You have <span className='font-extrabold text-pink-50'>not</span> published any courses yet</p>
                  <Link to={'/dashboard/add-course'} >
                    <p className='mt-3  text-lg font-semibold text-yellow-50 underline' >Create a course</p>
                  </Link>
                </div>
              )
              :
              (
                <div>
                  {/* Pie charts and Stats */}
                  <div className='flex flex-col md:flex-row gap-5 my-10' >
                    {/* Statistics */}
                    <div className='min-h-fit min-w-[250px] rounded-md bg-richblack-800 p-6' >
                      <p className='text-lg font-bold text-richblack-5' >Statistics</p>

                      <div className='flex flex-col gap-4 mt-4 mb-4' >
                        <div>
                          <p className='text-lg text-richblack-200' >Total Courses</p>
                          <p className='text-3xl font-semibold text-richblack-50' >{dashboardData.totalPublishedCourses}</p>
                        </div>

                        <div>
                          <p className='text-lg text-richblack-200'>Total Students</p>
                          <p className='text-3xl font-semibold text-richblack-50'>{dashboardData.totalStudents}</p>
                        </div>

                        <div>
                          <p className='text-lg text-richblack-200'>Total Income</p>
                          <p className='text-3xl font-semibold text-richblack-50'>₹ {dashboardData.totalIncome}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pie charts */}
                    <div className='w-full' >
                      {
                        (dashboardData.totalIncome > 0 || dashboardData.totalStudents > 0)
                          ?
                          (
                            <div className='h-full' >
                              <InstructorChart dashboardData={dashboardData} />
                            </div>
                          )
                          :
                          (
                            <div className='bg-richblack-800 h-full  rounded-md p-6' >
                              <p className='text-lg text-richblack-5 font-bold' >Visualize</p>
                              <p className='mt-4 text-xl text-richblack-200 font-medium ' >Not Enough Data To Visualize</p>
                            </div>
                          )
                      }
                    </div>
                  </div>

                  {/* Published Courses */}
                  <div className='w-full rounded-md bg-richblack-800 p-6' >
                    <div className='flex justify-between items-center' >
                      <p className='text-richblack-5 text-lg font-bold' >Your Published Courses</p>
                      <Link to={'/dashboard/my-courses'} >
                        <div className=' text-yellow-50 text-xs font-semibold' >
                          View All
                        </div>
                      </Link>
                    </div>

                    <div className='flex flex-col md:flex-row gap-x-5 gap-y-7 my-4' >
                      {
                        dashboardData.coursesWithStats.slice(0, 3).map((courseWithStats, ind) => (
                          <div key={ind} className='w-full md:w-1/3' >
                            <img
                              src={courseWithStats.course.thumbnail}
                              alt="Course-thumbnail"
                              className='h-[200px] w-full rounded-md object-cover'
                            />

                            <p className='mt-3 text-sm font-medium text-richblack-50' >{courseWithStats.course.title}</p>

                            <p className='mt-1 text-xs font-medium text-richblack-300' >{courseWithStats.course.numberOfEnrolledStudents} students | ₹ {courseWithStats.course.price}</p>
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

export default InstructorDashboard
