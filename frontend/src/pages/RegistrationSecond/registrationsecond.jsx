import React from "react";
import { useNavigate } from "react-router-dom";
import leftEye from "./src/left-eye.svg";
import rightEye from "./src/right-eye.svg";
import "./registrationsecondstyle.css";

export const RegistrationSecondScreen = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/entry');
  };

  const handleBack = () => {
    navigate('/registrationfirst');
  };

  return (
    <div className="registrationsecond">
      <div className="div">
        {/* Основной белый блок для подтверждения регистрации */}
        <div className="overlap">
          <div className="confirmation-text">
            <h2>Подтверждение регистрации</h2>
            <p>
              Для завершения регистрации, пожалуйста, перейдите в свою почту и подтвердите регистрацию,
              нажав на ссылку в письме.
            </p>
          </div>

          <div className="button-registration">
            <div className="overlap-3" onClick={handleLogin}>
              <div className="text-wrapper-2">Вход</div>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="view-2">
          <div className="overlap-4">
            <img className="left-eye" alt="Left eye" src={leftEye} />
            <img className="right-eye" alt="Right eye" src={rightEye} />
          </div>
        </div>
        
        {/* Заголовок (если необходимо) */}
        <div className="text-wrapper-5">Регистрация</div>
      </div>
    </div>
  );
};
