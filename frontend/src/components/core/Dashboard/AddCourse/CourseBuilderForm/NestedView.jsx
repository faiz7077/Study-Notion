import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import toast from 'react-hot-toast';
import ConfirmationModal from '../../../../common/ConfirmationModal';
import { BsListUl, BsFillCameraVideoFill } from "react-icons/bs"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import SubSectionModal from './SubSectionModal';
import { deleteSection, deleteSubSection } from '../../../../../services/operations/sectionSubsectionServices';
import { setCourse } from '../../../../../redux/slices/addCourseSlice';


const NestedView = ({ handleChangeEditSectionName }) => {

  const dispatch = useDispatch();
  const { course } = useSelector(state => state.addCourse);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);
  const [confirmationModalData, setConfirmationModalData] = useState(null);
  const [addSubSectionData, setAddSubSectionData] = useState(null);
  const [editSubSectionData, setEditSubSectionData] = useState(null);
  const [viewSubSectionData, setViewSubSectionData] = useState(null);
  const [listOfSectionOpen, setListOfSectionOpen] = useState([]);

  const handleToggleListOpen = (sectionOpen, sectionId) => {
    if (sectionOpen) {
      setListOfSectionOpen([...listOfSectionOpen, sectionId])
    } else {
      setListOfSectionOpen(listOfSectionOpen.filter(secId => secId !== sectionId));
    }
  }

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({ sectionId }, token);
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModalData(null);
  }

  const handleOpenSectionDeleteModal = (sectionId) => {
    setConfirmationModalData({
      text1: 'Delete this Section ?',
      text2: 'All the lectures in this section will be deleted',
      btn1Text: 'Delete',
      btn2Text: 'Cancel',
      btn1Handler: () => handleDeleteSection(sectionId),
      btn2Handler: () => setConfirmationModalData(null),
      closeModalHandler: () => setConfirmationModalData(null),
    });
  }


  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    setLoading(true);
    const result = await deleteSubSection({ subSectionId }, token);
    if (result) {
      // update course
      const updatedCourseSections = course.sections.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, sections: updatedCourseSections };

      dispatch(setCourse(updatedCourse))
    }
    setLoading(false);
    setConfirmationModalData(null);
  }

  const handleOpenSubSectionDeleteModal = (subSectionId, sectionId) => {
    setConfirmationModalData({
      text1: 'Delete this Sub-Section ?',
      text2: 'This lecture will be deleted',
      btn1Text: 'Delete',
      btn2Text: 'Cancel',
      btn1Handler: () => handleDeleteSubSection(subSectionId, sectionId),
      btn2Handler: () => setConfirmationModalData(null),
      closeModalHandler: () => setConfirmationModalData(null),
    });
  }



  return (
    <div>
      <div className='bg-richblack-700 rounded-lg py-6 px-8 '>
        {
          course && course?.sections.map((section) => (
            <div key={section._id} >
              <details open onToggle={(e) => handleToggleListOpen(e.target.open, section._id)} >
                {/* Section header content */}
                <summary className='flex justify-between items-center cursor-pointer border-b-2 border-richblack-600 py-2' >
                  <div className='flex items-center gap-x-3' >
                    <BsListUl className='text-2xl text-richblack-50' />
                    <p className='text-2xl text-richblack-50' >{section.title}</p>
                  </div>

                  <div className='flex items-center gap-x-3' >
                    <button
                      type='button'
                      onClick={() => handleChangeEditSectionName(section._id, section.title)}
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>

                    <button
                      onClick={() => handleOpenSectionDeleteModal(section._id)}
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                    <span className=' text-richblack-300 font-medium' >|</span>

                    <div >
                      {
                        listOfSectionOpen.includes(section._id)
                          ?
                          <AiFillCaretDown className="text-xl text-richblack-300" />
                          :
                          <AiFillCaretRight className="text-xl text-richblack-300" />
                      }
                    </div>
                  </div>
                </summary>


                {/* Section data - render all sub section data */}
                <div className='px-6 pb-4' >
                  {
                    section.subSections.map((subSection) => (
                      <div
                        key={subSection._id}
                        onClick={() => setViewSubSectionData(subSection)}
                        className='flex justify-between items-center cursor-pointer gap-x-3 border-b-2 border-richblack-600 py-2'
                      >
                        <div className='flex items-center gap-x-3 py-2' >
                          <BsFillCameraVideoFill className='text-2xl text-richblack-50' />
                          <p className='text-richblack-50 font-semibold' >{subSection.title}</p>
                        </div>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className='flex items-center gap-x-3'
                        >
                          <button
                            type='button'
                            onClick={() => setEditSubSectionData(subSection)}
                          >
                            <MdEdit className="text-xl text-richblack-300" />
                          </button>

                          <button
                            onClick={() => handleOpenSubSectionDeleteModal(subSection._id, section._id)}
                          >
                            <RiDeleteBin6Line className="text-xl text-richblack-300" />
                          </button>
                        </div>
                      </div>
                    ))
                  }

                  {/* button to add New lecture */}
                  <button
                    type='button'
                    onClick={() => setAddSubSectionData({ sectionId: section._id })}
                    className='mt-3 flex items-center gap-x-1 text-yellow-50'
                  >
                    <FaPlus className='text-lg' />
                    <p>Add Lecture</p>
                  </button>
                </div>

              </details>
            </div>
          ))
        }
      </div>

      {/* Display Modal for Add, Edit and View a subSection */}
      {
        addSubSectionData &&
        <SubSectionModal
          modalData={addSubSectionData}
          setModalData={setAddSubSectionData}
          addMode={true}
        />
      }

      {
        editSubSectionData &&
        <SubSectionModal
          modalData={editSubSectionData}
          setModalData={setEditSubSectionData}
          editMode={true}
        />
      }

      {
        viewSubSectionData &&
        <SubSectionModal
          modalData={viewSubSectionData}
          setModalData={setViewSubSectionData}
          viewMode={true}
        />
      }

      {/* Confirmation Modal */}
      {
        confirmationModalData && <ConfirmationModal modalData={confirmationModalData} />
      }
    </div>
  )
}

export default NestedView
