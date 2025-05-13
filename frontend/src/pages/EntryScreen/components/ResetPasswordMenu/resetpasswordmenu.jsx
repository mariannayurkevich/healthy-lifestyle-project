// ResetPasswordCodeMenu.jsx
import React, { useState } from "react";
import leftEye from "../../src/right-eye.svg";
import rightEye from "../../src/right-eye.svg";
import ponter2 from "../../src/pointer-2.svg";
import "../../entryscreenstyle.css";

import { useNavigate } from "react-router-dom";


export const ResetPasswordCodeMenu = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // Если длина введённого кода (например, 4 или 6 цифр) достаточная, отображаем поля для пароля  
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    // Пример: если введено 4 и более символов, показываем поля для нового пароля  
    setShowPasswordFields(value.trim().length >= 4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("/api/v1/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: code,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка сброса пароля");
      }

      const result = await response.text();
      if (result === "Password successfully reset") {
        navigate("/entry");
      }

    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  };

  const handleRedirect2 = () => {
    navigate(-1);
  };

  return (
    <div className="entryscreen reset-password-code-menu">
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
          <form onSubmit={handleSubmit} className="reset-code-form">
            <div className="info-text">
              На Вашу электронную почту был отправлен код, введите его для продолжения
            </div>
            <div className="overlap-wrapper">
              <input
                type="text"
                placeholder="Код"
                value={code}
                onChange={handleCodeChange}
                className="input-email" /* используем тот же стиль, что и для ввода эл. почты */
              />
            </div>
            {showPasswordFields && (
              <>
                <div className="overlap-wrapper-2">
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-password"
                  />
                </div>
                <div className="overlap-wrapper-7">
                  <input
                    type="password"
                    placeholder="Подтверждение нового пароля"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="input-password"
                  />
                </div>
              </>
            )}
            <div className="button-send-code">
              <button type="submit">Войти</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
