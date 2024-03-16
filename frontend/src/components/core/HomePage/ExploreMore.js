import React from 'react'
import { useState } from 'react'
import HighlightedText from './HighlightedText'
import CourseCard from './CourseCard'
import homePageExplore from '../../../data/homePageExplore'

const ExploreMore = () => {

  const courseTypes = ['Free', 'New to coding', 'Most popular', 'Skills paths', 'Career paths'];
  const [currentTab, setCurrentTab] = useState(0);
  const [currentCourses, setCurrentCourses] = useState(homePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(homePageExplore[0].courses[0].heading)

  const setCurrentTabAndCards = (tabInd) => {
    setCurrentTab(tabInd)
    setCurrentCourses(homePageExplore[tabInd].courses)
    setCurrentCard(homePageExplore[tabInd].courses[0].heading)
  }

  return (
    <div className='flex flex-col mt-10' >
      <div >
        <div className='text-4xl text-center font-semibold' >
          Unlock the
          <HighlightedText text="Power of Code" />
        </div>
        <p className='text-lg mt-1 text-richblack-300 text-center font-semibold' >Learn to Build Anything You Can Imagine</p>
      </div>

      {/* Tabs Section */}
      <div className='hidden lg:flex gap-5 mx-auto w-max rounded-full mt-5 bg-richblack-800 text-richblack-200 p-1 font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]' >
        {
          courseTypes.map((tab, ind) => {
            return (
              <div
                key={ind}
                onClick={() => setCurrentTabAndCards(ind)}
                className={`text-base cursor-pointer rounded-full px-7 py-[7px] 
                ${ind === currentTab ? 'bg-richblack-900 text-richblack-5 font-medium' : 'text-richblack-200'}
                hover:bg-richblack-900 hover:text-richblack-5 transition-all duration-200
                `}
              >
                {tab}
              </div>
            )
          })
        }
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Card Section */}
      <div className='flex flex-col lg:flex-row justify-center lg:justify-between gap-10 lg:gap-0 px-3 lg:px-0 mt-10 lg:mt-0 mb-7 lg:mb-0 
      lg:absolute lg:bottom-0 lg:translate-y-[50%] lg:left-[50%] lg:translate-x-[-50%] w-full'>
        {
          currentCourses.map((course, ind) => {
            return (
              <CourseCard key={ind} course={course} currentCard={currentCard} setCurrentCard={setCurrentCard} />
            )
          })
        }
      </div>
    </div>
  )
}

export default ExploreMore
