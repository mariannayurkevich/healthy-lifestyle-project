// ForgotPasswordMenu.jsx
import React, { useState } from "react";
import leftEye from "../../src/right-eye.svg";
import rightEye from "../../src/right-eye.svg";
import ponter2 from "../../src/pointer-2.svg";
import "../../entryscreenstyle.css";

import { useNavigate } from "react-router-dom";

export const ForgotPasswordMenu = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();

    // Если поле пустое – можно показывать сообщение об ошибке
    if (email.trim() === "") {
      alert("Введите, пожалуйста, адрес электронной почты.");
      return;
    }
    // Здесь должна быть логика отправки кода на почту.
    // После успешной отправки переходим к следующему меню.
    navigate("/password-reset"); // Предполагается, что роут настроен для второго меню
  };

  const handleRedirect2 = () => {
    navigate(-1);
  };

  return (
    <div className="entryscreen forgot-password-menu">
      <div className="div">
        <div className="view-5">
          <div className="overlap-3">
            <img className="left-eye" alt="Left eye" src={leftEye} />
            <img className="right-eye" alt="Right eye" src={rightEye} />
          </div>
        </div>

        <div className="div-2">
          <img className="pointer" alt="Ponter" src={ponter2} onClick={handleRedirect2}/>
        </div>

        <div className="text-wrapper-15">Восставновление<br/>пароля</div>

        <div className="overlap">
          {/* Можно использовать похожий контейнер, как для входа */}
          <form onSubmit={handleSendCode} className="forgot-password-form">
            <div className="info-tex">Введите адрес электронной почты, на которой был зарегистрирован аккаунт</div>
            <div className="header">
              
            </div>
            <div className="overlap-wrapper">
              <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-email"
              />
            </div>
            <div className="button-send-code">
              <button type="submit">Отправить код</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
