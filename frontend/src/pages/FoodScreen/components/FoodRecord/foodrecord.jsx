import React from "react";
import line100 from "../../src/line-100.svg";
import vector5 from "../../src/vector-5.svg";
import "../../foodscreenstyle.css";

const FoodRecord = ({ volume = "500 ккал", label = "Продукт" , grams = "100 г"}) => {
  return (
    <div className="food-record">
      <div className="text-wrapper-5">{volume}</div>
      <img className="line" alt="Line" src={line100} />
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

export default FoodRecord;
