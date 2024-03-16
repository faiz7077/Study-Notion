import React from 'react'
import { useSelector } from 'react-redux'
import frame from '../../../assets/Images/frame.png'
import Spinner from '../../common/Spinner'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

const Template = ({ heading, desc1, desc2, image, formType }) => {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className='bg-richblack-900 min-h-[calc(100vh-3.5rem)] flex place-items-center ' >
      {
        loading ?
          (
            <div className='w-full' ><Spinner /></div>
          )
          :
          (
            <div className='w-11/12 mx-auto max-w-maxContent flex flex-col-reverse md:flex-row justify-between gap-y-12 md:gap-y-0 md:gap-x-12 py-12 ' >
              <div className='mx-auto w-11/12 max-w-[450px] md:mx-0 ' >
                <h1 className='text-3xl font-semibold leading-[2.375rem] text-richblack-5' >{heading}</h1>
                <p className='mt-4 text-lg leading-[1.625rem] ' >
                  <span className='text-richblack-100' >
                    {desc1}
                  </span>
                  {' '}
                  <span className='font-edu-sa font-bold italic text-blue-100' >
                    {desc2}
                  </span>
                </p>

                <div>
                  {
                    formType === 'login' ? <LoginForm /> : <SignUpForm />
                  }
                </div>
              </div>

              <div className='relative mx-auto md:mx-0 w-11/12 max-w-[450px] ' >
                <img src={frame} className='' width={558} height={504} loading='lazy' alt="pattern" />
                <div className='' >
                  <img src={image} className='absolute -top-4 right-4 z-10' width={558} height={504} loading='lazy' alt="Students" />
                </div>
              </div>
            </div>
          )

      }
    </div>
  )
}

export default Template
