import React from "react";
import group34 from "./src/group-sleep.svg";
import group from "./src/group-chat.svg";
import vector5 from "./src/vector-statistic.svg";
import vector6 from "./src/group-main.svg";
import vector7 from "./src/vector-account.svg";
import "./pagemenustyle.css";

const MenuGroup = ({
    onMenuClickAccount,
    onMenuClickSleep, 
    onMenuClickMain,
    onMenuClickStatistic,
    onMenuClickChat,
  }) => {
  return (
    <div className="menu-group div-2">
      <div className="view-menu">
        <img 
          className="vector-fourth" 
          alt="Vector" 
          src={vector5} 
          onClick={onMenuClickStatistic}
        />
        <div className="group-wrapper-pagemenu">
          <img 
          className="group-second" 
          alt="Group" 
          src={group34}
          onClick={onMenuClickSleep} 
        />
        </div>
        <img
          className="vector-center"
          alt="Vector"
          src={vector6}
          onClick={onMenuClickMain}
          style={{ cursor: "pointer" }}
        />
        <img 
          className="vector-left" 
          alt="Vector" 
          src={vector7} 
          onClick={onMenuClickAccount}
        />
        <img 
          className="group-right" 
          alt="Group" 
          src={group} 
          onClick={onMenuClickChat}
        />
      </div>
    </div>
  );
};

export default MenuGroup;
