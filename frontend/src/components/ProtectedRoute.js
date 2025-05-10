import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("userId"); // Проверка авторизации

    return isAuthenticated ? <Outlet /> : <Navigate to="/entry" replace />;
};

export default ProtectedRoute;