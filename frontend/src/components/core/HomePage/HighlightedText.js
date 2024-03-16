import React from 'react'

const HighlightedText = (props) => {
  return (
    <span className='font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]' >
      {" "}
      {props.text}
    </span>
  )
}

export default HighlightedText
