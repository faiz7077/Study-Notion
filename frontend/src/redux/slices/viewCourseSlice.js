import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courseData: null,
  completedVideos: [],
  totalNoOfVideos: 0,
};

const viewCourseSlice = createSlice({
  name: 'View Course Slice',
  initialState,
  reducers: {
    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },
    setCompletedVideos: (state, action) => {
      state.completedVideos = action.payload;
    },
    setTotalNoOfVideos: (state, action) => {
      state.totalNoOfVideos = action.payload;
    },
  },
});

export const { setCourseData, setCompletedVideos, setTotalNoOfVideos } = viewCourseSlice.actions;

export default viewCourseSlice.reducer;
