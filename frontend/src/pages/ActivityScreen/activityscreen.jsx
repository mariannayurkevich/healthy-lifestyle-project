import React from "react";
import vector5 from "./src/vector-5.svg";
import line89 from "./src/line-89.svg";
import line100 from "./src/line-100.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import maskGroup from "./src/mask-group.svg";
import "./activityscreenstyle.css";
import union from "./src/union.svg";
import vector6 from "./src/vector-6.svg";
import vector from "./src/vector.svg";

import { useNavigate } from "react-router-dom";

export const ActivityScreen = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/main');
    };

  return (
    <div className="activityscreen">
      <div className="div">
        <div className="union">
          <div className="group">
            <div className="overlap-group">
              <img className="mask-group" alt="Mask group" src={maskGroup} />
              
              <img className="img" alt="Mask group" src={vector5} />

            </div>
          </div>

          <div className="text-wrapper">Сегодня</div> 

          <img className="union" alt="Union" src={union} />
          

          <div className="ellipse" />

          <img className="line" alt="Line" src={line89} />

          

          <div className="text-wrapper-2">Активность</div>

          <div className="div-2">
            <div className="text-wrapper-3">Назад</div>

            <img className="vector" alt="Vector" src={vector} onClick={handleClick}/>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap">
              <img className="mask-group-2" alt="Mask group" src={maskGroup2} />
            </div>
          </div>

          <div className="text-wrapper-4">18 мин</div>
        </div>

        <div className="text-wrapper-5">150 ккал</div>

        <p className="element">
          <span className="span">
            Активность
            <br />
          </span>

          <span className="text-wrapper-6">10 мин</span>
        </p>

        <img className="line-2" alt="Line" src={line100} />

        <div className="overlap-group-wrapper">
          <div className="div-wrapper">
            <div className="text-wrapper-7">+ Активность</div>
          </div>
        </div>

        <img className="vector-2" alt="Vector" src={vector6} />
      </div>
    </div>
  );
};
