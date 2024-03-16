import React, { useState } from 'react'
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { resetPassword } from '../services/operations/authServices';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BsFillCheckCircleFill } from 'react-icons/bs'

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const { loading } = useSelector(state => state.auth)

  const { password, confirmPassword } = formData
  const resetToken = searchParams.get('reset-token');

  if (!resetToken) {
    return <Navigate to={'/login'} />
  }

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const handleOnResetPassword = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(`Passwords don't match`)
      return;
    }
    resetPassword(resetToken, password, dispatch, navigate)
  }

  return (
    <div className='text-white bg-richblack-900 min-h-[calc(100vh-3.5rem)] flex place-items-center' >
      {
        loading
          ?
          (<div className='w-full'><Spinner /></div>)
          :
          (
            <div className='w-11/12 max-w-[500px] p-4 lg:p-8 mx-auto  flex flex-col' >
              <h2 className='text-3xl font-semibold leading-[2.375rem] text-richblack-5' >
                Choose new password
              </h2>


              <p className='text-richblack-100 my-4 text-lg leading-[1.625rem]' >
                Almost done. Enter your new password and you're all set.
              </p>

              <form onSubmit={handleOnResetPassword}>
                <label className='block relative' >
                  <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >New Password <sup className='text-pink-200' >*</sup></p>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter Password'
                    name='password'
                    value={password}
                    onChange={handleOnChange}
                    required
                    className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
                  />

                  <span className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowPassword((prev) => !prev)} >
                    {
                      showPassword ? <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' /> : <AiOutlineEye fontSize={24} fill='#AFB2BF' />
                    }
                  </span>
                </label>

                <label className='block relative' >
                  <p className='mb-1 mt-6 text-sm leading-[1.375rem] text-richblack-5' >Confirm New Password <sup className='text-pink-200' >*</sup></p>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleOnChange}
                    required
                    className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
                  />

                  <span className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowConfirmPassword((prev) => !prev)} >
                    {
                      showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' /> : <AiOutlineEye fontSize={24} fill='#AFB2BF' />
                    }
                  </span>
                </label>

                {/* Instruction about password */}
                <div className='mt-6 flex flex-row gap-x-3 text-xs leading-[20px] text-caribbeangreen-300' >
                  <div className='flex flex-col gap-y-1' >
                    <div className='flex gap-x-1 items-center' >
                      <BsFillCheckCircleFill />
                      One Lowercase Character
                    </div>
                    <div className='flex gap-x-1 items-center' >
                      <BsFillCheckCircleFill />
                      One Uppercase Character
                    </div>
                    <div className='flex gap-x-1 items-center' >
                      <BsFillCheckCircleFill />
                      One number
                    </div>
                  </div>

                  <div className='flex flex-col gap-y-1' >
                    <div className='flex gap-x-1 items-center' >
                      <BsFillCheckCircleFill />
                      One Special Character
                    </div>
                    <div className='flex gap-x-1 items-center' >
                      <BsFillCheckCircleFill />
                      8 Character Minimum
                    </div>
                  </div>
                </div>

                <button type='submit' className='w-full mt-6 rounded-lg bg-yellow-50 p-3 font-medium text-richblack-900' >
                  Reset Password
                </button>
              </form>

              <Link to={'/login'} >
                <div className='mt-6 flex items-center gap-x-2 text-richblack-5 '>
                  <BiArrowBack />
                  <p>Back To Login</p>
                </div>
              </Link>
            </div>
          )
      }
    </div>
  )
}

export default ResetPassword
