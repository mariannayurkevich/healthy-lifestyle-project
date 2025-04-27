import React from "react";
import leftEye from "./src/left-eye.svg";
import line101 from "./src/line-101.svg";
import rightEye from "./src/left-eye.svg";
import "./registrationfirststyle.css";
import vectorNext from "./src/vector-next.svg";
import vectorPrev from "./src/vector-prev.svg";

import { useNavigate } from "react-router-dom";

export const RegistrationFirstScreen = () => {

    const navigate = useNavigate();
        
          const handleClick = () => {
            navigate('/entry');
          };

          const handleClick2 = () => {
            navigate('/registrationsecond');
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
                <div className="text-wrapper">Электронная почта</div>
            </div>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap-group">
              <div className="text-wrapper">Пароль</div>
            </div>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap-group">
              <div className="text-wrapper">Повторите пароль</div>
            </div>
          </div>

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
        
        <div className="text-wrapper-5">Пароль должен содержать...</div>
      </div>
    </div>
  );
};