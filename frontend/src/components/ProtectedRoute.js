import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }) => {
  // Здесь можно использовать свою логику авторизации, например, проверку токена в localStorage,
  // или обращаться к контексту/Redux-состоянию.
  return isAuthenticated ? <Outlet /> : <Navigate to="/entry" replace />;
};

export default ProtectedRoute;
