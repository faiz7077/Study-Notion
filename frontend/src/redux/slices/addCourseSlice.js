import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  course: null,
  editCourse: false
}

const addCourseSlice = createSlice({
  name: 'add course',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCourse(state, action) {
      state.course = action.payload
    },
    setEditCourse(state, action) {
      state.editCourse = action.payload
    },
    resetCourseState(state, action) {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    }
  }
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  resetCourseState
} = addCourseSlice.actions

export default addCourseSlice.reducer
