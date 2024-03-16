import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ route }) => {
  const { token } = useSelector(state => state.auth);
  return token ? route : <Navigate to={'/login'} />
}

export default PrivateRoute
