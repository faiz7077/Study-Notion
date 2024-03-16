import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md'

const RequirementsField = ({ label, name, placeholder, register, errors, setValue, getValues }) => {

  const [courseRequirements, setCourseRequirements] = useState([]);
  const { editCourse, course } = useSelector(state => state.addCourse);

  useEffect(() => {
    if (editCourse) setCourseRequirements(course?.instructions);

    register(name, {
      required: true,
      validate: (value => value.length > 0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, courseRequirements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseRequirements]);

  const handleRequirementAdd = () => {
    const requirementValue = getValues("requirement");
    if (requirementValue && !courseRequirements.includes(requirementValue)) {
      setCourseRequirements([...courseRequirements, requirementValue]);
      setValue("requirement", "");
    }
  };

  const handleRequirementDelete = (reqInd) => {
    const updatedReqs = courseRequirements.filter((_, ind) => ind !== reqInd);
    setCourseRequirements(updatedReqs);
  }

  return (
    <div className='flex flex-col'>
      <label className='label-style' htmlFor="requirement">{label} <sup className='text-pink-200' >*</sup></label>
      <input
        type='text'
        id={"requirement"}
        placeholder={placeholder}
        className='input-style'
        {...register("requirement")}
      />
      {
        errors[name] && <p className='input-error-style' >{label} are required</p>
      }

      <button
        type='button'
        onClick={handleRequirementAdd}
        className='font-semibold text-yellow-100 text-left mt-2'
      >
        Add
      </button>

      <div>
        {
          courseRequirements.length > 0 && (
            <ul className='mt-2 list-inside list-disc ' >
              {
                courseRequirements.map((req, ind) => (
                  <li key={ind} className='flex items-center gap-x-2 text-richblack-5 ' >
                    {req}
                    <button
                      type='button'
                      className=' text-pure-greys-300 font-semibold'
                      onClick={() => handleRequirementDelete(ind)}
                    >
                      <MdClose />
                    </button>

                  </li>
                ))
              }
            </ul>
          )
        }
      </div>


    </div>
  )
}

export default RequirementsField
