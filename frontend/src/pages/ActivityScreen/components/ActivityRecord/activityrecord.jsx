import React from "react";
import line100 from "../../src/line-100.svg";
import vector5 from "../../src/vector-6.svg";
import "../../activityscreenstyle.css";

const ActivityRecord = ({ volume = "500 ккал", label = "Активность" , grams = "30 мин", onClick}) => {
  return (
    <div className="activity-record" onClick={onClick} style={{cursor: "pointer"}}>
      <div className="text-wrapper-5">{volume}</div>
      <img className="line-2" alt="Line" src={line100} />
      <img className="vector-2" alt="Vector" src={vector5} />

      <p className="element">
        <span className="span">
            {label}
            <br />
        </span>

        <span className="text-wrapper-6">{grams}</span>
      </p>
    </div>
  );
};

export default ActivityRecord;