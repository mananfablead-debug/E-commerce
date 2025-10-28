import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  // if logged in → redirect to home
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // otherwise render login/signup
  return children;
};

export default PublicRoute;
