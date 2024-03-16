import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../../../common/IconBtn';
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { MdNavigateBefore } from "react-icons/md"
import { resetCourseState, setStep } from '../../../../../redux/slices/addCourseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { editCourseDetails } from '../../../../../services/operations/courseServices';



const PublishCourse = () => {

  const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course } = useSelector(state => state.addCourse);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);


  useEffect(() => {
    if (course && course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("makePublic", true);
    }
  }, [course, setValue])

  const handleGoBack = () => {
    dispatch(setStep(2));
  }


  const goToMyCourses = () => {
    dispatch(resetCourseState());
    navigate('/dashboard/my-courses');
  }

  const handleSaveChanges = async (data) => {
    const courseStatus = getValues("makePublic") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;

    // Check if makePublic has been updated or not
    if (course?.status === courseStatus) {
      // form has not been updated
      goToMyCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append("status", courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData, token);
    setLoading(false);
    if (result) {
      goToMyCourses();
    }
  }

  return (
    <div className='bg-richblack-800 rounded-md p-6 border border-richblack-700 space-y-6'>

      <p className='text-2xl font-semibold text-richblack-5' >Publish Settings</p>

      <form onSubmit={handleSubmit(handleSaveChanges)} >
        <div className='flex items-center mb-8 gap-x-2' >
          <input
            type='checkbox'
            id="makePublic"
            disabled={loading}
            className='h-4 w-4 focus:ring-2 focus:ring-richblack-5 rounded bg-richblack-500 text-richblack-400  border-pure-greys-300'
            {...register("makePublic")}
          />
          <label className='text-lg text-richblack-400' htmlFor="makePublic">Make this course as public</label>
        </div>


        {/* Back and Next button */}
        <div className='flex justify-end gap-x-4' >
          <button
            type='button'
            onClick={handleGoBack}
            disabled={loading}
            className={"flex cursor-pointer items-center gap-x-2 py-2 px-5 rounded-md bg-richblack-300 text-richblack-900 font-semibold hover:scale-95 transition-all duration-200"}
          >
            <MdNavigateBefore />
            Back
          </button>

          <IconBtn
            type="submit"
            text="Save Changes"
            disabled={loading}
          >
          </IconBtn>
        </div>
      </form>

    </div>
  )
}

export default PublishCourse;
