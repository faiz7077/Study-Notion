import React from 'react'
import { useState } from 'react'
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignUpData } from '../../../redux/slices/authSlice';
import { sendOtp } from '../../../services/operations/authServices';

const LoginForm = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  })

  const { firstName, lastName, email, password, confirmPassword, role } = formData
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevData) => (
      {
        ...prevData,
        [e.target.name]: e.target.value
      }
    ))
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password and Confirm password do not match')
      return
    }

    // Setting signup data that will be used after otp verification
    dispatch(setSignUpData(formData));
    sendOtp(email, dispatch, navigate);
  }

  return (
    <div className='' >
      <form className='mt-6 flex w-full flex-col gap-y-4'
        onSubmit={handleOnSubmit} >

        {/* Radio butoons - Student / Instructor */}
        <div className='flex gap-x-1 bg-richblack-800 p-1 my-1 rounded-full max-w-max shadow-[0_1px_0] shadow-[rgba(255,255,255,0.3)]'>

          <label className={` py-2 px-5 rounded-full  cursor-pointer transition-all duration-200
            ${role === 'Student' ? 'bg-richblack-900 text-richblack-5' : 'bg-transparent text-richblack-200 '}
          `}>
            <input type="radio" name='role' value={'Student'} className='appearance-none' onClick={handleOnChange} />
            Student
          </label>

          <label className={` py-2 px-5 rounded-full  cursor-pointer transition-all duration-200
            ${role === 'Instructor' ? 'bg-richblack-900 text-richblack-5' : 'bg-transparent text-richblack-200 '}
          `}>
            <input type="radio" name='role' value={'Instructor'} className={`appearance-none`} onClick={handleOnChange} />
            Instructor
          </label>

        </div>

        {/* First Name and Last Name button */}
        <div className='flex gap-x-4' >
          <label className='w-full' >
            <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >First Name <sup className='text-pink-200' >*</sup></p>
            <input
              type='text'
              placeholder='Enter First Name'
              name='firstName'
              value={firstName}
              onChange={handleOnChange}
              required
              className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
            />
          </label>

          <label className='w-full' >
            <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >Last Name <sup className='text-pink-200' >*</sup></p>
            <input
              type='text'
              placeholder='Enter Last Name'
              name='lastName'
              value={lastName}
              onChange={handleOnChange}
              required
              className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
            />
          </label>
        </div>

        <label className='w-full' >
          <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >Email Address <sup className='text-pink-200' >*</sup></p>
          <input
            type="email"
            placeholder='Enter Email Address'
            name='email'
            value={email}
            onChange={handleOnChange}
            required
            className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
          />
        </label>

        <div className='flex gap-x-4' >
          <label className=' relative' >
            <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >Create Password <sup className='text-pink-200' >*</sup></p>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name='password'
              value={password}
              onChange={handleOnChange}
              required
              className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
            />

            <span className='absolute right-3 top-[38px] cursor-pointer'
              onClick={() => setShowPassword(prev => !prev)} >
              {
                showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              }
            </span>
          </label>

          <label className='relative' >
            <p className='mb-1 text-sm leading-[1.375rem] text-richblack-5' >Confirm Password <sup className='text-pink-200' >*</sup></p>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm Password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={handleOnChange}
              required
              className='w-full placeholder:text-richblack-400 rounded-lg p-3 pr-12 bg-richblack-700 text-richblack-5 shadow-[0_1px_0] shadow-[rgba(255,255,255,0.5)]'
            />

            <span className='absolute right-3 top-[38px] cursor-pointer'
              onClick={() => setShowConfirmPassword(prev => !prev)} >
              {
                showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              }
            </span>
          </label>
        </div>

        <button type='submit' className='mt-6 rounded-lg bg-yellow-50 py-2 px-3 font-medium text-richblack-900' >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default LoginForm
