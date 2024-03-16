import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../../common/IconBtn'
import { toast } from 'react-hot-toast'
import { buyCourses } from '../../../../services/operations/paymentServices'

const CartAmount = () => {
  const { cartItems, cartTotalAmount } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBuyCourse = async () => {
    const courses = cartItems.map(course => course._id);
    await buyCourses(courses, user, token, true, dispatch, navigate);
  }

  return (
    <div className='min-w-[280px] mx-auto md:mx-0 rounded-md border border-richblack-700 bg-richblack-800 p-6' >
      <p className='text-xm font-medium text-richblack-300 mb-1' >Total : </p>
      <p className='text-3xl font-medium text-yellow-100 mb-6' >₹ {cartTotalAmount}</p>

      <IconBtn
        text='Buy Now'
        onClickHandler={handleBuyCourse}
        disabled={loading}
        customClasses={'w-full justify-center'}
      />
    </div>
  )
}

export default CartAmount
