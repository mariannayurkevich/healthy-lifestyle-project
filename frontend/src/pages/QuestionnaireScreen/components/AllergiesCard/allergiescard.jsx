import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const AllergiesCard = ({ onPrev, onNext }) => {
  const [allergy, setAllergy] = useState("");

  return (
    <div className="questionnaire-cards">
      <img
        className="vectorPrevCard"
        alt="Vector"
        src={vectorPrev}
        onClick={onPrev}
      />

      <img
        className="vectorNextCard"
        alt="Vector"
        src={vectorNext}
        onClick={onNext}
      />

      <p className="textCard">
        <span className="text-wrapper-card">
          Если есть <br />
        </span>

        <span className="text-wrapper-card-2">аллергии</span>

        <span className="text-wrapper-card">
          , <br /> напиши их!
        </span>
      </p>

      {/* Поле для ввода со множественными строками */}
      <div className="allergy-input-wrapper">
        <textarea
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
          placeholder="Аллергия на ..."
          className="allergy-input"
          rows="4" /* Количество строк по умолчанию */
        />
      </div>
    </div>
  );
};

export default AllergiesCard;
