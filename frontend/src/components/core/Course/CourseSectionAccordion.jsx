import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { BsFillCameraVideoFill } from 'react-icons/bs'

const CourseSectionAccordion = ({ section, openSections, handleOpenSection }) => {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionsDiv = useRef(null);

  useEffect(() => {
    setIsSectionOpen(openSections.includes(section._id))
  }, [openSections, section])

  useEffect(() => {
    setSectionHeight(isSectionOpen ? sectionsDiv?.current?.scrollHeight : 0)
  }, [isSectionOpen])

  return (
    <div className='border border-solid  border-richblack-600 text-richblack-5 overflow-hidden' >
      <div
        className='bg-richblack-700 flex justify-between items-center cursor-pointer px-7 py-6 '
        onClick={() => handleOpenSection(section._id)}
      >
        <div className='flex items-center gap-2' >
          <i className={`${isSectionOpen && "rotate-90"}  translate-all duration-[0.35s] ease-[ease]`}>
            <AiOutlineRight />
          </i>
          <p>{section.title}</p>
        </div>

        <div className='text-yellow-25' >
          {section.subSections.length} lecture(s)
        </div>
      </div>

      <div
        ref={sectionsDiv}
        className='bg-richblack-900 h-0 translate-all duration-[0.35s] ease-[ease] overflow-hidden'
        style={{ height: sectionHeight }}
      >
        <div className='flex flex-col gap-2 px-7 py-6 font-semibold' >
          {
            section?.subSections.map((subSection, ind) => (
              <div key={ind} className='flex items-center gap-2 py-2'  >
                <BsFillCameraVideoFill />
                <p>{subSection.title}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default CourseSectionAccordion
