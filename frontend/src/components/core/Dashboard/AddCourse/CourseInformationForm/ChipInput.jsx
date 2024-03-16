import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md'


const ChipInput = ({ label, name, placeholder, register, errors, setValue, getValues }) => {

  const [chips, setChips] = useState([]);
  const { editCourse, course } = useSelector(state => state.addCourse);

  useEffect(() => {
    if (editCourse) setChips(course?.tags);

    register(name, {
      required: true,
      validate: (value => value.length > 0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, chips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])


  // Function to handle a chip input
  // It adds a chip in chips array when Enter of , is pressed
  const handleKeyDown = (e) => {
    // Check if pressed key is 'Enter' or ',' not
    if (e.key === "Enter" || e.key === ",") {
      // Add chip to chips array and clear current chip
      e.preventDefault();
      const chipValue = getValues("chip").trim();
      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue]);
        setValue("chip", "");
      }
    }
  }

  const handleAddChip = (e) => {
    e.preventDefault();
    const chipValue = getValues("chip").trim();
    if (chipValue && !chips.includes(chipValue)) {
      setChips([...chips, chipValue]);
      setValue("chip", "");
    }
  }

  // Function to delete a chip
  const handleDeleteChip = (chipInd) => {
    const updatedChips = chips.filter((chip, ind) => ind !== chipInd);
    setChips(updatedChips);
  }

  return (
    <div className='flex flex-col'>
      <label htmlFor={"chip"} className='label-style' >{label} <sup className='text-pink-200' >*</sup></label>

      {/* Render the chips */}
      <div className='flex flex-wrap gap-y-1 mb-2' >
        {
          chips.map((chip, ind) => (
            <div key={ind} className='flex items-center gap-x-2 bg-yellow-400 rounded-full px-2 py-1 text-sm text-richblack-5 m-1 ' >
              {chip}

              <button
                type='button'
                className=' hover:outline outline-richblack-700 rounded-full'
                onClick={() => handleDeleteChip(ind)}
              >
                <MdClose className="text-sm" />
              </button>
            </div>
          ))
        }
      </div>

      {/* Render input field for adding new chips */}
      <input
        id={"chip"}
        type='text'
        placeholder={placeholder}
        className='input-style'
        onKeyDown={handleKeyDown}
        {...register("chip")}
      />

      <button
        type='button'
        onClick={handleAddChip}
        className='font-semibold text-yellow-100 text-left mt-2'
      >
        Add
      </button>

      {/* Render an error message if the chips input is empty */}
      {
        errors[name] && <p className='input-error-style' >{label} are required</p>
      }

    </div>
  )
}

export default ChipInput
