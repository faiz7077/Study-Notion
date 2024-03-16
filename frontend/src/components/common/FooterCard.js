import React from 'react'
import { Link } from 'react-router-dom'

const FooterCard = ({ data }) => {
  return (
    <div className='mb-7' >
      <h2 className='text-richblack-50 font-semibold text-base' >{data.title}</h2>
      <div className='flex flex-col gap-3 mt-2' >
        {
          data.links.map((link, index) => {
            return (
              <div key={index} className='text-sm cursor-pointer text-richblack-400 hover:text-richblack-50 transition-all duration-200'  >
                <Link to={link.link} >
                  {link.title}
                </Link>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default FooterCard
