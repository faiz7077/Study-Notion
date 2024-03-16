import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { setCourse, setEditCourse, setStep } from '../../../../../redux/slices/addCourseSlice';
import toast from 'react-hot-toast';
import { IoAddCircleOutline } from "react-icons/io5"
import NestedView from './NestedView';
import { createSection, updateSection } from '../../../../../services/operations/sectionSubsectionServices';



const CourseBuilderForm = () => {
  const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { course } = useSelector(state => state.addCourse);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);
  const [editSectionId, setEditSectionId] = useState(null);

  const handleCreateSection = async (data) => {
    setLoading(true);
    let result = null;

    if (editSectionId) {
      // edit section
      const formData = new FormData();
      formData.append("sectionId", editSectionId);
      formData.append("title", data.sectionName);
      formData.append("courseId", course._id);
      result = await updateSection(formData, token);
    } else {
      // create section
      const formData = new FormData();
      formData.append("title", data.sectionName);
      formData.append("courseId", course._id);
      result = await createSection(formData, token);
    }
    if (result) {
      dispatch(setCourse(result));
      setEditSectionId(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  }

  const handleCancelEditSection = () => {
    setEditSectionId(null);
    setValue("sectionName", "");
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (sectionId === editSectionId) {
      handleCancelEditSection();
      return;
    }
    setEditSectionId(sectionId);
    setValue("sectionName", sectionName);
  }

  const handleGoBack = () => {
    dispatch(setEditCourse(true));
    dispatch(setStep(1));
  }

  const handleGoToNext = () => {
    if (course.sections.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }

    if (course.sections.some((section) => section.subSections.length === 0)) {
      toast.error("Please add atleast one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  }

  return (
    <div className=' bg-richblack-800 rounded-md p-6 border border-richblack-700 space-y-8' >
      <p className='text-2xl font-semibold text-richblack-5' >Course Builder</p>

      <form onSubmit={handleSubmit(handleCreateSection)} className='space-y-4'>
        <div className='flex flex-col' >
          <label className='label-style' htmlFor="sectionName">Section Name <sup className='text-pink-200' >*</sup></label>
          <input
            type='text'
            id="sectionName"
            disabled={loading}
            placeholder='Add a section to build course'
            className='input-style'
            {...register("sectionName", { required: true })}
          />
          {
            errors.sectionName && <p className='input-error-style' >Section name is required</p>
          }
        </div>

        {/* Create section Button */}
        <div className='flex items-end gap-x-4' >
          <IconBtn
            type="submit"
            text={editSectionId ? "Edit Section Name" : "Create Section"}
            outline={true}
            disabled={loading}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>

          {
            editSectionId && (
              <button
                type='button'
                onClick={handleCancelEditSection}
                className='text-sm text-richblack-300 underline'
              >
                Cancel Edit
              </button>
            )
          }
        </div>
      </form>


      {/* Nested view */}
      {
        course && course.sections?.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        )
      }


      {/* Back and Next button */}
      <div className='flex justify-end gap-x-3' >
        <button
          type='button'
          onClick={handleGoBack}
          disabled={loading}
          className={"flex cursor-pointer items-center gap-x-2  py-2 px-5 rounded-md bg-richblack-300 text-richblack-900 font-semibold hover:scale-95 transition-all duration-200"}
        >
          <MdNavigateBefore />
          Back
        </button>

        <IconBtn
          type="button"
          text="Next"
          disabled={loading}
          onClickHandler={handleGoToNext}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm
