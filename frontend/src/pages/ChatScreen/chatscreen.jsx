import React from "react";
import menu from "./src/menu.svg";
import "./chatscreenstyle.css";
import vector from "./src/vector.svg";
import MenuGroup from "../../components/PageMenu/pagemenu";

import { useNavigate } from "react-router-dom";

export const ChatScreen = () => {
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
    <div className="chatscreen">
      <div className="div">
        <div className="overlap-group">
          <div className="rectangle"/>

          <img className="vector" alt="Vector" src={vector}/>

          <div className="text-wrapper">Напишите сообщение</div>

          <img className="menu" alt="Menu" src={menu}/>
        </div>
        
        <div className="buttons">
          <MenuGroup 
            onMenuClickAccount={handleMenuClick4}
            onMenuClickSleep={handleMenuClick5}
            onMenuClickMain={handleMenuClick}
            onMenuClickStatistic={handleMenuClick2}
            onMenuClickChat={handleMenuClick3}
          />
        </div>
        
        <div className="background-colors">
          <div className="blue-gradient"/>
          <div className="red-gradient"/>
          <div className="yellow-gradient"/>
          <div className="green-gradient"/>
          <div className="pirple-gradient"/>
          <div className="yellow-gradient2"/>
          <div className="green-gradient2"/>
        </div>
      </div>
    </div>
  );
};