import React from 'react'
import learningGridData from '../../../data/learningGridData'
import HighlightedText from '../HomePage/HighlightedText'
import CTAButton from '../HomePage/CTAButton'

const LearningGrid = () => {
  return (
    <div className='grid grid-cols-1  max-w-[350px] lg:max-w-fit lg:grid-cols-4 mx-auto mb-12' >
      {
        learningGridData.map((data, index) => (
          <div
            key={index}
            className={`  
            ${data.order < 0 && 'row-span-2 lg:col-span-2'}
            ${data.order < 0 ? 'h-[320px] lg:h-[294px]' : 'h-[250px] lg:h-[294px]'}
            ${data.order === 3 && 'lg:col-start-2'}
            ${data.order < 0 ? 'bg-transparent'
                : data.order % 2 === 0 ? 'bg-richblack-800' : 'bg-richblack-700'
              }
            `}
          >
            {
              index > 0
                ?
                <div className='flex flex-col gap-8 p-8 h-[200px]' >
                  <h1 className='text-richblack-5 text-lg'>{data.heading}</h1>
                  <p className='text-richblack-300 font-medium'>{data.description}</p>
                </div>
                :
                <div className='flex flex-col gap-3 pb-10 lg:pb-0 lg:w-[90%]' >
                  <h1 className='font-semibold text-2xl lg:text-4xl text-richblack-5' >
                    {data.heading}
                    <HighlightedText text={data.highlightText} />
                  </h1>

                  <p className='text-richblack-300 font-medium' >Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.</p>

                  <div className='w-fit mt-2'>
                    <CTAButton active={true} linkto={data.BtnLink}>
                      {
                        data.BtnText
                      }
                    </CTAButton>
                  </div>
                </div>
            }
          </div>
        ))
      }
    </div>
  )
}

export default LearningGrid
