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
  // Состояния для полей ввода и ошибки
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Функция для перенаправления на главный экран
  const handleRedirect = () => {
    // Если хотя бы одно поле пустое, показываем сообщение об ошибке
    if (email.trim() === "" || password.trim() === "") {
      setError(true);
    } else {
      setError(false);
      navigate("/main");
    }
  };

  const handleRedirect2 = () => {
    navigate("/first");
  };

  const handleRedirect3 = () => {
    navigate("/registrationfirst");
  };

  const handleForgotPassword = () => {
  // Пример: переход к маршруту восстановления пароля
  navigate("/password-forgot");
  };


  return (
    <div className="entryscreen">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group-wrapper">
            <div className="overlap-group" onClick={handleRedirect}>
              <div className="text-wrapper">Войти</div>
            </div>
          </div>

          <div className="text-wrapper-2" onClick={handleForgotPassword}>Забыли пароль?</div>
          <div className="view" />

          {/* Поле ввода "Электронная почта" */}
          <div className="overlap-wrapper">
            <input
              type="email"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-email"
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
            />
          </div>

          {/* Сообщение об ошибке, отображается только если ошибка установлена */}
          {error && (
            <div className="error-message">
              Введите адрес эл. почты и пароль*
            </div>
          )}

          <div className="overlap-wrapper-3">
            <div className="overlap-2">
              <img className="google" alt="Google" src={google} />
              <div className="text-wrapper-4">Продолжить с Google</div>
              <img className="pointer2" alt="Pointer" src={pointer} />
            </div>
          </div>
        </div>

        <div className="text-wrapper-5">Вход</div>

        <div className="div-2">
          <div className="text-wrapper-6" onClick={handleRedirect3}>Регистрация</div>

          <img className="pointer" alt="Ponter" src={ponter2} onClick={handleRedirect2}/>
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
