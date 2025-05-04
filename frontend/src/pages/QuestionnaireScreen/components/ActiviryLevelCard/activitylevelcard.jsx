import React from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const ActivityLevelCard = ({ onPrev, onNext }) => {
  return(
    <div className="questionnaire-cards">
        <img className="vectorPrevCard" alt="Vector" src={vectorPrev} onClick={onPrev}/>

        <img className="vectorNextCard" alt="Vector" src={vectorNext} onClick={onNext}/>

        <p className="textCard">
          <span className="text-wrapper-card">
            Выбери уровень <br />
          </span>

          <span className="text-wrapper-card-2">активности</span>

          <span className="text-wrapper-card">!</span>
        </p>
        
    </div>
  );
};