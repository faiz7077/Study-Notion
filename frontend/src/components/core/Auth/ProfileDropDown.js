import React from 'react'
import { useState } from 'react'
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../../services/operations/authServices'
import { useRef } from 'react'
import useOnClickOutside from '../../../hooks/useOnClickOutside'

const ProfileDropDown = () => {
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useOnClickOutside(modalRef, () => setModalOpen(false));

  const handleLogOutClick = (e) => {
    setModalOpen(false);
    logout(token, dispatch, navigate);
  }

  if (!user) return null;

  return (
    <div>
      <button className='relative' onClick={() => setModalOpen(true)} >

        <div className='flex gap-x-1 items-center' >
          <img src={user.avatar} className='w-[30px] rounded-full aspect-square object-cover' alt="user-avatar" />
          <AiOutlineCaretDown className='text-sm text-richblack-100' />
        </div>

        <div>
          {
            modalOpen &&
            (
              <div ref={modalRef} onClick={(e) => e.stopPropagation()} >
                <div className='absolute top-[120%] z-[1000] right-0 bg-richblack-800 rounded-md border border-richblack-700 divide-y divide-richblack-700 overflow-hidden ' >
                  <Link to={'/dashboard/my-profile'} onClick={() => setModalOpen(false)} >
                    <div className='flex gap-x-1 items-center w-full py-2.5 px-3 text-sm text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                      <VscDashboard className='text-lg' />
                      Dashboard
                    </div>
                  </Link>

                  <div className='flex gap-x-1 items-center w-full py-2.5 px-3 text-sm text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 cursor-pointer'
                    onClick={handleLogOutClick}>
                    <VscSignOut className='text-lg' />
                    LogOut
                  </div>

                </div>
              </div>
            )
          }
        </div>
      </button>

    </div>
  )
}

export default ProfileDropDown
