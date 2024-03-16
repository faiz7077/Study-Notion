import { toast } from 'react-hot-toast'
import { setLoading, setToken } from "../../redux/slices/authSlice"
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { authApi } from "../apis";

export const login = async (email, password, dispatch, navigate) => {
  dispatch(setLoading(true));
  const toastId = toast.loading('Loading ...')

  try {
    const response = await apiConnector('POST', authApi.POST_LOGIN_USER_API, {
      email,
      password
    });

    toast.success('Login Successful');
    dispatch(setToken(response.data.token));
    dispatch(setUser(response.data.user));
    localStorage.setItem('token', JSON.stringify(response.data.token));
    navigate('/dashboard/my-profile')
  } catch (error) {
    // toast.error('Login Failed');
    toast.error(error?.response?.data?.error || 'Login Failed')
  }

  toast.dismiss(toastId)
  dispatch(setLoading(false));
}


export const signUp = async (signUpData, dispatch, navigate) => {
  dispatch(setLoading(true));
  const toastId = toast.loading('Loading ...')

  try {
    const response = await apiConnector('POST', authApi.POST_SIGNUP_USER_API, signUpData);

    toast.success('SignUp Successful');
    dispatch(setToken(response.data.token));
    dispatch(setUser(response.data.user));
    localStorage.setItem('token', JSON.stringify(response.data.token));
    navigate('/dashboard/my-profile')
  } catch (error) {
    // toast.error('Login Failed');
    toast.error(error?.response?.data?.error || 'SignUp Failed')
    navigate('/signup')
  }

  toast.dismiss(toastId)
  dispatch(setLoading(false));
}

export const sendOtp = async (email, dispatch, navigate) => {
  const toastId = toast.loading('Loading...');
  dispatch(setLoading(true))

  try {
    await apiConnector('POST', authApi.POST_SEND_OTP_API, {
      email
    });
    toast.success('OTP sent successfully');
    navigate('/verify-email')
  } catch (error) {
    toast.error(error?.response?.data?.error || 'SignUp Failed')
  }
  toast.dismiss(toastId);
  dispatch(setLoading(false));
}


export const logout = async (token, dispatch, navigate) => {
  try {  
    // eslint-disable-next-line
    const response = await apiConnector('POST', authApi.POST_LOGOUT_USER_API, null, {
      Authorization: `Bearer ${token}`
    });
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem('token');
    toast.success('Logged out')
    navigate('/login')
  } catch (error) {
    toast.error(error?.response?.data?.error || 'logout Failed')
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem('token');
    navigate('/login')
  }
}

export const deleteBrowserData = async (dispatch, navigate) => {
  dispatch(setToken(null));
  dispatch(setUser(null));
  localStorage.removeItem('token');
  navigate('/')
}


export const forgotPassword = async (email, setEmailSent, dispatch, navigate) => {
  dispatch(setLoading(true));
  const toastId = toast.loading('Loading ...')

  try {
    await apiConnector('POST', authApi.POST_FORGOT_PASSWORD_API, {
      email
    });

    toast.success('Reset Email Sent');
    setEmailSent(true)
  } catch (error) {
    // toast.error('Login Failed');
    toast.error(error?.response?.data?.error || 'Forgot Password Failed')
  }

  toast.dismiss(toastId)
  dispatch(setLoading(false));
}

export const resetPassword = async (resetToken, password, dispatch, navigate) => {
  dispatch(setLoading(true));
  const toastId = toast.loading('Loading ...')

  try {
    const response = await apiConnector('PUT', authApi.PUT_RESET_PASSWORD_API, {
      password,
      resetToken
    });

    toast.success('Password reset successful');
    dispatch(setToken(response.data.token));
    dispatch(setUser(response.data.user));
    localStorage.setItem('token', JSON.stringify(response.data.token));
    navigate('/dashboard/my-profile')
  } catch (error) {
    // toast.error('Login Failed');
    toast.error(error?.response?.data?.error || 'Reset Password Failed')
  }

  toast.dismiss(toastId)
  dispatch(setLoading(false));
}
