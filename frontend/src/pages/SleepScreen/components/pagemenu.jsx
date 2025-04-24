import React from "react";
import group34 from "../src/group-34.png";
import group from "../src/group.png";
import vector5 from "../src/vector-5.svg";
import vector6 from "../src/vector-6.svg";
import vector7 from "../src/vector-7.svg";

const MenuGroup = ({ onMenuClick }) => {
  return (
    <div className="menu-group div-2">
      <div className="view-2">
        <img className="vector-5" alt="Vector" src={vector5} />
        <div className="group-wrapper">
          <img className="group-3" alt="Group" src={group34} />
        </div>
        <img
          className="vector-6"
          alt="Vector"
          src={vector6}
          onClick={onMenuClick}
          style={{ cursor: "pointer" }}
        />
        <img className="vector-7" alt="Vector" src={vector7} />
        <img className="group-4" alt="Group" src={group} />
      </div>
    </div>
  );
};

export default MenuGroup;
