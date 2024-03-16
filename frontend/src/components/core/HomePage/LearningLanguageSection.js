import React from 'react'
import HighlightedText from './HighlightedText'
import CTAButton from './CTAButton'
import Know_your_progress from '../../../assets/Images/Know_your_progress.png'
import Compare_with_others from '../../../assets/Images/Compare_with_others.png'
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'

const LearningLanguageSection = () => {
  return (
    <div className='flex flex-col mt-5 md:mt-10 mb-8 lg:mb-20 items-center' >
      <div>
        <div className='text-4xl font-semibold text-center' >
          Your swiss knife for
          <HighlightedText text="learning any language" />
        </div>

        <div className='mt-3 lg:w-[75%]  mx-auto text-center text-richblack-600 text-base font-medium' >Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</div>
      </div>

      <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0' >
        <img src={Know_your_progress} alt="Know_your_progress" className='object-contain lg:-mr-32' />

        <img src={Compare_with_others} alt="Compare_with_others" className='object-contain -mt-12 lg:-mb-10 lg:-mt-0' />

        <img src={Plan_your_lessons} alt="Plan_your_lessons" className='object-contain -mt-16 lg:-mt-5 lg:-ml-36' />
      </div>

      <div className='mt-5' >
        <CTAButton active={true} linkto={'/signup'} >
          Learn More
        </CTAButton>
      </div>

    </div>
  )
}

export default LearningLanguageSection
