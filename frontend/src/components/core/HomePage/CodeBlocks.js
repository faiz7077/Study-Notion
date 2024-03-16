import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import CTAButton from './CTAButton';
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({ flexDir, heading, subHeading, ctaBtn1, ctaBtn2, codeText, codeColor, noOfLines, codeBlockId }) => {

  let leftColumns = [];
  for (let i = 1; i <= noOfLines; i++) {
    leftColumns.push(<p key={i} >{i}</p>);
  }

  return (
    <div className={`flex flex-col ${flexDir} my-10 md:my-20 justify-between gap-10 `} >
      {/* Section 1 - left */}
      <div className='w-full md:w-[50%] flex flex-col gap-8' >
        {heading}
        <div className='text-richblack-300  font-bold w-[85%] -mt-3' >
          {subHeading}
        </div>

        <div className='flex mt-7 gap-7' >
          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto} >
            <div className='flex flex-row items-center gap-2' >
              {ctaBtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto} >
            {ctaBtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2 - right */}
      <div className='flex flex-row py-3 lg:w-[470px] border-2 border-richblack-600 h-fit text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative '>

        <div className={`absolute ${codeBlockId}`}>
        </div>

        <div className='w-[10%] flex flex-col text-center select-none text-richblack-400 font-inter font-bold ' >
          {
            leftColumns
          }
        </div>

        <div className={`w-[90%] ${codeColor} font-mono pr-2`} >
          <TypeAnimation
            sequence={[codeText, 2000, '']}
            omitDeletionAnimation={true}
            repeat={Infinity}
            style={{
              whiteSpace: 'pre-wrap',
              display: 'block',
              fontWeight: 'bold',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBlocks
