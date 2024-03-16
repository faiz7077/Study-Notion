import { toast } from "react-hot-toast"
import { authApi, profileApi, userApi } from "../apis"
import { apiConnector } from "../apiConnector";
import { getCurrentUser } from "./profileServices";
import { setUser } from "../../redux/slices/profileSlice";
import { deleteBrowserData } from "./authServices";

export const changeAvatar = async (token, formData, setLoading, dispatch, navigate) => {
  const toastId = toast.loading('Updating...')
  setLoading(true);

  try {
    // eslint-disable-next-line
    const response = await apiConnector('PUT', userApi.PUT_CHANGE_AVATAR_API, formData, {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    });
    toast.success('Profile picture updated successfully');
    getCurrentUser(token, dispatch, navigate);
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Upload Failed')
  }

  setLoading(false);
  toast.dismiss(toastId);
}

// eslint-disable-next-line
export const updateProfile = async (token, updateData, setLoading, dispatch, navigate) => {
  const toastId = toast.loading('Updating...')
  setLoading(true);

  try {
    const response = await apiConnector('PUT', profileApi.PUT_UPDATE_PROFILE_API, updateData, {
      'Authorization': `Bearer ${token}`
    });
    toast.success('Profile updated successfully');
    // getCurrentUser(token, dispatch, navigate);
    setUser(response.data);
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Update Failed')
  }

  setLoading(false);
  toast.dismiss(toastId);
}

export const changePassword = async (token, passwordData, setLoading, dispatch, navigate) => {
  // const toastId = toast.loading('Updating...');
  setLoading(true);

  try {
    // eslint-disable-next-line
    const response = await apiConnector('PUT', authApi.PUT_CHANGE_PASSWORD_API, passwordData, {
      'Authorization': `Bearer ${token}`
    });
    toast.success('Password updated successfully');
    await deleteBrowserData(dispatch, navigate);
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Password update Failed')
  }

  // toast.dismiss(toastId);
  setLoading(false);
}

export const deleteCurrentUser = async (token, dispatch, navigate) => {
  const toastId = toast.loading('Deleting...');

  try {
    // eslint-disable-next-line
    const response = await apiConnector('DELETE', userApi.DELETE_DELETE_CURRENT_USER_API, null, {
      'Authorization': `Bearer ${token}`
    });
    toast.success('Account Deleted successfully');
    await deleteBrowserData(dispatch, navigate);
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.error || 'Account Deletion Failed')
  }

  toast.dismiss(toastId);
}
