import React from 'react'
import { HiUsers } from 'react-icons/hi';
import { ImTree } from 'react-icons/im';

const CourseCard = ({ course, currentCard, setCurrentCard }) => {
  return (
    <div
      onClick={() => setCurrentCard(course.heading)}
      className={`w-[360px] lg:w-[30%] h-[300px]  cursor-grab text-richblack-25
      ${course.heading === currentCard ? 'bg-white shadow-[12px_12px_0_0] shadow-yellow-50' : 'bg-richblack-800'}`} >



      <div className=' flex flex-col gap-3 h-[80%] p-6 border-b-2 border-dashed border-richblack-400' >
        <h2 className={`font-semibold text-xl
        ${course?.heading === currentCard && 'text-richblack-800'}`} >
          {course.heading}
        </h2>
        <h2 className='text-richblack-400' >{course.description}</h2>
      </div>

      <div className={`flex flex-row justify-between px-6 py-3 font-medium
              ${course?.heading === currentCard ? 'text-blue-300' : 'text-richblack-300'}`} >
        <div className='flex flex-row items-center gap-2 text-base' >
          <HiUsers />
          {course.level}
        </div>

        <div className='flex flex-row items-center  gap-2 text-base' >
          <ImTree />
          {course.lessionNumber}
          {' '}
          Lesson
        </div>
      </div>

    </div>
  )
}

export default CourseCard
