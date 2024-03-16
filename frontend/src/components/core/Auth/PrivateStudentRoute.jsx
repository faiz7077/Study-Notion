import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ROLE_TYPE } from '../../../utils/constants';
import PageNotAccessible from '../../../pages/PageNotAccessible';

const PrivateStudentRoute = ({ route }) => {
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);

  return token === null
    ? <Navigate to={'/login'} />
    : user?.role === ROLE_TYPE.STUDENT
      ? route
      :
      <PageNotAccessible />
  // return token ? route : <Navigate to={'/login'} />
}

export default PrivateStudentRoute
