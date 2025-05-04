import React from "react";
import water from "./src/water-tracker.svg";
import food from "./src/food-tracker.svg";
//import image2 from "./src/image-2.png";
//import image from "./src/image.png";
//import image1 from "./src/image.svg";
import groupCloud from "./src/group-cloud.svg";
import line89 from "./src/line-89.svg";
import activeAi from "./src/active-ai.svg";
//import maskGroup from "./src/mask-group.png";
import "./mainscreenstyle.css";
//import union2 from "./src/union-2.svg";
//import union from "./src/union.svg";
//import vector5 from './src/vector-3.svg';
//import group34 from './src/group-34.svg';
//import vector6 from './src/group-36.svg';
//import vector7 from './src/vector-38.svg';
//import group from './src/group-37.svg';
import MenuGroup from "../../components/PageMenu/pagemenu";

import { useNavigate } from "react-router-dom";

export const MainScreen = () => {
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

  return (
    <div className="mainscreen">
      <div className="div">
        <div className="text-wrapper">Привет,</div>

        <div className="text-wrapper-2">Малинка Ди</div>

        <MenuGroup 
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
       />

        <div className="overlap">
          <div className="group">
            <img className="water" alt="Group" src={water} />

            <div className="text-wrapper-9">Вода</div>

            <div className="text-wrapper-10">1.0 л</div>
          </div>
         
         <div className="image">
          <img className="food" alt="Image" src={food} />

          <div className="text-wrapper-11">Питание</div>

          <div className="text-wrapper-12">255 Ккал</div>
         </div>

         <div className="overlap-group">
              <div className="rectangle" />

              <div className="ellipse" />

              <img className="line" alt="Line" src={line89} />

              <div className="overlap-group-wrapper">
                <img className="activeAi" alt="Group" src={activeAi}/>
              </div>

              <p className="p">
                <span className="text-wrapper-4">Активность </span>

                <span className="text-wrapper-5">50 мин</span>
              </p>
            </div>

          <div className="overlap-wrapper">
            <div className="overlap-2">
              <div className="rectangle-2" />

              <p className="element-2">
                <span className="text-wrapper-6">8</span>

                <span className="text-wrapper-7">&nbsp;</span>

                <span className="text-wrapper-3">ЧАСОВ</span>
              </p>

              <div className="text-wrapper-8">Сон</div>

              <div className="div-wrapper">
                <div className="overlap-3">
                  <img className="group-cloud" alt="Group" src={groupCloud}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <img className="img-2" alt="Img" src={image2} />
        */}
      </div>
    </div>
  );
};
