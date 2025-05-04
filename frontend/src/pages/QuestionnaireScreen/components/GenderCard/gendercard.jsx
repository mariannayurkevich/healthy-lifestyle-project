import React from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const GenderCard = ({ onPrev, onNext }) => {
  return(
    <div className="questionnaire-cards">
        <img className="vectorPrevCard" alt="Vector" src={vectorPrev} onClick={onPrev}/>

        <img className="vectorNextCard" alt="Vector" src={vectorNext} onClick={onNext}/>

        <p className="textCard">
          <span className="text-wrapper-card">
            Выбери <br /> свой 
          </span>

          <span className="text-wrapper-card-2"> пол</span>

          <span className="text-wrapper-card">!</span>
        </p>
        
    </div>
  );
};