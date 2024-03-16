import React from 'react'
import HighlightedText from '../HomePage/HighlightedText'

const Quote = () => {
  return (
    <div className='mx-auto pb-20 lg:py-20' >
      <h1 className='text-xl lg:text-4xl lg:text-center font-semibold' >
        We are passionate about revolutionizing the way we learn. Our innovative platform
        <HighlightedText text={'combines technology'} />,
        <span className='font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819]'> expertise</span>, and community to create an
        <span className='font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#E65C00] to-[#F9D423]' > unparalleled educational experience.</span>
      </h1>
    </div>
  )
}

export default Quote
