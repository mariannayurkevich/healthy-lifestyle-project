import React, { useState } from "react";
import leftEye from "./src/left-eye.svg";
import line102 from "./src/line-102.svg";
import rightEye from "./src/right-eye.svg";
import "./registrationsecondstyle.css";
import vectorPrev from "./src/vector-prev.svg";

import { useNavigate } from "react-router-dom";

export const RegistrationSecondScreen = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
        
        const handleClick = () => {
          navigate('/entry');
        };

        const handleClick2 = () => {
          if (name.trim() === "") {
            setError(true);
          } else {
            setError(false);
            navigate("/main", { state: { fromRegistrationSecond: true } });
          }
        };

        const handleClick3 = () => {
          navigate('/registrationfirst');
        };

return(
    <div className="registrationsecond">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <input
                type="name"
                placeholder="Имя пользователя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-name"
              />
            </div>
          </div>

          <div className="view">
            <div className="overlap-2">
                <div className="ellipse" />

                <img className="line" alt="Line" src={line102} />

                <div className="ellipse-2" />
            </div>
          </div>

          <div className="button">
            <div className="div-wrapper" onClick={handleClick2}>
              <div className="text-wrapper-2">Регистрация</div>
            </div>
          </div>

          <div className="div-2">
            <div className="ellipse-3"/>

            <div className="text-wrapper-3">Загрузить фото</div>

            <div className="text-wrapper-4">Выбрать аватар</div>
          </div>

          {error && (
            <div className="error-message">
              Введите имя, чтобы мы могли к Вам обращаться*
            </div>
          )}

        </div>

        <div className="text-wrapper-5">Регистрация</div>

        <div className="div-3">
          <div className="text-wrapper-6" onClick={handleClick}>Войти</div>

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