import React from "react";
import leftEye from "./src/left-eye.svg";
import rightEye from "./src/right-eye.svg";
import "./statisticscreenstyle.css";
import MenuGroup from "../../components/PageMenu/pagemenu";

import { useNavigate } from "react-router-dom";

export const StatisticScreen = () => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate("/main");
  };

  const handleMenuClick2 = () => {
    navigate("/statistic");
  };

  const handleMenuClick3 = () => {
    navigate("/chat");
  };

  const handleMenuClick4 = () => {
    navigate("/account");
  };

  const handleMenuClick5 = () => {
    navigate("/sleep");
  };

  return(
    <div className="statisticscreen">
      <div className="div">
        <div className="text-wrapper">Статистика</div>

        <div className="view">
          <div className="overlap-group">
            <img className="right-eye" alt="Right eye" src={rightEye}/>

            <img className="left-eye" alt="Left eye" src={leftEye}/>
          </div>
        </div>

        <div className="overlap-wrapper">
          <div className="overlap">
            <div className="text-wrapper-2">День</div>

            <div className="overlap-group-2">
              <div className="text-wrapper-3">Неделя</div>
            </div>

            <div className="text-wrapper-4">Месяц</div>
          </div>
        </div>

        <p className="p">
          <span className="span">Совет.</span>

          <span className="text-wrapper-5">&nbsp;</span>

          <span className="text-wrapper-6">
            Чтобы узнать <br/>
            подробную информацию <br/>
            про отметку на графике, <br/>
            зажмите выбранную <br/>
            точку - Ассистент <br/>
            все расскажет.
          </span>
        </p>
      </div>
      <MenuGroup 
        activePage={"statistic"}
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
      />
    </div>
  );
};