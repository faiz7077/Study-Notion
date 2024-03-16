import React from 'react'
import RenderSteps from './RenderSteps'
import CourseUploadTips from './CourseUploadTips'

const AddCourse = () => {
  return (
    <div className='flex items-start gap-x-6 w-full' >
      <div className='flex flex-col flex-1' >
        <h1 className='text-3xl font-medium text-richblack-5 mb-14' >Add Course</h1>

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
}

export default AddCourse
