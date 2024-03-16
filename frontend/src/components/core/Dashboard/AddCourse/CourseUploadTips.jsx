import React from 'react'

const CourseUploadTips = () => {
  return (
    <div className='sticky lg:block top-10 max-w-[400px] flex-1 rounded-md border border-richblack-700 bg-richblack-800 p-6 ' >
      <p className='text-lg text-richblack-5 mb-8' >⚡ Course Upload Tips</p>

      <ul className='ml-5 list-item list-disc space-y-4 text-xs text-richblack-5'>
        <li>Set the Course Price option or make it free.</li>
        <li>Standard size for the course thumbnail is 1024x576.</li>
        <li>Video section controls the course overview video.</li>
        <li>Course Builder is where you create & organize a course.</li>
        <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
        <li>Information from the Additional Data section shows up on the course single page.</li>
        <li>Make Announcements to notify any important</li>
        <li>Notes to all enrolled students at once.</li>
      </ul>

    </div>
  )
}

export default CourseUploadTips
