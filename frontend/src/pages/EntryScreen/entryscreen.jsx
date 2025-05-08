import React, { useState } from "react";
import google from "./src/google.svg";
import leftEye from "./src/right-eye.svg";
import pointer from "./src/pointer.svg";
import ponter2 from "./src/pointer-2.svg";
import rightEye from "./src/right-eye.svg";
import "./entryscreenstyle.css";

import { useNavigate } from "react-router-dom";

export const EntryScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Все поля обязательны для заполнения");
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include" // Для работы с куками сессии
      });

      if (response.ok) {
        const userResponse = await fetch("/api/users/me", {
          credentials: "include"
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem("userId", userData.id); // Сохраняем ID

          const profileCheck = await fetch(`/api/users/check-profile/${userData.id}`);
          if (!profileCheck.ok) {
            console.error("Ошибка проверки профиля:", profileCheck.status);
            setError("Ошибка проверки профиля");
            return;
          }

          const responseText = await profileCheck.text();
          let profileCompleted;
          try {
            profileCompleted = responseText ? JSON.parse(responseText) : false;
          } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
            setError("Некорректный ответ сервера");
            return;
          }

          navigate(profileCompleted ? "/main" : "/questionnaire");
        } else {
          setError("Не удалось получить данные пользователя");
        }
      } else {
        const errorText = await response.text();
        setError(errorText || "Ошибка авторизации");
      }
    } catch (err) {
      setError("Сервер недоступен");
      console.error("Network error:", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };


  const handleRedirectToRegistration = () => {
    navigate("/registrationfirst");
  };

  return (
      <div className="entryscreen">
        <div className="div">
          <form onSubmit={handleLogin}>
            <div className="overlap">
              <div className="overlap-group-wrapper">
                <button type="submit" className="overlap-group">
                  <div className="text-wrapper">Войти</div>
                </button>
              </div>

              <div className="text-wrapper-2">Забыли пароль?</div>
              <div className="view" />

              {/* Поле ввода "Электронная почта" */}
              <div className="overlap-wrapper">
                <input
                    type="email"
                    placeholder="Электронная почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-email"
                    required
                />
              </div>

              {/* Поле ввода "Пароль" */}
              <div className="overlap-wrapper-2">
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-password"
                    required
                />
              </div>

              {error && (
                  <div className="error-message">
                    {error.includes("Bad credentials")
                        ? "Неверный email или пароль"
                        : error}
                  </div>
              )}

              <div className="overlap-wrapper-3">
                <div className="overlap-2" onClick={handleGoogleLogin}>
                  <img className="google" alt="Google" src={google} />
                  <div className="text-wrapper-4">Продолжить с Google</div>
                  <img className="pointer2" alt="Pointer" src={pointer} />
                </div>
              </div>
            </div>
          </form>

          <div className="text-wrapper-5">Вход</div>

          <div className="div-2">
            <div className="text-wrapper-6" onClick={handleRedirectToRegistration}>
              Регистрация
            </div>
            <img className="pointer" alt="Ponter" src={ponter2} />
          </div>

          <div className="view-2">
            <div className="overlap-3">
              <img className="left-eye" alt="Left eye" src={leftEye} />
              <img className="right-eye" alt="Right eye" src={rightEye} />
            </div>
          </div>
        </div>
      </div>
  );
};