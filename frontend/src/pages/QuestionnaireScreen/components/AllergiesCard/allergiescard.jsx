import React from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const AllergiesCard = ({ onPrev, onNext }) => {
  return(
    <div className="questionnaire-cards">
        <img className="vectorPrevCard" alt="Vector" src={vectorPrev} onClick={onPrev}/>

        <img className="vectorNextCard" alt="Vector" src={vectorNext} onClick={onNext}/>

        <p className="textCard">
          <span className="text-wrapper-card">
            Если есть <br />
          </span>

          <span className="text-wrapper-card-2">аллерии</span>

          <span className="text-wrapper-card">, <br />напиши их!</span>
        </p>
        
    </div>
  );
};