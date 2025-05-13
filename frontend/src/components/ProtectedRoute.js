import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const [isValidSession, setIsValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState({ auth: false, completed: false });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Проверяем наличие userId в localStorage
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    setIsValidSession(false);
                    setIsLoading(false);
                    return;
                }

                // 2. Проверяем валидность сессии на сервере
                const response = await fetch("/api/users/me", {
                    credentials: "include" // Для передачи кук
                });

                // 3. Если ответ успешный - сессия действительна
                if (response.ok) {
                    setIsValidSession(true);
                    const userData = await response.json();
                    setIsValid({
                        auth: true,
                        completed: userData.profileCompleted
                    });
                } else {
                    localStorage.removeItem("userId"); // Чистим невалидный ID
                }
            } catch (error) {
                console.error("Ошибка проверки авторизации:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div className="loading-screen">Проверка авторизации...</div>;
    }

    return isValidSession ? <Outlet /> : <Navigate to="/entry" replace />;
};

export default ProtectedRoute;