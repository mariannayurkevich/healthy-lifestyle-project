import React from "react";
import { useNavigate } from "react-router-dom";
import maskGroup1 from "./src/mask-group-1.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import "./firstscreenstyle.css";

export const FirstScreen = () => {
  const navigate = useNavigate();

  // Функция для перенаправления на главный экран
  const handleRedirect = () => {
    navigate("/entry");
  };

  const handleRedirect2 = () => {
    navigate("/registrationfirst");
  };

  return (
    <div className="firstscreen">
      <div className="div">
        <div className="overlap-group">
          <div className="overlap-group-wrapper">
            <div className="red-circle-content">
              <div className="overlap-group-2">
                <img
                  className="mask-group"
                  alt="Mask group"
                  src={maskGroup1}
                />
                <img className="img" alt="Mask group" src={maskGroup2} />
              </div>
            </div>
          </div>     
        </div>

        <div className="buttons">
          <div className="overlap-wrapper">
            <div className="overlap-2" onClick={handleRedirect2}>
              <div className="text-wrapper">Зарегестрироваться</div>
            </div>
          </div>

          <div className="overlap-wrapper-2">
            <div className="overlap-3" onClick={handleRedirect}>
              <div className="text-wrapper-2">Войти</div>
            </div>
        </div>

        </div>
        

        <div className="text-wrapper-3">FRENDZY</div>

        <p className="p">
          Команда поддержки <br />у тебя в кармане!
        </p>

      </div>
    </div>
  );
};
