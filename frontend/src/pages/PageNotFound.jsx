import React from 'react'

const PageNotFound = () => {
  return (
    <div className='flex flex-col gap-y-2 justify-center items-center text-3xl text-richblue-200 min-h-[calc(100vh-3.5rem)]'>
      <p>Error - 404</p>
      <p>Page Not Found</p>
      <p>or Page Loading </p>
      {/* <p>😲</p> */}
    </div>
  )
}

export default PageNotFound
