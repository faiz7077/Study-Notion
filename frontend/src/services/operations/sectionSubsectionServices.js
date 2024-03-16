import { toast } from "react-hot-toast"
import { sectionApi, subsectionApi } from "../apis";
import { apiConnector } from "../apiConnector";


// Create section
export const createSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('POST', sectionApi.POST_CREATE_SECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Course Section Created");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}

// Update section
export const updateSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('PUT', sectionApi.PUT_UPDATE_SECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Course Section Updated");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Delete section
export const deleteSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('DELETE', sectionApi.DELETE_DELETE_SECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Course Section Deleted");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Create sub section 
export const createSubSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('POST', subsectionApi.POST_CREATE_SUBSECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Lecture Added");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Update sub section 
export const updateSubSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('PUT', subsectionApi.PUT_UPDATE_SUBSECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Lecture Updated");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Delete sub section
export const deleteSubSection = async (formData, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('DELETE', subsectionApi.DELETE_DELETE_SUBSECTION_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
    toast.success("Lecture Deleted");
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}

