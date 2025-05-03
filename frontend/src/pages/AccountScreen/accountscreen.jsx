import React from "react";
import x2 from "./src/eye-left.svg";
import x1 from "./src/eye-right.svg";
//import image from "./src/Vector.svg";
import line98 from "./src/line-98.svg";
import line99 from "./src/line-98.svg";
import "./accountscreenstyle.css";
import vectorAi from "./src/vector-ai.svg";
import vectorNext from "./src/pointer.svg";
import MenuGroup from "../../components/PageMenu/pagemenu";

import { useNavigate } from "react-router-dom";

export const AccountScreen = () => {
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
    <div className="accountscreen">
      <div className="div">
      
        {/* График "Дневник веса" */}
        <div className="weight-chart">
          <div className="chart-title">Дневник веса</div>
          <svg
            className="chart-svg"
            viewBox="0 0 400 220"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Линия графика (пример; координаты можно менять в зависимости от данных) */}
            <polyline
              className="chart-line"
              fill="none"
              stroke="#68ff32"  /* зеленый цвет линии */
              strokeWidth="2"
              points="60,170 110,160 160,130 210,190 260,150 310,230 360,180"
            />

            {/* Точки графика с единым стилем */}
            <circle className="chart-point" cx="60" cy="170" r="4" />
            <circle className="chart-point" cx="110" cy="160" r="4" />
            <circle className="chart-point" cx="160" cy="130" r="4" />
            <circle className="chart-point" cx="210" cy="190" r="4" />
            <circle className="chart-point" cx="260" cy="150" r="4" />
            <circle className="chart-point" cx="310" cy="230" r="4" />
            <circle className="chart-point" cx="360" cy="180" r="4" />

            {/* Подписи по оси X */}
            <text x="60" y="280" textAnchor="middle" fontSize="14">П</text>
            <text x="110" y="280" textAnchor="middle" fontSize="14">В</text>
            <text x="160" y="280" textAnchor="middle" fontSize="14">С</text>
            <text x="210" y="280" textAnchor="middle" fontSize="14">Ч</text>
            <text x="260" y="280" textAnchor="middle" fontSize="14">П</text>
            <text x="310" y="280" textAnchor="middle" fontSize="14">С</text>
            <text x="360" y="280" textAnchor="middle" fontSize="14">В</text>

            {/* Подписи по оси Y */}
            <text x="40" y="250" textAnchor="end" fontSize="14">0 кг</text>
            <text x="40" y="190" textAnchor="end" fontSize="14">50 кг</text>
            <text x="40" y="130" textAnchor="end" fontSize="14">100 кг</text>
          </svg>
        </div>

      <MenuGroup 
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
       />

        <div className="overlap-group-wrapper">
          <div className="overlap-group">
            <img className="element" alt="Element" src={x1} />

            <img className="img" alt="Element" src={x2} />
          </div>
        </div>

        <div className="text-wrapper">Малинка Ди</div>

        <div className="text-wrapper-2">42 кг</div>

        <div className="text-wrapper-3">150 см</div>

        <div className="text-wrapper-4">20 лет</div>

        <div className="overlap-group-2">
          <div className="text-wrapper-5">Настроить цели</div>

          <img className="vector" alt="Vector" src={vectorNext} />
        </div>

        <div className="view" />

        <div className="overlap">
          <div className="rectangle" />

          <div className="text-wrapper-6">ИИ на связи</div>

          <div className="text-wrapper-7">
            Сегодня нужно ещё немного
            <br />
            поднажать;)
          </div>

          <img className="vector-ai" alt="Vector ai" src={vectorAi} />
        </div>

        <img className="line" alt="Line" src={line98} />

        <img className="line-2" alt="Line" src={line99} />
        
        {/* 
          <img className="vector-2" alt="Vector" src={image} />
        */}
      </div>
    </div>
  );
};