import { toast } from 'react-hot-toast';
import { courseApi, courseProgressApi, reviewApi, userApi } from '../apis';
import { apiConnector } from '../apiConnector';
import { setCourseData, setCompletedVideos, setTotalNoOfVideos } from '../../redux/slices/viewCourseSlice';

export const getEnrolledCourses = async (token, setEnrolledCourses, dispatch, navigate) => {
  try {
    const response = await apiConnector('GET', userApi.GET_GET_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    setEnrolledCourses(response.data.data);
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Fetch Failed');
  }
};

export const fetchEnrolledCourseData = async (courseId, token, dispatch) => {
  const toastId = toast.loading('Loading...');
  try {
    const response = await apiConnector('POST', courseApi.POST_GET_ENROLLED_COURSE_DATA, { courseId }, { Authorization: `Bearer ${token}` });
    // console.log(response.data.data.course);
    dispatch(setCourseData(response.data.data.course));
    dispatch(setCompletedVideos(response.data.data.completedVideos));
    dispatch(setTotalNoOfVideos(response.data.data.totalNoOfVideos));
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Failed to fetch Course Data');
  }
  toast.dismiss(toastId);
};

export const markSubSectionAsCompleted = async (courseId, subSectionId, token, dispatch) => {
  const toastId = toast.loading('Loading...');
  try {
    const response = await apiConnector(
      'POST',
      courseProgressApi.POST_MARK_SUBSECTION_AS_COMPLETED,
      {
        courseId,
        subSectionId,
      },
      { Authorization: `Bearer ${token}` }
    );
    if (response) {
      dispatch(setCompletedVideos(response.data.data.completedVideos));
    }
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Failed to fetch Course Data');
  }
  toast.dismiss(toastId);
};

export const createReview = async (data, token, dispatch) => {
  const toastId = toast.loading('Loading...');
  try {
    await apiConnector('POST', reviewApi.POST_CREATE_REVIEW_API, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success('Review written successfully');
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Failed to Write Review');
  }
  toast.dismiss(toastId);
};
