import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { paymentApi } from '../apis';
import rzp_logo from '../../assets/Logo/rzp_logo.png';
import { setPaymentLoading } from '../../redux/slices/profileSlice';
import { resetCart } from '../../redux/slices/cartSlice';
// const dotenv = require('dotenv');
// dotenv.config({ path: '/frontend/.env' });
// Load script to the document
export const loadScript = (script) => {
  return new Promise((resolve) => {
    const scriptEle = document.createElement('script');
    scriptEle.src = script;
    scriptEle.onload = () => {
      resolve(true);
    };

    scriptEle.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(scriptEle);
  });
};

export const buyCourses = async (courses, user, token, cartResetTrue, dispatch, navigate) => {
  const toastId = toast.loading('Loading ...');
  try {
    // Step 1 - Load Razorpay SDK script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      toast.error('⚠️ Failed to load Razorpay. Check your Internet Connect ');
      return;
    }

    // Step 2 - Create / Initiate the order in Backend
    const orderResponse = await apiConnector('POST', paymentApi.POST_CREATE_ORDER_API, { courses }, { Authorization: `Bearer ${token}` });

    if (!orderResponse) {
      toast.error('Order generation failed');
      toast.dismiss(toastId);
      return;
    }
    
    // Step 3 - Razorpay checkout code to Website
    // Open the Razorpay payment modal, with customized options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_PAY_KEY_ID,
      amount: orderResponse.data.data.amount,
      currency: orderResponse.data.data.currency,
      name: 'StudyNotion',
      description: 'Thank you for Purchasing the Course',
      image: rzp_logo,
      order_id: orderResponse.data.data.id,
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.profile?.contactNumber,
      },
      handler: async function (response) {
        // Step 4 - Send payment receive successfully email to payer
        // can save to data to backend
        await sendPaymentSuccess(
          {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount: orderResponse.data.data.amount,
          },
          token
        );

        // Verify payment signature and enroll in courses
        await verifyPaymentSignature(response, courses, token, cartResetTrue, dispatch, navigate);
      },
      notes: { ...orderResponse.data.data.notes },
      readOnly: {
        name: true,
        email: true,
      },
    };

    // Open the payment modal
    const razorpayObj = new window.Razorpay(options);
    razorpayObj.open();
    razorpayObj.on('payment.failed', function (response) {
      toast.error('⚠️ Oops ! Payment Failed');
    });
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Could not make payment ! Try again');
  }
  toast.dismiss(toastId);
};

export const createOrder = async (courses, token) => {
  const toastId = toast.loading('Sending contact details ...');
  try {
    const response = await apiConnector(
      'POST',
      paymentApi.POST_CREATE_ORDER_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Contact failed');
  }
  toast.dismiss(toastId);
};

export const sendPaymentSuccess = async (response, token) => {
  const toastId = toast.loading('Sending Payment Success Email...');
  try {
    await apiConnector('POST', paymentApi.POST_SEND_PAYMENT_SUCCESS_EMAIL_API, response, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Failed to send Payment Success Email');
  }
  toast.dismiss(toastId);
};

export const verifyPaymentSignature = async (response, courses, token, cartResetTrue, dispatch, navigate) => {
  const toastId = toast.loading('Verifying Payment...');
  dispatch(setPaymentLoading(true));
  try {
    apiConnector(
      'POST',
      paymentApi.POST_VERIFY_PAYMENT_SIGNATURE_API,
      { ...response, courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    navigate('/dashboard/enrolled-courses');
    if (cartResetTrue) dispatch(resetCart());
  } catch (error) {
    toast.error(error?.response?.data?.error || '⚠️ Payment Verification Failed');
  }
  dispatch(setPaymentLoading(false));
  toast.dismiss(toastId);
};
