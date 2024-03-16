import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Contact from './pages/Contact'
import About from './pages/About'
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/PageNotFound';
import Navbar from './components/common/Navbar';
import PublicRoute from './components/core/Auth/PublicRoute';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import DashBoard from './pages/DashBoard';
import MyProfile from './components/core/Dashboard/MyProfile';
import Settings from './components/core/Dashboard/Settings/Settings';
import Cart from './components/core/Dashboard/Cart/Cart';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
// eslint-disable-next-line
import PurchaseHistory from './components/core/Dashboard/PurchaseHistory';
// eslint-disable-next-line
import { ROLE_TYPE } from './utils/constants';
import InstructorDashboard from './components/core/Dashboard/InstructorDashboard/InstructorDashboard';
import InstructorMyCourses from './components/core/Dashboard/InstructorMyCourses/InstructorMyCourses';
import AddCourse from './components/core/Dashboard/AddCourse/AddCourse';
import PrivateStudentRoute from './components/core/Auth/PrivateStudentRoute';
import PrivateInstructorPage from './components/core/Auth/PrivateInstructorPage';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse'
import CategoryCourses from './pages/CategoryCourses';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';


function App() {

  const { token } = useSelector(state => state.auth);

  // eslint-disable-next-line
  const { user } = useSelector(state => state.profile);

  return (
    <div className="bg-richblack-900 w-screen min-h-screen flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/categorycourses/:categoryName' element={<CategoryCourses />} />
        <Route path='/course/:courseId' element={<CourseDetails />} />

        <Route path='/login' element={<PublicRoute route={<LogIn />} />} />
        <Route path='/signup' element={<PublicRoute route={<SignUp />} />} />
        <Route path='/verify-email' element={<PublicRoute route={<VerifyEmail />} />} />
        <Route path='/forgot-password' element={<PublicRoute route={<ForgotPassword />} />} />
        <Route path='/reset-password' element={<PublicRoute route={<ResetPassword />} />} />


        {/* Dashboard nested routes - Default route set to - dashboard/my-profile */}
        <Route path='dashboard' element={<PrivateRoute route={<DashBoard />} />} >

          <Route index element={<Navigate to={'my-profile'} />} />
          <Route path='my-profile' element={<MyProfile />} />
          <Route path='settings' element={<Settings />} />

          {/* Routes only for students */}
          <Route path='cart' element={<PrivateStudentRoute route={<Cart />} />} />
          <Route path='enrolled-courses' element={<PrivateStudentRoute route={<EnrolledCourses />} />} />
          {/* <Route path='purchase-history' element={<PrivateStudentRoute route={<PurchaseHistory />} />} /> */}

          {/* {
            user?.role === ROLE_TYPE.STUDENT &&
            (
              <>
                <Route path='cart' element={<Cart />} />
                <Route path='enrolled-courses' element={<EnrolledCourses />} />
                <Route path='purchase-history' element={<PurchaseHistory />} />
              </>
            )
          } */}

          {/* Routes only for instructor */}
          <Route path='instructor' element={<PrivateInstructorPage route={<InstructorDashboard />} />} />
          <Route path='my-courses' element={<PrivateInstructorPage route={<InstructorMyCourses />} />} />
          <Route path='add-course' element={<PrivateInstructorPage route={<AddCourse />} />} />
          <Route path='edit-course/:courseId' element={<PrivateInstructorPage route={<EditCourse />} />} />

          {/* {
            user?.role === ROLE_TYPE.INSTRUCTOR &&
            (
              <>
                <Route path='instructor' element={<InstructorDashboard />} />
                <Route path='my-courses' element={<InstructorMyCourses />} />
                <Route path='add-course' element={<AddCourse />} />
              </>
            )
          } */}

        </Route>

        <Route
          path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
          element={<PrivateStudentRoute route={<ViewCourse />} />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
