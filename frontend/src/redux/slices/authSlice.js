import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
  loading: false,
  signUpData: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(prevState, action) {
      prevState.token = action.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
    setSignUpData(state, value) {
      state.signUpData = value.payload
    }
  }
})

export const { setToken, setLoading, setSignUpData } = authSlice.actions
export default authSlice.reducer
