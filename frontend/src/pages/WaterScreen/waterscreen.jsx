import React from "react";
import line103 from "./src/line-103.svg";
import "./waterscreenstyle.css";
import vector4 from "./src/vector-4.svg";
import vector from "./src/vector.svg";

import { useNavigate } from "react-router-dom";

export const WaterScreen = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/main');
  };

  return (
    <div className="waterscreen">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="group">
              <div className="div">
                <div className="ellipse" />

                <div className="ellipse-2" />
              </div>
            </div>

            <div className="overlap-group-wrapper">
              <div className="overlap-2">
                <div className="ellipse-3" />

                <div className="ellipse-4" />

                <div className="ellipse-5" />
              </div>
            </div>

            <div className="div-wrapper">
              <div className="overlap-3">
                <div className="text-wrapper">+ Выпить</div>
              </div>
            </div>

            <div className="text-wrapper-2">Вода</div>

            <div className="text-wrapper-3">1800 мл</div>

            <div className="text-wrapper-4">Сегодня</div>

            <div className="text-wrapper-5">500 мл</div>

            <div className="text-wrapper-6">Напиток</div>

            <img className="line" alt="Line" src={line103} />

            <img className="vector" alt="Vector" src={vector4} />
          </div>

          <div className="div-2">
            <div className="text-wrapper-7">Назад</div>

            <img className="img" alt="Vector" src={vector} onClick={handleClick}/>
          </div>
        </div>
      </div>
    </div>
  );
};
