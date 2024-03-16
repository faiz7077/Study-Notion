import { toast } from 'react-hot-toast'
import { apiConnector } from '../apiConnector';
import { otherApi } from '../apis';

export const contactUs = async (contactData, setLoading, reset) => {
  setLoading(true);
  const toastId = toast.loading('Sending contact details ...')
  try {
    await apiConnector('POST', otherApi.POST_CONTACT_US, contactData);
    toast.success('Contact Details sent')

    reset({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      message: ''
    })
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Contact failed')
  }
  toast.dismiss(toastId)
  setLoading(false);
}
