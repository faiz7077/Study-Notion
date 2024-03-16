const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

// AUTHENTICATION API
export const authApi = {
  POST_SEND_OTP_API: BASE_URL + '/auth/sendotp',
  POST_SIGNUP_USER_API: BASE_URL + '/auth/signup',
  POST_LOGIN_USER_API: BASE_URL + '/auth/login',
  POST_LOGOUT_USER_API: BASE_URL + '/auth/logout',
  GET_GET_ME_API: BASE_URL + '/auth/getme',
  PUT_CHANGE_PASSWORD_API: BASE_URL + '/auth/changepassword',
  POST_FORGOT_PASSWORD_API: BASE_URL + '/auth/forgotpassword',
  PUT_RESET_PASSWORD_API: BASE_URL + '/auth/resetpassword',
  POST_CREATE_ADMIN_API: BASE_URL + '/auth/createadmin',
}

// CATAGORIES API
export const categoriesApi = {
  GET_GET_ALL_CATEGORIES_API: BASE_URL + '/categories',
  POST_GET_CATEGORY_COURSES_API: BASE_URL + '/categories/getcategorycourses',
  POST_GET_CREATE_CATEGORY_API: BASE_URL + '/categories'
}

// COURSE PROGRESS API
export const courseProgressApi = {
  POST_MARK_SUBSECTION_AS_COMPLETED: BASE_URL + '/courseprogress/marksubsectionascompleted'
}

// COURSE API
export const courseApi = {
  GET_GET_ALL_COURSES_API: BASE_URL + '/courses',
  GET_GET_COURSE_DATA_API: BASE_URL + '/courses/getcourse', // /courseId
  POST_GET_FULL_DETAILS_OF_COURSE: BASE_URL + '/courses/getfullcoursedetails',
  POST_CREATE_COURSE_API: BASE_URL + '/courses',
  PUT_EDIT_COURSE_API: BASE_URL + '/courses/editcourse',
  DELETE_DELETE_COURSE_API: BASE_URL + '/courses/deletecourse',
  POST_GET_ENROLLED_COURSE_DATA: BASE_URL + '/courses/getenrolledcoursedata'
}

// OTHER API
export const otherApi = {
  POST_CONTACT_US: BASE_URL + '/other/contactus'
}

// PAYMENT API
export const paymentApi = {
  POST_CREATE_ORDER_API: BASE_URL + '/payments/createorder',
  POST_VERIFY_PAYMENT_SIGNATURE_API: BASE_URL + '/payments/verifypaymentsignature',
  POST_SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + '/payments/sendpaymentsuccessemail',
}


// PROFILE API
export const profileApi = {
  PUT_UPDATE_PROFILE_API: BASE_URL + '/profiles ',
}

// REVIEW API
export const reviewApi = {
  GET_GET_ALL_REVIEWS_API: BASE_URL + '/reviews/getallreviews',
  POST_GET_REVIEW_API: BASE_URL + '/reviews/getreview',
  POST_GET_ALL_REVIEWS_OF_COURSE_API: BASE_URL + '/reviews/getreviewsofcourse',
  POST_CREATE_REVIEW_API: BASE_URL + '/reviews/createreview',
  DELETE_DELETE_REVIEW_API: BASE_URL + '/reviews/deletereview',
}

// SECTION API
export const sectionApi = {
  POST_CREATE_SECTION_API: BASE_URL + '/sections',
  PUT_UPDATE_SECTION_API: BASE_URL + '/sections',
  DELETE_DELETE_SECTION_API: BASE_URL + '/sections',
}

// SUBSECTION API
export const subsectionApi = {
  POST_CREATE_SUBSECTION_API: BASE_URL + '/subsections',
  PUT_UPDATE_SUBSECTION_API: BASE_URL + '/subsections',
  DELETE_DELETE_SUBSECTION_API: BASE_URL + '/subsections',
}

// USER API
export const userApi = {
  GET_GET_ALL_USERS_API: BASE_URL + '/users',
  GET_GET_USER_API: BASE_URL + '/users/getuser', // /userId
  PUT_CHANGE_AVATAR_API: BASE_URL + '/users/changeavatar',
  GET_GET_ENROLLED_COURSES_API: BASE_URL + '/users/getenrolledcourses',
  GET_GET_CREATED_COURSES_API: BASE_URL + '/users/getcreatedcourses',
  GET_GET_INSTRUCTOR_DASHBOARD_DATA_API: BASE_URL + '/users/getinstructordashboarddata',
  GET_GET_ALL_REVIEWS_BY_USER_API: BASE_URL + '/users/getallreviews',
  DELETE_DELETE_CURRENT_USER_API: BASE_URL + '/users/deletecurrentuser',
  GET_CURRENT_LOGGED_USER_API: BASE_URL + '/users/currentuser',
}
