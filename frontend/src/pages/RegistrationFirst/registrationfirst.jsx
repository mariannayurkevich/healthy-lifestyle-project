import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import leftEye from "./src/left-eye.svg";
import rightEye from "./src/left-eye.svg";
import line101 from "./src/line-101.svg";
import vectorNext from "./src/vector-next.svg";
import vectorPrev from "./src/vector-prev.svg";
import "./registrationfirststyle.css"; // объединённый CSS

export const RegistrationFirstScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(false);   // ошибка: неполное заполнение полей
  const [error2, setError2] = useState(false); // ошибка: пароли не совпадают

  const handleLogin = () => {
    navigate('/entry');
  };

  // Кнопка "стрелка назад" – можно изменить назначение навигации по своему усмотрению
  const handleBack = () => {
    navigate('/first');
  };

  const handleRegistration = () => {
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      repeatPassword.trim() === ""
    ) {
      setError(true);
      setError2(false);
    } else if (password.trim() !== repeatPassword.trim()) {
      setError(false);
      setError2(true);
    } else {
      setError(false);
      setError2(false);
      navigate('/registrationsecond');
    }
  };

  return (
    <div className="registrationCombined">
      <div className="div">
        <div className="overlap">
         <div className="form-container"> 
          {/* Верхнее поле – имя пользователя */}
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <input
                type="text"
                placeholder="Имя пользователя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-name"
              />
            </div>
          </div>
          {/* Сместив поле электронной почты вниз */}
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-email"
              />
            </div>
          </div>
          {/* Поле ввода пароля */}
          <div className="overlap-wrapper">
            <div className="overlap-group">
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-password"
              />
            </div>
          </div>
          {/* Поле повтора пароля */}
          <div className="overlap-wrapper-2">
            <div className="overlap-group">
              <input
                type="password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="input-repeat-password"
              />
            </div>
          </div>
         </div>

          {error && (
            <div className="error-message">
              Заполните все поля для регистрации*
            </div>
          )}

          {error2 && (
            <div className="error-message">
              Пароли должны совпадать*
            </div>
          )}

          <div className="text-wrapper-5">Пароль должен содержать...</div>

          <div className="button-registration">
            <div className="overlap-3" onClick={handleRegistration}>
              <div className="text-wrapper-2">Регистрация</div>
              <img className="vector-next" alt="Vector next" src={vectorNext}/>
            </div>
          </div>
        </div>

        <div className="text-wrapper-3">Регистрация</div>

        <div className="div-2">
          <div className="text-wrapper-4" onClick={handleLogin}>
            Войти
          </div>
          <img
            className="vector-prev"
            alt="Vector prev"
            src={vectorPrev}
            onClick={handleBack}
          />
        </div>

        <div className="view-2">
          <div className="overlap-4">
            <img className="left-eye" alt="Left eye" src={leftEye} />
            <img className="right-eye" alt="Right eye" src={rightEye} />
          </div>
        </div>
      </div>
    </div>
  );
};
