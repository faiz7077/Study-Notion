import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MAX_FILE_SIZE } from '../../../../utils/constants'
import { FiUploadCloud } from 'react-icons/fi'
import { toast } from 'react-hot-toast'


const UploadFile = ({
  label,
  name,
  register,
  errors,
  setValue,
  getValues,
  video = false,
  editData = null,
  viewData = null,
  durationName = null
}) => {

  const [previewSource, setPreviewSource] = useState(editData || viewData || null);
  const [selectedFile, setSelectedFile] = useState(editData || viewData || null);
  const videoRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }
  }

  const handleCancel = () => {
    setPreviewSource(null);
    setSelectedFile(null);
    setValue(name, null);
  }

  // // onDrop will execute rather than drop files is accepted or rejected
  // const onDrop = (acceptedFiles) => {
  //   console.log(acceptedFiles)
  //   console.log("accepted")
  // }

  const onDropAccepted = (acceptedFiles) => {
    // console.log(acceptedFiles);
    const file = acceptedFiles[0];
    previewFile(file);
    setSelectedFile(file);
  }

  const onDropRejected = (rejectedFiles) => {
    const file = rejectedFiles[0];
    const error = file.errors[0];

    if (error.code === "file-too-large") {
      toast.error(`Please enter a ${video ? "video" : "image"} file of less than ${video ? "10 MB" : "200 KB"}`)
    } else if (error.code === "file-invalid-type") {
      toast.error(`Please enter a valid ${video ? "video" : "image"} file`)
    }
  }


  // eslint-disable-next-line
  const { getInputProps, getRootProps, isDragActive, acceptedFiles, fileRejections, open, inputRef } = useDropzone({
    accept: video ?
      { "video/*": [".mp4", ".mkv"] } :
      { "image/*": [".jpeg", ".jpg", ".png"] },
    // onDrop,
    onDropAccepted,
    onDropRejected,
    multiple: false,
    maxFiles: 2,
    maxSize: video ? MAX_FILE_SIZE.VIDEO : MAX_FILE_SIZE.IMAGE
  });

  // // We can handle Rejected file int this way also
  // const fileRejectedItems = fileRejections.map(({ file, errors }) => (
  //   console.log("rejected")
  // ))



  const handleOnLoadMetaData = () => {
    // set video duration
    const videoFile = videoRef.current;
    if (!(videoFile && durationName)) return;
    setValue(durationName, videoFile.duration);
  }



  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);


  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, name, durationName, setValue]);


  return (
    <div className='flex flex-col'>
      <label className='label-style' htmlFor="requirement">{label} <sup className='text-pink-200' >*</sup></label>

      <div
        className={`flex justify-center items-center cursor-pointer rounded-md min-h-[250px] border-2 border-dotted border-richblack-500
        ${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
        `}
      >
        {
          previewSource ?
            (
              <div className='flex flex-col p-6' >
                {
                  video ?
                    (

                      <video ref={videoRef} onLoadedMetadata={handleOnLoadMetaData} src={previewSource} controls className='min-w-[250px] md:min-w-[350px] h-full w-full object-fill rounded-md' ></video>

                    )
                    :
                    (
                      <img
                        src={previewSource}
                        alt="Preview"
                        className='h-full w-full rounded-md object-cover'
                      />
                    )
                }

                {
                  !viewData &&
                  (
                    <button
                      type='button'
                      className='mt-3 text-richblack-400 underline'
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )
                }

              </div>
            )
            :
            (
              <div {...getRootProps()} className='flex flex-col items-center p-6'>
                <input {...getInputProps()} />

                <div className='grid place-items-center h-14 aspect-square rounded-full bg-pure-greys-800' >
                  <FiUploadCloud className="text-2xl text-yellow-50" />
                </div>

                <p className='max-w-[200px] mt-2 text-center text-sm text-richblack-200' >
                  Drag and drop an {video ? "video" : "image"}, or click to {" "}
                  <span className='font-semibold text-yellow-50' >Browse</span> file
                </p>

                <ul className='mt-10 flex justify-between gap-x-12 text-center text-xs text-richblack-200 list-disc'>
                  <li>Aspect ratio 16:9</li>
                  <li>Recommended size 1024x576</li>
                </ul>
              </div>
            )
        }
      </div>

      {
        errors[name] && <p className='input-error-style' >{label} is required</p>
      }
    </div>
  )
}

export default UploadFile
