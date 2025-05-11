import React from "react";
import group34 from "./src/group-sleep.svg";
import vector5 from "./src/vector-statistic.svg";
import activeVector5 from "./src/vector-statistic-active.svg";
import vector6 from "./src/group-main.svg";
import activeVector6 from "./src/vector-main-active.svg";
import vector7 from "./src/vector-account.svg";
import activeVector7 from "./src/vector-account-active.svg";
import group from "./src/group-chat.svg";
import "./pagemenustyle.css";

const MenuGroup = ({
  activePage, // например, "account", "sleep", "main", "statistic" или "chat"
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
          className={`vector-fourth ${activePage === "statistic" ? "active" : ""}`}
          alt="Statistic" 
          src={activePage === "statistic" ? activeVector5 : vector5} 
          onClick={onMenuClickStatistic}
        />
        <div className="group-wrapper-pagemenu">
          <img 
            className={`group-second ${activePage === "sleep" ? "active" : ""}`}
            alt="Sleep"
            src={group34} 
            onClick={onMenuClickSleep} 
          />
        </div>
        <img
          className={`vector-center ${activePage === "main" ? "active" : ""}`}
          alt="Main"
          src={activePage === "main" ? activeVector6 : vector6}
          onClick={onMenuClickMain}
          style={{ cursor: "pointer" }}
        />
        <img 
          className={`vector-left ${activePage === "account" ? "active" : ""}`}
          alt="Account" 
          src={activePage === "account" ? activeVector7 : vector7}
          onClick={onMenuClickAccount}
        />
        <img 
          className={`group-right ${activePage === "chat" ? "active" : ""}`}
          alt="Chat" 
          src={group} 
          onClick={onMenuClickChat}
        />
      </div>
    </div>
  );
};

export default MenuGroup;
