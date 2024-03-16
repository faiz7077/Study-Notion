import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import { useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { MdNavigateNext } from "react-icons/md"
import { setCourse, setStep } from '../../../../../redux/slices/addCourseSlice';
import { addCourse, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseServices';
import ChipInput from './ChipInput';
import UploadFile from '../UploadFile';
import RequirementsField from './RequirementsField';
import toast from 'react-hot-toast';


const CourseInformationForm = () => {

  const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editCourse, course } = useSelector(state => state.addCourse);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { token } = useSelector(state => state.auth);


  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      setCourseCategories(categories);
      setLoading(false);
    };
    getCategories();

  }, []);

  useEffect(() => {
    // if form is in edit mode 
    if (editCourse && courseCategories) {
      setValue("courseTitle", course.title)
      setValue("courseDesc", course.description)
      setValue("coursePrice", course.price)
      setValue("courseCategory", course.category._id)
      setValue("courseBenefits", course.whatYouWillLearn)
    }
  }, [editCourse, course, setValue, courseCategories]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      !(
        currentValues.courseTitle === course.title &&
        currentValues.courseDesc === course.description &&
        currentValues.coursePrice === course.price &&
        currentValues.courseCategory === course.category._id &&
        currentValues.courseBenefits === course.whatYouWillLearn &&
        currentValues.courseTags.toString() === course.tags.toString() &&
        currentValues.courseThumbnail === course.thumbnail &&
        currentValues.courseRequirements.toString() === course.instructions.toString()
      )
    ) {
      return true;
    }
    return false;
  }

  const handleCourseEdit = async (data) => {
    const formData = new FormData();
    formData.append("courseId", course._id);

    if (data.courseTitle !== course.title) {
      formData.append("title", data.courseTitle);
    }

    if (data.courseDesc !== course.description) {
      formData.append("description", data.courseDesc);
    }

    if (data.coursePrice !== course.price) {
      formData.append("price", data.coursePrice);
    }

    if (data.courseCategory !== course.category._id) {
      formData.append("category", data.courseCategory);
    }

    if (data.courseBenefits !== course.whatYouWillLearn) {
      formData.append("whatYouWillLearn", data.courseBenefits);
    }

    if (data.courseTags.toString() !== course.tags.toString()) {
      formData.append("tags", JSON.stringify(data.courseTags));
    }

    if (data.courseThumbnail !== course.thumbnail) {
      formData.append("thumbnail", data.courseThumbnail);
    }

    if (data.courseRequirements.toString() !== course.instructions.toString()) {
      formData.append("instructions", JSON.stringify(data.courseRequirements));
    }

    setLoading(true);
    const result = await editCourseDetails(formData, token, dispatch, navigate);

    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    }
    setLoading(false);
  }

  const handleFormSubmit = async (data) => {
    // console.log("in submit")
    // console.log(data)

    if (editCourse) {
      // Edit course
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
        return;
      }
      handleCourseEdit(data);
      return;
    }

    // Create Course
    const formData = new FormData();
    formData.append("title", data.courseTitle);
    formData.append("description", data.courseDesc);
    formData.append("price", data.coursePrice);
    formData.append("category", data.courseCategory);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("tags", JSON.stringify(data.courseTags));
    formData.append("thumbnail", data.courseThumbnail);
    formData.append("instructions", JSON.stringify(data.courseRequirements));

    setLoading(true);
    const result = await addCourse(formData, token, dispatch, navigate);
    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    }
    setLoading(false);
  }

  return (
    <div className='border rounded-md border-richblack-700 bg-richblack-800 py-6 px-3 md:px-6' >

      <form onSubmit={handleSubmit(handleFormSubmit)}
        className='space-y-8' >

        {/* Course Title */}
        <div className='flex flex-col' >
          <label className='label-style' htmlFor="courseTitle">Course Title <sup className='text-pink-200' >*</sup></label>
          <input
            type='text'
            id="courseTitle"
            placeholder='Enter Course Title'
            className='input-style'
            {...register("courseTitle", { required: true })}
          />
          {
            errors.courseTitle && <p className='input-error-style' >Course Title is required</p>
          }
        </div>

        {/* Course Short Description */}
        <div className='flex flex-col'>
          <label htmlFor="courseDesc" className='label-style' >
            Course Short Description <sup className='text-pink-200' >*</sup>
          </label>
          <textarea
            id="courseDesc"
            placeholder='Enter Short Description'
            className='input-style min-h-[130px] resize-x-none'
            {...register("courseDesc", { required: true })}
          />
          {
            errors.courseDesc && <p className='input-error-style' >Course Description is required</p>
          }
        </div>

        {/* Course Price */}
        <div className='flex flex-col'>
          <label htmlFor="coursePrice" className='label-style' >Enter Course Price <sup className='text-pink-200' >*</sup></label>
          <div className='relative'>
            <input
              type='number'
              id='coursePrice'
              min={0}
              placeholder='Enter Course Price'
              className='input-style !pl-12'
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                }
              })}
            />
            <HiOutlineCurrencyRupee className='absolute top-1/2 -translate-y-1/2 text-2xl text-richblack-400 left-3' />
          </div>

          {
            errors.coursePrice && <p className='input-error-style' >Course Price is required</p>
          }
        </div>

        {/* Course Categories */}
        <div className='flex flex-col'>
          <label htmlFor="courseCategory" className='label-style'>Course Category <sup className='text-pink-200' >*</sup></label>

          <select
            id="courseCategory"
            defaultValue={""}
            className='input-style'
            {...register("courseCategory", { required: true })}
          >
            <option value={""} disabled >Choose a Category</option>
            {
              !loading && (
                courseCategories?.map((category, ind) => (
                  <option key={ind} value={category._id} >{category?.name}</option>
                ))
              )
            }
          </select>

          {
            errors.courseCategory && <p className='input-error-style' >Course Category is required</p>
          }
        </div>

        {/* Course Tags */}
        <div>
          <ChipInput
            label={"Tags"}
            name={"courseTags"}
            placeholder={"Enter tags and press Enter"}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />
        </div>

        {/* Course Thumbnail */}
        <div>
          <UploadFile
            label={"Course Thumbnail"}
            name={"courseThumbnail"}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            editData={editCourse ? course?.thumbnail : null}
          />
        </div>

        {/* Benefits of the Course */}
        <div className='flex flex-col'>
          <label htmlFor="courseBenefits" className='label-style' >
            Benefits of the course <sup className='text-pink-200' >*</sup>
          </label>
          <textarea
            id="courseBenefits"
            placeholder='Enter benefits of the course'
            className='input-style min-h-[130px] resize-x-none'
            {...register("courseBenefits", { required: true })}
          />
          {
            errors.courseBenefits && <p className='input-error-style' >Benefits of the course is required</p>
          }
        </div>

        {/* Course Requirements/Instructions */}
        <div >
          <RequirementsField
            label={"Requirements/Instructions"}
            name={"courseRequirements"}
            placeholder={"Add Course Requirements/Instructions"}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />
        </div>

        {/* Next Buttons  */}
        <div className='flex flex-col md:flex-row gap-5 md:gap-2 md:justify-end md:items-center' >
          {
            editCourse && (
              <div>
                <button
                  type='submit'
                  disabled={loading}
                  onClick={() => dispatch(setStep(2))}
                  className={'bg-richblack-300 py-2 px-5 rounded-md font-semibold text-richblack-900 disabled:cursor-not-allowed'}
                >
                  Continue Without Saving
                </button>
              </div>
            )
          }

          <IconBtn
            type={'submit'}
            text={editCourse ? "Save Changes" : "Next"}
            disabled={loading}
          >
            <MdNavigateNext />
          </IconBtn>
        </div>

      </form>

    </div>
  )
}

export default CourseInformationForm
