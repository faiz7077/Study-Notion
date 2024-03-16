import React from 'react'
import { useSelector } from 'react-redux'
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import Spinner from '../components/common/Spinner';
import OtpInput from 'react-otp-input'
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendOtp, signUp } from '../services/operations/authServices';

const VerifyEmail = () => {
  const email = useSelector(state => state.auth?.signUpData?.email) ?? '';
  const { loading, signUpData } = useSelector(state => state.auth)
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerifyAndSignUp = (e) => {
    e.preventDefault();
    signUp({ ...signUpData, otp }, dispatch, navigate);
  }

  if (!signUpData) {
    return <Navigate to={'/signup'} />
  }

  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex justify-center items-center'>
      {
        loading ?
          (
            <div><Spinner /></div>
          )
          :
          (
            <div className='max-w-[500px] p-4 lg:p-8' >
              <h2 className=' text-3xl text-richblack-5 font-semibold' >Verify Email</h2>
              <p className='text-lg text-richblack-100 my-4 ' >A verification code has been sent to your email <span className='font-bold' >{email}</span>. Enter the code below</p>

              <div>
                <form onSubmit={handleVerifyAndSignUp} >
                  <div className='text-white' >
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => (
                        <input {...props} placeholder='-' className='w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-lg aspect-square text-richblack-5 text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 shadow-[0_1px_0_rgba(255,255,255,0.3)]'
                          style={{}}
                        />
                      )}
                      containerStyle={{
                        justifyContent: 'space-between',
                        gap: '0 6px'
                      }}
                    />
                  </div>
                  <button type='submit' className='w-full bg-yellow-50 p-3 rounded-lg mt-6 font-medium text-richblack-900' >
                    Verify Email
                  </button>
                </form>
              </div>


              <div className='mt-6 flex items-center justify-between' >
                <Link to={'/signup'} >
                  <div className='flex items-center gap-x-2 text-richblack-5 '>
                    <BiArrowBack />
                    <p>Back to SignUp</p>
                  </div>
                </Link>

                <button className='flex items-center gap-x-2 text-blue-100'
                  onClick={() => sendOtp(signUpData.email, dispatch, navigate)} >
                  <RxCountdownTimer />
                  <p>Resend OTP</p>
                </button>
              </div>
            </div>
          )
      }
    </div>
  )
}

export default VerifyEmail
