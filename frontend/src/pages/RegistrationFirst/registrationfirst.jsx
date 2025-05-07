import React, { useState } from "react";
import leftEye from "./src/left-eye.svg";
import line101 from "./src/line-101.svg";
import rightEye from "./src/left-eye.svg";
import "./registrationfirststyle.css";
import vectorNext from "./src/vector-next.svg";
import vectorPrev from "./src/vector-prev.svg";

import { useNavigate } from "react-router-dom";

export const RegistrationFirstScreen = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);
        
          const handleClick = () => {
            navigate('/entry');
          };

    const handleClick2 = async () => {
        if (email.trim() === "" || password.trim() === "" || repeatPassword.trim() === "") {
            setError(true);
            setError2(false);
        } else if (password.trim() !== repeatPassword.trim()) {
            setError(false);
            setError2(true);
        } else {
            setError(false);
            setError2(false);
            try {
                const response = await fetch("http://localhost:8080/api/v1/registration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        confirmPassword: repeatPassword,
                        firstName: "", // Пока пустое, будет заполнено на втором шаге
                        lastName: "",  // Пока пустое
                    }),
                });
                if (response.ok) {
                    navigate('/registrationsecond', { state: { email } });
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка регистрации: ${errorData.message || "Неизвестная ошибка"}`);
                }
            } catch (error) {
                alert("Ошибка при отправке запроса: " + error.message);
            }
        }
    };

          const handleClick3 = () => {
            navigate('/first');
          };

return(
    <div className="registrationfirst">
      <div className="div">
        <div className="overlap">
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

          <div className="view">
            <div className="overlap-2">
                <div className="ellipse" />

                <img className="line" alt="Line" src={line101} />

                <div className="ellipse-2" />
            </div>
          </div>

          <div className="button-next">
            <div className="overlap-3" onClick={handleClick2}>
              <div className="text-wrapper-2">Далее</div>

              <img className="vector-next" alt="Vector next" src={vectorNext}/>
            </div>
          </div>
        </div>

        <div className="text-wrapper-3">Регистрация</div>

        <div className="div-2">
            <div className="text-wrapper-4" onClick={handleClick}>Войти</div>

            <img className="vector-prev" alt="Vector prev" src={vectorPrev} onClick={handleClick3} />
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