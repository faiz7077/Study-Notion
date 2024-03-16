import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../common/Spinner';
import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from 'video-react';
import IconBtn from '../../common/IconBtn';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { markSubSectionAsCompleted } from '../../../services/operations/studentFeaturesServices';
import { useDispatch } from 'react-redux';



const VideoDetails = ({ subSection, loading }) => {
  const navigate = useNavigate();
  const { courseData, completedVideos } = useSelector(state => state.viewCourse);
  const [loading2, setLoading2] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef(null);
  const { courseId, sectionId, subSectionId } = useParams();
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setVideoEnded(false);
  }, [subSectionId])

  const isFirstVideo = () => {
    const curSectionInd = courseData.sections.findIndex((section) => section._id === sectionId);
    const curSubSectionInd = courseData.sections[curSectionInd].subSections.findIndex((subSection) => subSection._id === subSectionId);

    if (curSectionInd === 0 && curSubSectionInd === 0) {
      return true;
    }
    return false
  }

  const isLastVideo = () => {
    const curSectionInd = courseData.sections.findIndex((section) => section._id === sectionId);
    const curSubSectionInd = courseData.sections[curSectionInd].subSections.findIndex((subSection) => subSection._id === subSectionId);

    if (curSectionInd === courseData.sections.length - 1 && curSubSectionInd === courseData.sections[curSectionInd].subSections.length - 1) {
      return true;
    }
    return false
  }

  const goToPrevVideo = () => {
    if (isFirstVideo()) return;

    const curSectionInd = courseData.sections.findIndex((section) => section._id === sectionId);
    const curSubSectionInd = courseData.sections[curSectionInd].subSections.findIndex((subSection) => subSection._id === subSectionId);

    if (curSubSectionInd === 0) {
      // Go to last subSection of prev section
      const prevSectionId = courseData.sections[curSectionInd - 1]._id;
      const prevSubSectionsLength = courseData.sections[curSectionInd - 1].subSections.length;
      const prevSubSectionId = courseData.sections[curSectionInd - 1].subSections[prevSubSectionsLength - 1]._id

      navigate(`/view-course/${courseData._id}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    } else {
      // Go to prev subSection of same section
      const prevSubSectionId = courseData.sections[curSectionInd].subSections[curSubSectionInd - 1]._id

      navigate(`/view-course/${courseData._id}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }
    setVideoEnded(false)
  }

  const goToNextVideo = () => {
    if (isLastVideo()) return;

    const curSectionInd = courseData.sections.findIndex((section) => section._id === sectionId);
    const curSubSectionInd = courseData.sections[curSectionInd].subSections.findIndex((subSection) => subSection._id === subSectionId);

    if (curSubSectionInd === courseData.sections[curSectionInd].subSections.length - 1) {
      // Go to first subSection of next section
      const nextSectionId = courseData.sections[curSectionInd + 1]._id;
      const nextSubSectionId = courseData.sections[curSectionInd + 1].subSections[0]._id

      navigate(`/view-course/${courseData._id}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    } else {
      // Go to next subSection of same section
      const nextSubSectionId = courseData.sections[curSectionInd].subSections[curSubSectionInd + 1]._id

      navigate(`/view-course/${courseData._id}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }
    setVideoEnded(false)
  }

  const handleMarkAsComplete = async () => {
    setLoading2(true);
    await markSubSectionAsCompleted(courseId, subSectionId, token, dispatch)
    setLoading2(false);
    goToNextVideo();
    setVideoEnded(false);
  }

  const handleRewatchClick = async () => {
    playerRef.current.seek(0);
    playerRef.current.play();
    setVideoEnded(false)
  }


  return (
    <div>
      {
        loading ?
          (
            <div><Spinner /></div>
          )
          :
          (
            <div className='mt-5 md:mt-0 px-1 md:px-6 flex-1 h-full w-full overflow-x-auto' >
              <div className=' flex flex-col gap-5 w-full' >

                {/* Video Player */}
                <div className='w-full md:w-[80%] mx-auto' >
                  <Player
                    ref={playerRef}
                    src={subSection?.videoUrl}
                    aspectRatio="16:9"
                    playsInline
                    fluid={true}
                    onEnded={() => setVideoEnded(true)}
                  >
                    <BigPlayButton position='center' />

                    {/* Render when video ended */}
                    {
                      videoEnded &&
                      (
                        <div
                          className="absolute inset-0  z-[100] flex justify-center items-center gap-x-5 h-full w-full
                        bg-gradient-to-t from-[rgba(0,0,0,1)] via-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.1)]"
                        >

                          <div className='flex flex-col gap-y-2 items-end'>
                            <IconBtn
                              text={"Rewatch"}
                              disabled={loading2}
                              onClickHandler={handleRewatchClick}
                              customClasses={"text-xl !px-2 !py-1 !max-w-max"}
                            />

                            <div className='h-[44px]' >
                              {
                                !isFirstVideo() && (
                                  <button
                                    disabled={loading2}
                                    onClick={goToPrevVideo}
                                    className='text-[#2665d8] font-semibold text-lg px-5 py-2 flex items-center gap-x-2 rounded-md'
                                  >
                                    <BiChevronLeft size={20} />
                                    Prev
                                  </button>
                                )
                              }
                            </div>
                          </div>

                          <div className='flex flex-col gap-y-2 items-start'>
                            <div className='h-[36px]'>
                              {
                                !completedVideos.includes(subSection._id) &&
                                (
                                  <IconBtn
                                    text={loading2 ? "Loading..." : "Mark as Completed"}
                                    disabled={loading2}
                                    onClickHandler={handleMarkAsComplete}
                                    customClasses={"text-xl !px-2 !py-1 !max-w-max"}
                                  />
                                )
                              }
                            </div>

                            <div className='h-[44px]'  >
                              {
                                !isLastVideo() && (
                                  <button
                                    disabled={loading2}
                                    onClick={goToNextVideo}
                                    className='bg-[#25239c] text-richblack-5 font-semibold text-lg px-5 py-2 flex items-center gap-x-2 rounded-md'
                                  >
                                    Next
                                    <BiChevronRight />
                                  </button>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </Player>
                </div>

                {/* Section and SubSection Details */}
                <div className='text-richblack-5' >
                  <p className=' text-richblack-25 mb-2 text-2xl font-semibold' >{subSection.title}</p>

                  <p className='pb-6 text-richblack-100' >{subSection.description}</p>
                </div>

              </div>
            </div>
          )
      }

    </div>
  )
}

export default VideoDetails
