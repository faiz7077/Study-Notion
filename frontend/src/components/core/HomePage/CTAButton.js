import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold 
      ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"}
      hover:scale-95 transition-all duration-200 drop-shadow-[2px_2px_rgba(255,255,255,0.18)] hover:drop-shadow-none `}>
        {children}
      </div>
    </Link>

  )
}

export default CTAButton
