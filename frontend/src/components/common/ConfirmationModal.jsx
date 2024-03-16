import React from 'react'
import IconBtn from './IconBtn'
import { useRef } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutside'

const ConfirmationModal = ({ modalData }) => {
  // const modalData2 = {
  //   text1: 'Are you sure?',
  //   text2: 'You will be logged out of your account',
  //   btn1Text: 'Logout',
  //   btn2Text: 'Cancel',
  //   btn1Handler: () => logout(token, dispatch, navigate),
  //   btn2Handler: () => setIsModalOpen(false),
  //   closeModalHandler: () => setIsModalOpen(false),
  // }


  const modalDiv = useRef(null);

  useOnClickOutside(modalDiv, modalData.closeModalHandler);

  return (
    <div className='fixed !mt-0 inset-0 grid overflow-auto place-items-center bg-white bg-opacity-10 backdrop-blur-sm z-10' >

      <div className='bg-richblack-800 w-11/12 max-w-[350px] rounded-lg border border-richblack-400 p-6 ' ref={modalDiv} >
        <h2 className='text-richblack-5 font-semibold text-2xl' >{modalData.text1}</h2>
        <p className='text-richblack-200 mt-3 mb-5' >{modalData.text2}</p>

        <div className='flex items-center gap-x-4' >
          <IconBtn text={modalData?.btn1Text} onClickHandler={modalData?.btn1Handler} />
          <button onClick={modalData?.btn2Handler} className=' bg-richblack-200 text-richblack-900 py-2 px-5 font-semibold rounded-md' >{modalData?.btn2Text}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
