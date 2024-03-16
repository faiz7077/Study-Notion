import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profileLoading: false,
  paymentLoading: false
}

const profileSlice = createSlice({
  name: 'profile slice',
  initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload
    },
    setProfileLoading(state, value) {
      state.profileLoading = value.payload
    },
    setPaymentLoading(state, action) {
      state.paymentLoading = action.payload
    },
  }
})

export const { setUser, setProfileLoading, setPaymentLoading } = profileSlice.actions
export default profileSlice.reducer
