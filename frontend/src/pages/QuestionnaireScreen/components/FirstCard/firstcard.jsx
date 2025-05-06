import React from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const FirstCard = ({ onNext }) => {
  return(
    <div className="questionnaire-cards">
        <img className="vectorNextCard" alt="Vector" src={vectorNext} onClick={onNext}/>

        <p className="textCard">
          <span className="text-wrapper-card">
            Давай <br />познакомимся <br />
          </span>

          <span className="text-wrapper-card-2">поближе</span>

          <span className="text-wrapper-card">!</span>
        </p>
        
    </div>
  );
};