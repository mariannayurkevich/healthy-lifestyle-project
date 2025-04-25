import React from "react";
import maskGroup1 from "./src/mask-group-1.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import "./entryscreenstyle.css";

import { useNavigate } from "react-router-dom";

export const EntryScreen = () => {
  const navigate = useNavigate();

  // Функция для перенаправления на главный экран
  const handleRedirect = () => {
    navigate("/main");
  };

  return (
    <div className="entryscreen">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <div className="overlap-group-wrapper">
              <div className="overlap-group-2">
                <img className="mask-group" alt="Mask group" src={maskGroup1} />
                <img className="img" alt="Mask group" src={maskGroup2} />
              </div>
            </div>

            <div className="overlap-wrapper">
              <div className="overlap-2">
                {/* Обработчик клика, редирект на основной экран */}
                <div className="text-wrapper" onClick={handleRedirect}>
                  Зарегестрироваться
                </div>
              </div>
            </div>

            <div className="overlap-wrapper-2">
              <div className="overlap-3">
                {/* Обработчик клика, редирект на основной экран */}
                <div className="text-wrapper-2" onClick={handleRedirect}>
                  Войти
                </div>
              </div>
            </div>
          </div>

          <div className="text-wrapper-3">FRENDZY</div>
        </div>

        <p className="p">
          Команда поддержки <br />у тебя в кармане!
        </p>
      </div>
    </div>
  );
};