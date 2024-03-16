import { toast } from "react-hot-toast"
import { categoriesApi, courseApi, reviewApi, userApi } from "../apis";
import { apiConnector } from "../apiConnector";

// Fetch all categories
export const fetchCourseCategories = async (dispatch, navigate) => {
  // const toastId = toast.loading('Loading ...');
  // setLoading(true);
  let result = [];
  try {
    const response = await apiConnector('GET', categoriesApi.GET_GET_ALL_CATEGORIES_API);
    result = response.data?.data;
  } catch (error) {
    toast.error('Could not get course categories, Try Again');
    navigate('/')
  }

  // setLoading(false);
  // toast.dismiss(toastId);
  return result
}


// Add a course // only by instructor
export const addCourse = async (formData, token, dispatch, navigate) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('POST', courseApi.POST_CREATE_COURSE_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot create course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Edit details a course // only by instructor
export const editCourseDetails = async (formData, token, dispatch, navigate) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('PUT', courseApi.PUT_EDIT_COURSE_API,
      formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot edit course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


// Get Full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('POST', courseApi.POST_GET_FULL_DETAILS_OF_COURSE,
      {
        courseId
      }, {
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


export const getCreatedCourses = async (token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('GET', userApi.GET_GET_CREATED_COURSES_API,
      null, {
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch courses, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


export const deleteCourse = async (data, token) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('DELETE', courseApi.DELETE_DELETE_COURSE_API,
      data, {
      Authorization: `Bearer ${token}`
    });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot delete course, Try Again');
  }
  toast.dismiss(toastId);
  return result
}


export const getCategoryCourses = async (categoryId) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('POST', categoriesApi.POST_GET_CATEGORY_COURSES_API, { categoryId });

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Please refresh');
  }
  toast.dismiss(toastId);
  return result
}


export const getCourse = async (courseId) => {
  let result = null;
  const toastId = toast.loading('Loading ...');
  try {
    const response = await apiConnector('GET', `${courseApi.GET_GET_COURSE_DATA_API}/${courseId}`);

    result = response.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Cannot fetch course, Please try again');
  }
  toast.dismiss(toastId);
  return result
}


// Get all reviews of a course
export const getAllReviewsOfCourse = async (courseId) => {
  let result = [];
  try {
    const response = await apiConnector('POST', reviewApi.POST_GET_ALL_REVIEWS_OF_COURSE_API, { courseId });
    result = response.data?.data;
  } catch (error) {
    toast.error('Could not fetch course reviews, Refresh the page');
  }
  return result
}
