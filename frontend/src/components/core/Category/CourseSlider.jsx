import React from 'react'
import CourseCard from './CourseCard'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import "swiper/css/free-mode"
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

const CourseSlider = ({ courses }) => {
  return (
    <div>
      {
        courses && courses.length ?
          (
            <div className='' >
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[FreeMode, Pagination]}
                breakpoints={{
                  1024: {
                    slidesPerView: 3
                  }
                }}
                className="max-h-[30rem] "
              >
                {
                  courses.map((course, ind) => (
                    <SwiperSlide className='' key={ind} >
                      <CourseCard course={course} imgHeight={"h-[250px]"} />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
          )
          :
          (
            <div className='text-xl text-richblack-5' >
              No Course Found
            </div>
          )
      }
    </div>
  )
}

export default CourseSlider
