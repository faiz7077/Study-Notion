import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../../../../services/operations/courseServices';
import { setCourse, setEditCourse } from '../../../../redux/slices/addCourseSlice';
import Spinner from '../../../common/Spinner';
import RenderSteps from '../AddCourse/RenderSteps';
import { useDispatch } from 'react-redux';
import CourseUploadTips from '../AddCourse/CourseUploadTips';


const EditCourse = () => {

  const { courseId } = useParams();
  const { token } = useSelector(state => state.auth);
  const { course } = useSelector(state => state.addCourse);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result) {
        dispatch(setCourse(result));
        dispatch(setEditCourse(true));
      }
      setLoading(false)
    }
    fetchCourseDetails();
  }, [courseId, token, dispatch])



  return (
    <div >
      {
        loading ?
          (
            <div>
              <h1 className='mb-14 text-3xl font-medium text-richblack-5' >Edit Course</h1>
              <Spinner />
            </div>
          )
          :
          course ?
            (
              <div className='flex items-start gap-x-6 w-full' >
                <div className='flex flex-col flex-1' >
                  <h1 className='mb-14 text-3xl font-medium text-richblack-5' >Edit Course</h1>

                  <div className='flex-1' >
                    <RenderSteps />
                  </div>
                </div>

                {/* Course Upload Tips */}
                <div className='hidden lg:block' >
                  <CourseUploadTips />
                </div>
              </div>
            )
            :
            (
              <div>
                <h1 className='mb-14 text-3xl font-medium text-richblack-5' >Edit Course</h1>
                <div className='h-[1px] mb-10  mx-auto bg-richblack-500' ></div>
                <p className='text-center text-3xl font-semibold text-richblack-100 select-none' >No such Course Found</p>
              </div>
            )
      }
    </div>
  )
}

export default EditCourse
