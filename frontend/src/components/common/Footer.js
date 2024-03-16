import React from 'react'
import footerLinks from '../../data/footerLinks'
import FooterCard from './FooterCard'

import { Link } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa'


const Footer = () => {

  const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
  const section2 = [];
  for (let i = 5; i <= 7; i++) {
    section2.push(
      <div key={i} className='w-[48%] lg:w-[30%]' >
        <FooterCard data={footerLinks[i]} />
      </div>
    );
  }

  return (
    <div className='bg-richblack-800' >
      <div className='flex flex-col  text-white w-11/12 max-w-maxContent mx-auto pt-14' >
        {/* Upper Section */}
        <div className='flex flex-col lg:flex-row border-b border-richblack-700 pb-5' >
          {/* left section */}
          <div className='lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3' >

            <div className='w-[48%] lg:w-[30%] flex flex-col gap-3 ' >
              <Link to={'/'} >
                <img src={logo} alt="logo" className='object-contain' />
              </Link>
              <FooterCard data={footerLinks[0]} />
              <div className='flex gap-3 text-lg text-richblack-400 -mt-5'>
                <Link to={'https://www.linkedin.com/in/sunny8080/'} ><FaLinkedin /></Link>
                <Link to={'https://twitter.com/sunny8080_'} ><FaTwitter /></Link>
                <Link to={'https://www.youtube.com/'} ><FaYoutube /></Link>
                <Link to={'https://www.facebook.com/sunny80801/'} ><FaFacebook /></Link>
                <Link to={'https://www.instagram.com/sunny8080_/'} ><FaInstagram /></Link>
              </div>
            </div>

            <div className='w-[48%] lg:w-[30%] flex flex-col' >
              <FooterCard data={footerLinks[1]} />
              <FooterCard data={footerLinks[2]} />
            </div>

            <div className='w-[48%] lg:w-[30%] flex flex-col' >
              <FooterCard data={footerLinks[3]} />
              <FooterCard data={footerLinks[4]} />
            </div>

          </div>

          {/* Subjects, Languages, career building sections */}
          <div className='lg:w-[50%] flex flex-row flex-wrap  justify-between pl-3 lg:pl-5' >
            {
              section2
            }
          </div>

        </div>

        {/* Bottom section */}
        <div className='flex flex-col lg:flex-row justify-between items-center text-richblack-400 text-sm py-14' >
          <div className='flex flex-row' >
            {
              BottomFooter.map((ele, ind) => {
                return (
                  <Link to={ele.split(' ').join('-').toLowerCase()} key={ind} >
                    <div
                      className={`cursor-pointer hover:text-richblack-50 transition-all duration-200 px-3 
                                ${ind !== BottomFooter.length - 1 ? ' border-r border-richblack-700 ' : ''} `}>
                      {ele}
                    </div>

                  </Link>
                )
              })
            }
          </div>


          <div className='text-center' >
            Made with ❤️ Sunny8080 © 2023 StudyNotion
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
