import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io'
import SectionAccordion from './SectionAccordion';
import { Link } from 'react-router-dom';

const CourseDetailsSidebar = ({ currentOpenSection, setCurrentOpenSection, currentSubSection, setCurrentSubSection, setIsOpenReviewModal }) => {
  const { courseData, completedVideos, totalNoOfVideos } = useSelector(state => state.viewCourse);
  const navigate = useNavigate();

  return (
    <div className='bg-richblack-800 w-full h-full flex border-r border-richblack-700' >
      <div className='flex flex-col w-full h-full' >
        <div className='flex flex-col mx-5 mb-5 items-start justify-between gap-x-2 border-b border-richblack-600 py-5 text-lg text-richblack-25'
        >

          <div className='flex flex-col md:flex-row w-full md:items-center md:justify-between gap-y-4' >
            <Link to="/dashboard/enrolled-courses">
              <div
                className='flex items-center justify-center h-[25px] aspect-square rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 transition-all duration-200'
                title='back'
              >
                <IoIosArrowBack size={20} />
              </div>
            </Link>

            <IconBtn
              text={"Add Review"}
              type={"button"}
              onClickHandler={() => setIsOpenReviewModal(true)}
              customClasses={"!py-0 !px-2"}
            />
          </div>
          <p className='mt-3 text-lg font-bold' >{courseData.title}</p>

          <p className=' text-caribbeangreen-500 text-sm font-semibold' >{completedVideos.length}/{totalNoOfVideos}</p>
        </div>


        <div className='overflow-y-auto' >
          {
            courseData.sections.map((section, ind) => (
              <SectionAccordion
                key={ind}
                section={section}
                currentOpenSection={currentOpenSection}
                setCurrentOpenSection={setCurrentOpenSection}
                currentSubSection={currentSubSection}
                setCurrentSubSection={setCurrentSubSection}
              />
            ))
          }
        </div>


      </div>
    </div>
  )
}

export default CourseDetailsSidebar
