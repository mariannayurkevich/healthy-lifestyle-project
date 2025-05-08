import React from "react";
import line100 from "./src/line-100.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import maskGroup from "./src/mask-group.svg";
import "./foodscreenstyle.css";
import vector5 from "./src/vector-5.svg";
import vector from "./src/vector.svg";

import { useNavigate } from "react-router-dom";

export const FoodScreen = () => {
    const navigate = useNavigate();
    
      const handleClick = () => {
        navigate('/main');
      };

  return (
    <div className="foodscreen">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <div className="group">
              <div className="overlap-group-2">
                <img className="mask-group" alt="Mask group" src={maskGroup2} />

                <img className="img" alt="Mask group" src={maskGroup} />
              </div>
            </div>

            <div className="text-wrapper">Питание</div>

            <div className="text-wrapper-2">Сегодня</div>

            <div className="div-2">
              <div className="text-wrapper-3">Назад</div>

              <img className="vector" alt="Vector" src={vector} onClick={handleClick}/>
            </div>

            <div className="text-wrapper-4">1800 ККал</div>
          </div>

          <div className="text-wrapper-5">50 ккал</div>

          <p className="element">
            <span className="span">
              Продукт
              <br />
            </span>

            <span className="text-wrapper-6">100 г</span>
          </p>

          <img className="vector-2" alt="Vector" src={vector5} />
        </div>

        <img className="line" alt="Line" src={line100} />

        <div className="overlap-wrapper">
          <div className="div-wrapper">
            <div className="text-wrapper-7">+ Еда</div>
          </div>
        </div>
      </div>
    </div>
  );
};
